import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

import { useWorldStore } from "@/stores/world-store"

import { paint } from "./parts"
import { palette } from "./toon"

export const SUN_DIRECTION = new THREE.Vector3(0.55, 0.62, 0.35).normalize()

// Shared by every hand-written shader on the island. `night` runs from 0 at
// midday to 1 under the stars; `tint` is the colour unlit paint (grass,
// leaves, water, distant hills) is multiplied by.
export const night = { value: 0 }
export const tint = { value: new THREE.Color(1, 1, 1) }

// Unlit paint for chimney smoke: pale by day, but its colour is the shared
// night tint so it greys out after dark instead of glowing.
export class SmokeMaterial extends THREE.MeshBasicMaterial {
  constructor() {
    super()
    this.color = tint.value
  }
}

const day = {
  fog: new THREE.Color(palette.skyHorizon),
  sun: new THREE.Color("#fff3dc"),
  sky: new THREE.Color("#b9d3f5"),
  ground: new THREE.Color("#8e9a66"),
  tint: new THREE.Color(1, 1, 1),
}
const dark = {
  fog: new THREE.Color("#1f2a52"),
  sun: new THREE.Color("#a9bcff"),
  sky: new THREE.Color("#3a4c82"),
  ground: new THREE.Color("#1c2236"),
  tint: new THREE.Color(0.36, 0.44, 0.7),
}
const windowLight = new THREE.Color("#ffc46b")
const black = new THREE.Color(0, 0, 0)

// Sun and sky light, and the slow turn from day to night when the night
// door is opened.
export function Daylight() {
  const sun = useRef<THREE.DirectionalLight>(null)
  const sky = useRef<THREE.HemisphereLight>(null)
  const scene = useThree((state) => state.scene)
  const focus = useWorldStore((state) => state.focus)

  useFrame((_, delta) => {
    const target = focus === "night" ? 1 : 0
    const n = (night.value = THREE.MathUtils.damp(
      night.value,
      target,
      1.6,
      delta
    ))
    tint.value.lerpColors(day.tint, dark.tint, n)
    if (scene.fog) scene.fog.color.lerpColors(day.fog, dark.fog, n)
    if (sun.current) {
      sun.current.color.lerpColors(day.sun, dark.sun, n)
      sun.current.intensity = THREE.MathUtils.lerp(2.7, 0.7, n)
    }
    if (sky.current) {
      sky.current.color.lerpColors(day.sky, dark.sky, n)
      sky.current.groundColor.lerpColors(day.ground, dark.ground, n)
      sky.current.intensity = THREE.MathUtils.lerp(0.8, 0.9, n)
    }
    // Lamps come on in the cottage windows.
    paint.glass.emissive.lerpColors(black, windowLight, n)
  })

  return (
    <>
      <hemisphereLight ref={sky} args={[day.sky, day.ground, 0.8]} />
      <directionalLight
        ref={sun}
        position={SUN_DIRECTION.clone().multiplyScalar(60)}
        intensity={2.7}
        color={day.sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={36}
        shadow-camera-bottom={-36}
        shadow-camera-near={10}
        shadow-camera-far={140}
        shadow-bias={-0.0006}
        shadow-normalBias={0.04}
      />
    </>
  )
}
