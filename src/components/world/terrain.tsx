import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

import { tint } from "./daylight"
import {
  groundColour,
  ISLAND_RADIUS,
  terrainHeight,
  WATER_LEVEL,
} from "./terrain-shape"
import { paintedToon, palette } from "./toon"

const EXTENT = ISLAND_RADIUS + 6
const SEGMENTS = 220

function Ground() {
  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(
      EXTENT * 2,
      EXTENT * 2,
      SEGMENTS,
      SEGMENTS
    )
    plane.rotateX(-Math.PI / 2)
    const position = plane.attributes.position
    const colours = new Float32Array(position.count * 3)
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i)
      const z = position.getZ(i)
      const h = terrainHeight(x, z)
      position.setY(i, h)
      groundColour(x, z, h).toArray(colours, i * 3)
    }
    plane.setAttribute("color", new THREE.BufferAttribute(colours, 3))
    plane.computeVertexNormals()
    return plane
  }, [])
  const material = useMemo(
    () => paintedToon({ vertexColors: true, brush: 0.08, brushScale: 0.22 }),
    []
  )
  return <mesh geometry={geometry} material={material} receiveShadow />
}

// The ground height baked into a texture so the water knows how deep it is.
function useHeightTexture() {
  return useMemo(() => {
    const size = 256
    const data = new Float32Array(size * size)
    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        const x = ((i + 0.5) / size - 0.5) * EXTENT * 2
        const z = ((j + 0.5) / size - 0.5) * EXTENT * 2
        data[j * size + i] = terrainHeight(x, z)
      }
    }
    const texture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RedFormat,
      THREE.FloatType
    )
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true
    return texture
  }, [])
}

const waterVertex = /* glsl */ `
#include <fog_pars_vertex>
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vec4 mvPosition = viewMatrix * world;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`

const waterFragment = /* glsl */ `
#include <fog_pars_fragment>
uniform sampler2D uHeight;
uniform float uExtent;
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uShallow;
uniform vec3 uFoam;
uniform vec3 uSky;
uniform vec3 uTint;
varying vec3 vWorld;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

void main() {
  vec2 uv = vWorld.xz / (uExtent * 2.0) + 0.5;
  bool inside = all(greaterThan(uv, vec2(0.0))) && all(lessThan(uv, vec2(1.0)));
  float ground = inside ? texture2D(uHeight, uv).r : -8.0;
  float depth = max(0.0, -ground);

  // Flat bands of colour from the shallows out to deep water.
  float shade = smoothstep(0.1, 3.2, depth);
  shade = floor(shade * 4.0 + noise(vWorld.xz * 0.15) * 0.6) / 4.0;
  vec3 colour = mix(uShallow, uDeep, clamp(shade, 0.0, 1.0));

  // Foam that hugs the shore and breathes in and out.
  float wobble = noise(vWorld.xz * 0.7 + vec2(uTime * 0.2, 0.0));
  float edge = 0.16 + 0.14 * wobble + 0.05 * sin(uTime * 1.4 + wobble * 6.0);
  float foam = 1.0 - step(edge, depth);
  float ring = step(abs(depth - edge - 0.22), 0.03) * step(0.45, wobble);
  colour = mix(colour, uFoam, max(foam, ring * 0.7));

  // A few painted glints drifting across open water.
  float glint = noise(vec2(vWorld.x * 0.05 + uTime * 0.04, vWorld.z * 0.35));
  colour = mix(colour, uFoam, step(0.93, glint) * 0.22 * smoothstep(1.0, 4.0, depth));

  // Toward the horizon the lake mirrors the pale sky.
  vec3 view = normalize(cameraPosition - vWorld);
  float mirror = pow(1.0 - max(view.y, 0.0), 4.0);
  colour = mix(colour, uSky, mirror * 0.65);
  colour *= uTint;

  gl_FragColor = vec4(colour, 1.0);
  #include <fog_fragment>
}
`

function Water() {
  const heightTexture = useHeightTexture()
  const ref =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null)
  const material = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: waterVertex,
      fragmentShader: waterFragment,
      fog: true,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          uExtent: { value: EXTENT },
          uTime: { value: 0 },
          uDeep: { value: new THREE.Color(palette.waterDeep) },
          uShallow: { value: new THREE.Color(palette.waterShallow) },
          uFoam: { value: new THREE.Color(palette.foam) },
          uSky: { value: new THREE.Color(palette.skyHorizon) },
        },
      ]),
    })
    material.uniforms.uHeight = { value: heightTexture }
    material.uniforms.uTint = tint
    return material
  }, [heightTexture])

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh
      ref={ref}
      rotation-x={-Math.PI / 2}
      position-y={WATER_LEVEL}
      material={material}
    >
      <circleGeometry args={[260, 96]} />
    </mesh>
  )
}

export function Terrain() {
  return (
    <>
      <Ground />
      <Water />
    </>
  )
}
