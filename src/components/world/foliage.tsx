import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"

import {
  CASTLE_LOOP_RADIUS,
  groundColour,
  ISLAND_RADIUS,
  noise2,
  places,
  seeded,
  terrainHeight,
  terrainSlope,
} from "./terrain-shape"
import { SUN_DIRECTION, tint } from "./daylight"
import { paintedToon, palette } from "./toon"

function paint(
  geometry: THREE.BufferGeometry,
  colour: (y: number) => THREE.Color
) {
  const position = geometry.attributes.position
  const colours = new Float32Array(position.count * 3)
  for (let i = 0; i < position.count; i++) {
    colour(position.getY(i)).toArray(colours, i * 3)
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3))
  return geometry
}

// Where the leaves of one tree sit, in the tree's own space: a few
// ellipsoids that the painted leaf cards are scattered over.
type Blob = { centre: THREE.Vector3; radius: THREE.Vector3 }
type TreeShape = {
  // Trunk and a darker inner crown that fills the gaps between leaf cards
  // and casts the tree's shadow.
  geometry: THREE.BufferGeometry
  blobs: Blob[]
  crown: THREE.Vector3
  cards: number
}

function lumpy(
  geometry: THREE.BufferGeometry,
  centre: THREE.Vector3,
  seed: number,
  amount: number
) {
  const position = geometry.attributes.position
  const normal = geometry.attributes.normal
  const v = new THREE.Vector3()
  const n = new THREE.Vector3()
  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i)
    n.fromBufferAttribute(normal, i)
    v.addScaledVector(n, noise2(v.x * 1.3 + seed, v.z * 1.3 + v.y) * amount)
    position.setXYZ(i, v.x, v.y, v.z)
    n.lerp(v.clone().sub(centre).normalize(), 0.8).normalize()
    normal.setXYZ(i, n.x, n.y, n.z)
  }
  return geometry
}

// A round, cloud-like broadleaf crown made of a few overlapping masses.
function broadleaf(seed: number): TreeShape {
  const random = seeded(seed)
  const height = 1.6 + random() * 1.2
  const size = 1.5 + random() * 0.8
  const crown = new THREE.Vector3(0, height + size * 0.55, 0)
  const parts: THREE.BufferGeometry[] = []
  const blobs: Blob[] = []

  const trunk = new THREE.CylinderGeometry(0.09, 0.2, height + size * 0.5, 7)
  trunk.translate(0, (height + size * 0.5) / 2, 0)
  parts.push(paint(trunk.toNonIndexed(), () => new THREE.Color(palette.trunk)))

  const count = 5 + Math.floor(random() * 3)
  for (let b = 0; b < count; b++) {
    const r = size * (0.5 + random() * 0.32)
    const centre = crown
      .clone()
      .add(
        new THREE.Vector3(
          (random() - 0.5) * size * 1.1,
          (random() - 0.3) * size * 0.7,
          (random() - 0.5) * size * 1.1
        )
      )
    blobs.push({ centre, radius: new THREE.Vector3(r, r * 0.85, r) })
    const core = new THREE.IcosahedronGeometry(r * 0.68, 2)
    core.translate(centre.x, centre.y, centre.z)
    parts.push(
      paint(lumpy(core, crown, seed, r * 0.1), () =>
        new THREE.Color(palette.leaf).multiplyScalar(0.55)
      )
    )
  }
  return { geometry: mergeGeometries(parts), blobs, crown, cards: 48 }
}

// A tall, narrow poplar like the ones lining the hillsides in the film's
// backgrounds.
function poplar(seed: number): TreeShape {
  const random = seeded(seed)
  const height = 5.5 + random() * 2.5
  const width = 0.85 + random() * 0.25
  const crown = new THREE.Vector3(0, 1.1 + height / 2, 0)
  const trunk = new THREE.CylinderGeometry(0.07, 0.14, 1.6, 6)
  trunk.translate(0, 0.8, 0)
  const core = new THREE.IcosahedronGeometry(1, 3)
  core.scale(width * 0.7, height * 0.4, width * 0.7)
  core.translate(crown.x, crown.y, crown.z)
  return {
    geometry: mergeGeometries([
      paint(trunk.toNonIndexed(), () => new THREE.Color(palette.trunk)),
      paint(lumpy(core, crown, seed, 0.1), () =>
        new THREE.Color(palette.pine).multiplyScalar(0.6)
      ),
    ]),
    blobs: [
      { centre: crown, radius: new THREE.Vector3(width, height / 2, width) },
    ],
    crown,
    cards: 34,
  }
}

