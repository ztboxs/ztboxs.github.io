import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

import { night } from "./daylight"

const wing = (() => {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.quadraticCurveTo(0.35, 0.12, 0.8, 0.02)
  shape.quadraticCurveTo(0.4, -0.05, 0, -0.14)
  shape.closePath()
  // Lay the wing flat, spanning out along +x.
  return new THREE.ShapeGeometry(shape, 6).rotateX(-Math.PI / 2)
})()

const ink = new THREE.MeshBasicMaterial({
  color: "#3a3940",
  side: THREE.DoubleSide,
  transparent: true,
})

// Each bird's lap: its radius, height, speed (radians a second) and where
// on the lap it starts.
const FLOCK = [
  { radius: 22, height: 20, speed: 0.11, offset: 0 },
  { radius: 23.5, height: 21, speed: 0.11, offset: 0.06 },
  { radius: 21, height: 19.5, speed: 0.11, offset: 0.1 },
  { radius: 24, height: 22, speed: 0.11, offset: -0.05 },
  { radius: 30, height: 26, speed: -0.08, offset: 2.4 },
  { radius: 31, height: 25, speed: -0.08, offset: 2.5 },
]

function Bird({ radius, height, speed, offset }: (typeof FLOCK)[number]) {
  const body = useRef<THREE.Group>(null)
  const left = useRef<THREE.Mesh>(null)
  const right = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const angle = t * speed + offset
    if (body.current) {
      body.current.position.set(
        Math.cos(angle) * radius,
        height + Math.sin(t * 0.7 + offset * 9) * 0.8,
        Math.sin(angle) * radius
      )
      // Fly along the lap (local +x forward), banking into the turn.
      const yaw = Math.atan2(-Math.cos(angle), -Math.sin(angle))
      body.current.rotation.set(
        speed > 0 ? 0.2 : -0.2,
        speed > 0 ? yaw : yaw + Math.PI,
        0
      )
    }
    // Flap, then glide for a moment.
    const beat = Math.sin(t * 7 + offset * 13)
    const flap = (beat > -0.2 ? beat : -0.2) * 0.6
    if (left.current) left.current.rotation.z = flap
    if (right.current) right.current.rotation.z = flap
    // Birds roost at night.
    ink.opacity = 1 - night.value
  })
  return (
    <group ref={body} scale={0.9} rotation-order="YXZ">
      <group rotation-y={Math.PI / 2}>
        <mesh ref={left} geometry={wing} material={ink} />
      </group>
      <group rotation-y={-Math.PI / 2}>
        <mesh ref={right} geometry={wing} material={ink} />
      </group>
    </group>
  )
}

export function Birds() {
  return (
    <>
      {FLOCK.map((bird, i) => (
        <Bird key={i} {...bird} />
      ))}
    </>
  )
}
