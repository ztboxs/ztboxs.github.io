import { Cloud, Clouds } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"

import { SmokeMaterial } from "./daylight"
import { Chimney, Cottage, paint, Part } from "./parts"
import {
  noise2,
  places,
  seeded,
  terrainHeight,
  WATER_LEVEL,
} from "./terrain-shape"
import { paintedToon } from "./toon"

const at = (x: number, z: number, lift = 0): [number, number, number] => [
  x,
  terrainHeight(x, z) + lift,
  z,
]

// --- The harbour: a jetty running out into the bay, a moored sailboat and
// a boathouse with a lamp. ---------------------------------------------------

const JETTY_START = new THREE.Vector3(places.harbor.x - 1, 0, places.harbor.z)
const JETTY_DIRECTION = new THREE.Vector3(3, 0, -1).normalize()
const JETTY_LENGTH = 9
const JETTY_YAW = Math.atan2(-JETTY_DIRECTION.z, JETTY_DIRECTION.x)

function Jetty() {
  const deck = WATER_LEVEL + 0.55
  const posts = Array.from({ length: 7 }, (_, i) => (i / 6) * JETTY_LENGTH)
  return (
    <group
      position={[JETTY_START.x, deck, JETTY_START.z]}
      rotation-y={JETTY_YAW}
    >
      <Part material={paint.wood} position={[JETTY_LENGTH / 2, 0, 0]}>
        <boxGeometry args={[JETTY_LENGTH, 0.14, 1.5]} />
      </Part>
      {posts.flatMap((x) =>
        [-0.68, 0.68].map((z) => (
          <Part
            key={`${x}${z}`}
            material={paint.woodDark}
            position={[x, -0.6, z]}
            outline={1.4}
          >
            <cylinderGeometry args={[0.09, 0.1, 1.5, 6]} />
          </Part>
        ))
      )}
      {/* Mooring posts at the far end. */}
      {[-0.68, 0.68].map((z) => (
        <Part
          key={z}
          material={paint.woodDark}
          position={[JETTY_LENGTH - 0.2, 0.35, z]}
          outline={1.4}
        >
          <cylinderGeometry args={[0.1, 0.1, 0.6, 6]} />
        </Part>
      ))}
    </group>
  )
}

// A triangular sail between three corners (tack, clew, head), finely
// divided and bellied out sideways as if the wind had filled it.
function sail(
  tack: [number, number],
  clew: [number, number],
  head: [number, number],
  belly: number
) {
  const steps = 10
  const positions: number[] = []
  const index: number[] = []
  const row: number[] = []
  for (let i = 0; i <= steps; i++) {
    row.push(positions.length / 3)
    for (let j = 0; j <= steps - i; j++) {
      const s = j / steps
      const t = i / steps
      const x = tack[0] + s * (clew[0] - tack[0]) + t * (head[0] - tack[0])
      const y = tack[1] + s * (clew[1] - tack[1]) + t * (head[1] - tack[1])
      // Deepest in the middle of the sail, flatter towards the head.
      const z =
        Math.sin(Math.PI * Math.min(1, s / Math.max(1e-3, 1 - t))) *
        belly *
        (1 - t * 0.7)
      positions.push(x, y, z)
    }
  }
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps - i; j++) {
      const a = row[i] + j
      const b = row[i] + j + 1
      const c = row[i + 1] + j
      index.push(a, b, c)
      if (j < steps - i - 1) index.push(b, row[i + 1] + j + 1, c)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  )
  geometry.setIndex(index)
  geometry.computeVertexNormals()
  return geometry
}

// The mainsail runs from the mast back along the boom; the jib from the
// masthead down to the bow.
const mainsail = sail([0, 0.05], [-1.55, 0.05], [0, 3.25], 0.24)
const jib = sail([0.12, 0.2], [1.95, 0.1], [0.12, 3.0], 0.16)