type Spot = {
  position: THREE.Vector3
  scale: number
  turn: number
  tall: boolean
}

function treeSpots() {
  const random = seeded(99)
  const spots: Spot[] = []
  const keepClear = [
    { at: places.harbor, radius: 8 },
    { at: places.meadow, radius: 7.5 },
    { at: places.lookout, radius: 3.5 },
  ]
  for (let x = -ISLAND_RADIUS; x <= ISLAND_RADIUS; x += 2.9) {
    for (let z = -ISLAND_RADIUS; z <= ISLAND_RADIUS; z += 2.9) {
      const px = x + (random() - 0.5) * 2
      const pz = z + (random() - 0.5) * 2
      const r = Math.hypot(px, pz)
      if (r > ISLAND_RADIUS * 0.86) continue
      // Leave the middle open for the castle's walk.
      if (r < CASTLE_LOOP_RADIUS + 6.5) continue
      if (
        keepClear.some((c) => Math.hypot(px - c.at.x, pz - c.at.z) < c.radius)
      )
        continue
      const h = terrainHeight(px, pz)
      if (h < 0.8 || terrainSlope(px, pz) > 1.2) continue
      // Groves where the noise is high, lone trees elsewhere.
      const grove = noise2(px * 0.07 + 40, pz * 0.07)
      if (grove < 0.22 && random() > 0.05) continue
      spots.push({
        position: new THREE.Vector3(px, h - 0.15, pz),
        scale: 0.8 + random() * 0.55,
        turn: random() * Math.PI * 2,
        tall: random() < (h > 4 ? 0.65 : 0.22),
      })
    }
  }
  return spots
}

function spotMatrix(spot: Spot) {
  return new THREE.Matrix4().compose(
    spot.position,
    new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      spot.turn
    ),
    new THREE.Vector3().setScalar(spot.scale)
  )
}

function TreeBodies({ shape, spots }: { shape: TreeShape; spots: Spot[] }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const material = useMemo(
    () => paintedToon({ vertexColors: true, brush: 0.12, brushScale: 0.8 }),
    []
  )
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    spots.forEach((spot, i) => mesh.setMatrixAt(i, spotMatrix(spot)))
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [spots])
  return (
    <instancedMesh
      ref={ref}
      args={[shape.geometry, material, spots.length]}
      castShadow
    />
  )
}

const leafVertex = /* glsl */ `
#include <fog_pars_vertex>
attribute vec3 aCentre;
attribute vec3 aNormal;
attribute float aSize;
attribute float aCell;
attribute float aSpin;
attribute vec3 aTint;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vTint;
void main() {
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float c = cos(aSpin);
  float s = sin(aSpin);
  vec2 q = mat2(c, -s, s, c) * position.xy;
  vec3 sway = vec3(
    sin(uTime * 0.9 + aCentre.x * 0.4 + aCentre.y) * 0.04,
    0.0,
    cos(uTime * 0.7 + aCentre.z * 0.4) * 0.04
  );
  vec3 offset = (right * q.x + up * q.y) * aSize;
  vec3 world = aCentre + sway + offset;
  vUv = uv * 0.5 + vec2(mod(aCell, 2.0), floor(aCell / 2.0)) * 0.5;
  // Bend the normal across the card so each clump shades like a soft ball.
  vNormal = normalize(aNormal + (right * q.x + up * q.y) * 1.1);
  vTint = aTint;
  vec4 mvPosition = viewMatrix * vec4(world, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`

