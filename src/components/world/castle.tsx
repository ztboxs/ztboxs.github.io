import { Cloud, Clouds, Outlines, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

import { SmokeMaterial } from "./daylight"
import { INK, paint, Part } from "./parts"
import { castleAt } from "./places"
import { paintedToon } from "./toon"

type Vec3 = [number, number, number]

const BODY_URL = "/models/castle-body.glb"

// The hull and the town on its back are one sculpted model (generated from
// the castle painting with Hunyuan3D; each part takes the island paint
// nearest to the painting's colour on it, with rust and tile red mixed into
// the rear so it is not one iron lump). It is 1.25 units long, faces +x
// and rests on y = 0, so it is stretched to size here and set down on the
// legs' hips.
const BODY_SCALE: Vec3 = [3.75, 4.5, 3.75]
const BODY_LIFT = 2.2

// Chimney mouths on the model, in its own units.
const CHIMNEYS: Vec3[] = [
  [-0.41, 0.85, 0.08],
  [-0.35, 0.84, -0.1],
  [0, 0.93, -0.08],
]

function CastleBody() {
  const { scene } = useGLTF(BODY_URL)
  const geometry = useMemo(() => {
    let found: THREE.Mesh | undefined
    scene.updateMatrixWorld(true)
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) found = object
    })
    const mesh = found!
    // The file is quantised: positions are packed into [-1, 1] and the node
    // carries the scale back. Unpack them to floats, bake that transform in,
    // and work out the normals, which the file leaves out to stay small.
    const packed = mesh.geometry.attributes.position
    const positions = new Float32Array(packed.count * 3)
    for (let i = 0; i < packed.count; i++) {
      positions.set([packed.getX(i), packed.getY(i), packed.getZ(i)], i * 3)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", mesh.geometry.attributes.color)
    geometry.setIndex(mesh.geometry.index)
    geometry.applyMatrix4(mesh.matrixWorld)
    geometry.computeVertexNormals()
    return geometry
  }, [scene])
  const material = useMemo(
    () => paintedToon({ vertexColors: true, brush: 0.06, brushScale: 1.6 }),
    []
  )
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, BODY_LIFT, 0]}
      scale={BODY_SCALE}
      castShadow
      receiveShadow
    >
      <Outlines thickness={1.1} color={INK} />
    </mesh>
  )
}

useGLTF.preload(BODY_URL)

const TOES = [-0.55, 0, 0.55]

// A bird's leg: a thick thigh swings from the hip, the shin bends back at a
// brass knee, and three iron toes and a spur grip the ground.
function Leg({ position, phase }: { position: Vec3; phase: number }) {
  const hip = useRef<THREE.Group>(null)
  const knee = useRef<THREE.Group>(null)
  const ankle = useRef<THREE.Group>(null)
  useFrame((state) => {
    const swing = state.clock.elapsedTime * STRIDE + phase
    const lift = Math.max(0, Math.cos(swing))
    if (hip.current) hip.current.rotation.z = Math.sin(swing) * 0.36
    // Fold the knee and point the toes down while the foot is in the air.
    if (knee.current) knee.current.rotation.z = -0.18 - lift * 0.6
    if (ankle.current)
      ankle.current.rotation.z = 0.2 + lift * 0.35 - Math.sin(swing) * 0.2
  })
  return (
    <group position={position}>
      <Part material={paint.ironDark} scale={[1, 0.8, 1]}>
        <sphereGeometry args={[0.3, 12, 8]} />
      </Part>
      <group ref={hip}>
        <Part material={paint.iron} position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.26, 0.18, 1.4, 10]} />
        </Part>
        <Part material={paint.rust} position={[0, -0.45, 0]} outline={1.2}>
          <cylinderGeometry args={[0.29, 0.29, 0.22, 10]} />
        </Part>
        <group position={[0, -1.4, 0]} ref={knee}>
          <Part material={paint.brass}>
            <sphereGeometry args={[0.24, 12, 8]} />
          </Part>
          <Part material={paint.ironDark} position={[0, -0.72, 0]}>
            <cylinderGeometry args={[0.14, 0.11, 1.45, 8]} />
          </Part>
          <group position={[0, -1.45, 0]} ref={ankle}>
            <Part material={paint.iron} outline={1.4}>
              <sphereGeometry args={[0.13, 8, 6]} />
            </Part>
            {TOES.map((angle) => (
              <Part
                key={angle}
                material={paint.ironDark}
                position={[
                  0.24 * Math.cos(angle),
                  -0.08,
                  0.24 * Math.sin(angle),
                ]}
                rotation={[0, -angle, -1.45]}
                outline={1.6}
              >
                <coneGeometry args={[0.075, 0.55, 6]} />
              </Part>
            ))}
            <Part
              material={paint.ironDark}
              position={[-0.18, -0.06, 0]}
              rotation={[0, 0, 1.6]}
              outline={1.4}
            >
              <coneGeometry args={[0.06, 0.32, 5]} />
            </Part>
          </group>
        </group>
      </group>
    </group>
  )
}

const LEGS: { position: Vec3; phase: number }[] = [
  { position: [1.3, 2.8, 0.62], phase: 0 },
  { position: [1.3, 2.8, -0.62], phase: Math.PI },
  { position: [-1.3, 2.8, 0.62], phase: Math.PI },
  { position: [-1.3, 2.8, -0.62], phase: 0 },
]

const STRIDE = 1.9
const CASTLE_SCALE = 1.8

const chimneyTop = ([x, y, z]: Vec3): Vec3 => [
  x * BODY_SCALE[0],
  BODY_LIFT + y * BODY_SCALE[1] + 1.4,
  z * BODY_SCALE[2],
]

export function Castle() {
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (root.current) {
      root.current.rotation.y = castleAt(t, root.current.position).yaw
    }
    // Each step lifts the whole heap and rolls it a little onto the
    // planted side.
    const step = t * STRIDE
    if (body.current) {
      body.current.position.y = Math.abs(Math.sin(step)) * 0.16
      body.current.rotation.x = Math.sin(step) * 0.03
      body.current.rotation.z = Math.cos(step * 2) * 0.014
    }
  })

  return (
    <group ref={root} scale={CASTLE_SCALE}>
      <group ref={body}>
        <CastleBody />
        {/* Smoke rising from the chimneys. */}
        <Clouds
          texture="/textures/cloud.png"
          limit={70}
          material={SmokeMaterial}
        >
          {CHIMNEYS.map((chimney, i) => (
            <Cloud
              key={i}
              seed={3 + i * 5}
              segments={12 - i * 2}
              bounds={[0.5, 1.4, 0.5]}
              volume={1.5 - i * 0.2}
              growth={3}
              speed={0.5}
              opacity={0.8}
              color="#f6f3ee"
              position={chimneyTop(chimney)}
            />
          ))}
        </Clouds>
        {LEGS.map((leg, i) => (
          <Leg key={i} {...leg} />
        ))}
      </group>
    </group>
  )
}