function Sailboat() {
  const boat = useRef<THREE.Group>(null)
  const mooring = JETTY_START.clone()
    .addScaledVector(JETTY_DIRECTION, JETTY_LENGTH - 2)
    .add(
      new THREE.Vector3(
        JETTY_DIRECTION.z,
        0,
        -JETTY_DIRECTION.x
      ).multiplyScalar(-2)
    )
  useFrame((state) => {
    if (!boat.current) return
    const t = state.clock.elapsedTime
    boat.current.position.y = WATER_LEVEL + 0.15 + Math.sin(t * 1.1) * 0.08
    boat.current.rotation.z = Math.sin(t * 0.9) * 0.04
    boat.current.rotation.x = Math.sin(t * 0.7 + 1) * 0.03
  })
  return (
    <group position={[mooring.x, 0, mooring.z]} rotation-y={JETTY_YAW}>
      <group ref={boat}>
        {/* Hull: a bowl, white above a blue keel stripe. */}
        <Part material={paint.plaster} scale={[2.3, 0.75, 0.85]}>
          <sphereGeometry
            args={[1, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
          />
        </Part>
        <Part
          material={paint.hullBlue}
          position={[0, -0.18, 0]}
          scale={[2.0, 0.55, 0.72]}
          outline={0}
        >
          <sphereGeometry
            args={[1, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
          />
        </Part>
        <Part
          material={paint.wood}
          position={[0, -0.05, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[2.2, 0.8, 1]}
          outline={0}
        >
          <circleGeometry args={[1, 24]} />
        </Part>
        {/* The white gunwale around the deck. */}
        <Part
          material={paint.plaster}
          position={[0, -0.02, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[2.28, 0.84, 1]}
          outline={1.2}
        >
          <torusGeometry args={[1, 0.05, 6, 32]} />
        </Part>
        <Part material={paint.woodDark} position={[0.2, 1.8, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 3.7, 6]} />
        </Part>
        <Part
          material={paint.woodDark}
          position={[-0.55, 0.55, 0]}
          rotation={[0, 0, Math.PI / 2]}
          outline={1.4}
        >
          <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
        </Part>
        <Part
          material={paint.sail}
          geometry={mainsail}
          position={[0.12, 0.5, 0]}
          outline={1.4}
        />
        <Part
          material={paint.sail}
          geometry={jib}
          position={[0.22, 0.5, 0]}
          outline={1.4}
        />
        <Part
          material={paint.tile}
          position={[0.2, 3.75, 0]}
          rotation={[0, 0, -Math.PI / 2]}
          outline={1.2}
        >
          <coneGeometry args={[0.12, 0.6, 3]} />
        </Part>
      </group>
    </group>
  )
}

function Lamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Part material={paint.ironDark} position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 2.4, 6]} />
      </Part>
      <Part material={paint.glow} position={[0, 2.55, 0]} outline={1.6}>
        <boxGeometry args={[0.32, 0.4, 0.32]} />
      </Part>
      <Part material={paint.ironDark} position={[0, 2.85, 0]} outline={1.4}>
        <coneGeometry args={[0.28, 0.25, 4]} />
      </Part>
    </group>
  )
}

function Harbour() {
  const { x, z } = places.harbor
  return (
    <>
      <Jetty />
      <Sailboat />
      <Cottage
        position={at(x - 3.5, z + 2.5, 1)}
        size={[2.4, 2, 2]}
        rotation={0.4}
      />
      <Cottage
        position={at(x - 5.5, z - 1, 0.8)}
        size={[1.8, 1.6, 1.6]}
        rotation={-0.3}
        roof={paint.slate}
      />
      <Lamp position={at(JETTY_START.x - 0.6, JETTY_START.z + 1.2)} />
      {[0, 1, 2].map((i) => (
        <Part
          key={i}
          material={paint.wood}
          position={at(x - 1.8 + i * 0.7, z + 0.9 + (i % 2) * 0.5, 0.35)}
          outline={1.4}
        >
          <cylinderGeometry args={[0.32, 0.32, 0.7, 10]} />
        </Part>
      ))}
    </>
  )
}

// --- The meadow: a field of wildflowers around a small cottage with smoke
// curling from its chimney. --------------------------------------------------

const FLOWER_COLOURS = ["#fffaf0", "#ffe27a", "#9cc2ff", "#ffb6c9", "#ffffff"]

function Flowers({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const material = useMemo(() => paintedToon({ brush: 0.05 }), [])
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const random = seeded(23)
    const matrix = new THREE.Matrix4()
    const colour = new THREE.Color()
    let placed = 0
    while (placed < count) {
      const r = Math.sqrt(random()) * 8.5
      const a = random() * Math.PI * 2
      const fx = places.meadow.x + Math.cos(a) * r
      const fz = places.meadow.z + Math.sin(a) * r
      // Flowers gather in drifts.
      if (noise2(fx * 0.35, fz * 0.35) < -0.2 && random() > 0.15) continue
      const scale = 0.7 + random() * 0.6
      matrix.makeScale(scale, scale * 0.6, scale)
      matrix.setPosition(fx, terrainHeight(fx, fz) + 0.45 + random() * 0.35, fz)
      mesh.setMatrixAt(placed, matrix)
      colour.set(FLOWER_COLOURS[Math.floor(random() * FLOWER_COLOURS.length)])
      mesh.setColorAt(placed, colour)
      placed++
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [count])
  return (
    <instancedMesh ref={ref} args={[undefined, material, count]}>
      <icosahedronGeometry args={[0.12, 1]} />
    </instancedMesh>
  )
}

function Fence({ from, to }: { from: [number, number]; to: [number, number] }) {
  const length = Math.hypot(to[0] - from[0], to[1] - from[1])
  const yaw = Math.atan2(-(to[1] - from[1]), to[0] - from[0])
  const posts = Math.ceil(length / 1.4)
  return (
    <>
      {Array.from({ length: posts + 1 }, (_, i) => {
        const t = i / posts
        const x = from[0] + (to[0] - from[0]) * t
        const z = from[1] + (to[1] - from[1]) * t
        return (
          <group key={i} position={at(x, z)} rotation-y={yaw}>
            <Part
              material={paint.woodDark}
              position={[0, 0.45, 0]}
              outline={1.3}
            >
              <boxGeometry args={[0.1, 0.9, 0.1]} />
            </Part>
            {i < posts && (
              <Part
                material={paint.wood}
                position={[length / posts / 2, 0.62, 0]}
                outline={1.1}
              >
                <boxGeometry args={[length / posts, 0.07, 0.05]} />
              </Part>
            )}
          </group>
        )
      })}
    </>
  )
}

function Meadow() {
  const { x, z } = places.meadow
  const cottage = at(x - 2.5, z - 2.5, 1.05)
  return (
    <>
      <Flowers />
      <Cottage position={cottage} size={[2.6, 2.1, 2.1]} rotation={-0.6} />
      <Chimney
        position={[cottage[0] - 0.6, cottage[1] + 1.3, cottage[2] + 0.3]}
        height={1.2}
        radius={0.18}
      />
      <Clouds texture="/textures/cloud.png" limit={20} material={SmokeMaterial}>
        <Cloud
          seed={12}
          segments={8}
          bounds={[0.4, 1, 0.4]}
          volume={0.9}
          growth={2}
          speed={0.4}
          opacity={0.6}
          color="#f4f1ea"
          position={[cottage[0] - 0.6, cottage[1] + 3.6, cottage[2] + 0.3]}
        />
      </Clouds>
      <Fence from={[x - 6, z + 1]} to={[x - 2, z + 5]} />
      <Fence from={[x - 2, z + 5]} to={[x + 3, z + 6]} />
    </>
  )
}

// --- The lookout: a ring of flat stones on the hilltop with a brass
// telescope and a signpost painted in the four door colours. ----------------

const SIGN_COLOURS = ["#3f6fd1", "#c4473a", "#4f9b4a", "#2a2b3a"]

function Lookout() {
  const { x, z } = places.lookout
  const top = at(x, z)
  return (
    <group position={top}>
      <Part material={paint.stone} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[2.6, 2.8, 0.35, 14]} />
      </Part>
      {/* Telescope on a tripod, pointed at the sky. */}
      <group position={[0.8, 0.2, -0.4]}>
        {[0, 2.1, 4.2].map((angle) => (
          <Part
            key={angle}
            material={paint.woodDark}
            position={[Math.cos(angle) * 0.3, 0.6, Math.sin(angle) * 0.3]}
            rotation={[Math.sin(angle) * 0.3, 0, -Math.cos(angle) * 0.3]}
            outline={1.3}
          >
            <cylinderGeometry args={[0.04, 0.05, 1.3, 5]} />
          </Part>
        ))}
        <Part
          material={paint.brass}
          position={[0, 1.35, 0]}
          rotation={[0.3, 0.4, 0.9]}
        >
          <cylinderGeometry args={[0.12, 0.18, 1.5, 10]} />
        </Part>
      </group>
      {/* Signpost: one arm for each door. */}
      <group position={[-1.1, 0.2, 0.6]}>
        <Part material={paint.woodDark} position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 2.4, 6]} />
        </Part>
        {SIGN_COLOURS.map((colour, i) => (
          <Part
            key={colour}
            material={signPaint(colour)}
            position={[0, 2.1 - i * 0.32, 0]}
            rotation={[0, i * 1.4 + 0.3, 0]}
            outline={1.3}
          >
            <boxGeometry args={[1.0, 0.2, 0.05]} />
          </Part>
        ))}
      </group>
    </group>
  )
}

const signPaints = new Map<string, THREE.Material>()
function signPaint(colour: string) {
  let material = signPaints.get(colour)
  if (!material) {
    material = paintedToon({ color: colour, brush: 0.1, brushScale: 2 })
    signPaints.set(colour, material)
  }
  return material
}

export function Props() {
  return (
    <>
      <Harbour />
      <Meadow />
      <Lookout />
    </>
  )
}