const leafFragment = /* glsl */ `
#include <fog_pars_fragment>
uniform sampler2D uAtlas;
uniform vec3 uSun;
uniform vec3 uTint;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vTint;
void main() {
  vec4 paint = texture2D(uAtlas, vUv);
  if (paint.a < 0.5) discard;
  float light = dot(normalize(vNormal), uSun);
  // Flat bands of light, with cool blue in the shade.
  vec3 shade = light > 0.3 ? vec3(1.0)
    : light > -0.2 ? vec3(0.8, 0.84, 0.88)
    : vec3(0.58, 0.66, 0.76);
  gl_FragColor = vec4(paint.rgb * vTint * shade * uTint, 1.0);
  #include <colorspace_fragment>
  #include <fog_fragment>
}
`

function LeafCards({
  trees,
}: {
  trees: { shape: TreeShape; spots: Spot[] }[]
}) {
  const atlas = useTexture("/textures/leaf-clumps.webp", (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
  })
  const geometry = useMemo(() => {
    const random = seeded(17)
    const centres: number[] = []
    const normals: number[] = []
    const sizes: number[] = []
    const cells: number[] = []
    const spins: number[] = []
    const tints: number[] = []
    const dir = new THREE.Vector3()
    const point = new THREE.Vector3()
    const crown = new THREE.Vector3()
    const normal = new THREE.Vector3()
    for (const { shape, spots } of trees) {
      for (const spot of spots) {
        const matrix = spotMatrix(spot)
        crown.copy(shape.crown).applyMatrix4(matrix)
        const tint = 0.9 + random() * 0.2
        for (let c = 0; c < shape.cards; c++) {
          const blob = shape.blobs[c % shape.blobs.length]
          // Mostly on the upper and outer surface, where the light falls.
          dir.set(random() * 2 - 1, random() * 1.6 - 0.6, random() * 2 - 1)
          dir.normalize()
          point
            .copy(dir)
            .multiply(blob.radius)
            .multiplyScalar(0.75 + random() * 0.25)
            .add(blob.centre)
            .applyMatrix4(matrix)
          normal.copy(point).sub(crown).normalize().lerp(dir, 0.4).normalize()
          centres.push(point.x, point.y, point.z)
          normals.push(normal.x, normal.y, normal.z)
          const width = Math.min(blob.radius.x, blob.radius.y)
          sizes.push(width * spot.scale * (1.9 + random() * 0.7))
          cells.push(Math.floor(random() * 4))
          spins.push((random() - 0.5) * 0.7)
          const t = tint * (0.94 + random() * 0.12)
          tints.push(t, t, t)
        }
      }
    }
    const quad = new THREE.PlaneGeometry(1, 1)
    const geometry = new THREE.InstancedBufferGeometry()
    geometry.index = quad.index
    geometry.attributes.position = quad.attributes.position
    geometry.attributes.uv = quad.attributes.uv
    const attribute = (data: number[], size: number) =>
      new THREE.InstancedBufferAttribute(new Float32Array(data), size)
    geometry.setAttribute("aCentre", attribute(centres, 3))
    geometry.setAttribute("aNormal", attribute(normals, 3))
    geometry.setAttribute("aSize", attribute(sizes, 1))
    geometry.setAttribute("aCell", attribute(cells, 1))
    geometry.setAttribute("aSpin", attribute(spins, 1))
    geometry.setAttribute("aTint", attribute(tints, 3))
    geometry.instanceCount = sizes.length
    return geometry
  }, [trees])
  const material = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: leafVertex,
      fragmentShader: leafFragment,
      fog: true,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        { uTime: { value: 0 }, uSun: { value: SUN_DIRECTION.clone() } },
      ]),
    })
    material.uniforms.uAtlas = { value: atlas }
    material.uniforms.uTint = tint
    return material
  }, [atlas])
  const ref =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })
  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  )
}

export function Trees() {
  const trees = useMemo(() => {
    const shapes = [
      broadleaf(1),
      broadleaf(2),
      broadleaf(3),
      poplar(4),
      poplar(5),
    ]
    const groups = shapes.map(() => [] as Spot[])
    treeSpots().forEach((spot, i) => {
      const kind = spot.tall ? 3 + (i % 2) : i % 3
      groups[kind].push(spot)
    })
    return shapes
      .map((shape, i) => ({ shape, spots: groups[i] }))
      .filter((tree) => tree.spots.length > 0)
  }, [])
  return (
    <>
      {trees.map((tree, i) => (
        <TreeBodies key={i} {...tree} />
      ))}
      <LeafCards trees={trees} />
    </>
  )
}

const grassVertex = /* glsl */ `
#include <fog_pars_vertex>
attribute vec3 aOffset;
attribute float aScale;
attribute float aAngle;
attribute vec3 aTint;
uniform float uTime;
varying float vHeight;
varying vec3 vTint;
void main() {
  vec3 p = position;
  float h = p.y;
  p.x *= 1.0 - h * 0.9;
  p *= aScale;
  float c = cos(aAngle);
  float s = sin(aAngle);
  p.xz = mat2(c, -s, s, c) * p.xz;
  float gust = sin(uTime * 1.3 + aOffset.x * 0.22 + aOffset.z * 0.17);
  float flutter = sin(uTime * 3.1 + aOffset.x * 1.7 + aOffset.z * 1.3) * 0.3;
  float bend = (gust * 0.7 + flutter) * h * h;
  p.x += bend * 0.32;
  p.z += bend * 0.12;
  vHeight = h;
  vTint = aTint;
  vec4 mvPosition = viewMatrix * vec4(p + aOffset, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`

const grassFragment = /* glsl */ `
#include <fog_pars_fragment>
uniform vec3 uTint;
varying float vHeight;
varying vec3 vTint;
void main() {
  // Three flat bands from the shaded root to the sunlit tip.
  float band = floor(vHeight * 3.0) / 2.0;
  vec3 colour = vTint * mix(0.72, 1.18, band) * uTint;
  gl_FragColor = vec4(colour, 1.0);
  #include <fog_fragment>
}
`

export function Grass({ count = 26000 }: { count?: number }) {
  const geometry = useMemo(() => {
    const blade = new THREE.PlaneGeometry(0.11, 1, 1, 3)
    blade.translate(0, 0.5, 0)
    const geometry = new THREE.InstancedBufferGeometry()
    geometry.index = blade.index
    geometry.attributes.position = blade.attributes.position
    const random = seeded(5)
    const offsets: number[] = []
    const scales: number[] = []
    const angles: number[] = []
    const tints: number[] = []
    let placed = 0
    let tries = 0
    while (placed < count && tries < count * 8) {
      tries++
      const r = Math.sqrt(random()) * ISLAND_RADIUS * 0.9
      const a = random() * Math.PI * 2
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      const h = terrainHeight(x, z)
      const slope = terrainSlope(x, z)
      if (h < 0.5 || slope > 1) continue
      // Grass grows in tufts and drifts, leaving bare patches between.
      const patch =
        noise2(x * 0.18 + 11, z * 0.18) + noise2(x * 0.6, z * 0.6) * 0.35
      const meadow = Math.hypot(x - places.meadow.x, z - places.meadow.z) < 9
      if (patch < (meadow ? -0.6 : 0.05)) continue
      offsets.push(x, h - 0.05, z)
      scales.push((meadow ? 0.75 : 0.45) + random() * 0.45)
      angles.push(random() * Math.PI)
      const tint = groundColour(x, z, h).multiplyScalar(0.92 + random() * 0.16)
      tints.push(tint.r, tint.g, tint.b)
      placed++
    }
    geometry.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
    )
    geometry.setAttribute(
      "aScale",
      new THREE.InstancedBufferAttribute(new Float32Array(scales), 1)
    )
    geometry.setAttribute(
      "aAngle",
      new THREE.InstancedBufferAttribute(new Float32Array(angles), 1)
    )
    geometry.setAttribute(
      "aTint",
      new THREE.InstancedBufferAttribute(new Float32Array(tints), 3)
    )
    geometry.instanceCount = placed
    geometry.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(),
      ISLAND_RADIUS + 2
    )
    return geometry
  }, [count])

  const material = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: grassVertex,
      fragmentShader: grassFragment,
      side: THREE.DoubleSide,
      fog: true,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        { uTime: { value: 0 } },
      ]),
    })
    material.uniforms.uTint = tint
    return material
  }, [])
  const ref =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })
  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  )
}
