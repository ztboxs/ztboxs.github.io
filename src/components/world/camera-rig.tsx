import { CameraControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"

import { useWorldStore } from "@/stores/world-store"

import { castleAt, castleShot, doorPlaces } from "./places"

const OVERVIEW = { camera: [44, 14, 44], target: [0, 4, 0] } as const

// Drag to look around, scroll or pinch to move closer. Choosing a door flies
// the camera to its place; with nothing chosen the view drifts slowly round
// the island.
export function CameraRig() {
  const controls = useRef<CameraControls>(null)
  const idle = useRef(0)
  const followFrom = useRef(Infinity)
  const castle = useRef(new THREE.Vector3())
  const lastCastle = useRef(new THREE.Vector3())
  const focus = useWorldStore((state) => state.focus)
  const intro = useWorldStore((state) => state.intro)
  const wide = useThree((state) => state.size.width >= 768)
  const clock = useThree((state) => state.clock)

  useEffect(() => {
    // ?cam=x,y,z,tx,ty,tz sets the opening view, for checking shots.
    const cam = new URLSearchParams(location.search).get("cam")
    const [x, y, z, tx, ty, tz] = cam
      ? cam.split(",").map(Number)
      : [...OVERVIEW.camera, ...OVERVIEW.target]
    controls.current?.setLookAt(x, y, z, tx, ty, tz, false)
  }, [])

  useEffect(() => {
    const rig = controls.current
    if (!rig) return
    followFrom.current = Infinity
    if (focus === null) {
      // Slide the island out from under the intro card on wide screens.
      rig.setFocalOffset(intro && wide ? -7 : 0, 0, 0, true)
      rig.setLookAt(...OVERVIEW.camera, ...OVERVIEW.target, true)
      return
    }
    const now = castleAt(clock.elapsedTime)
    const shot =
      focus === "hearth" ? castleShot(now.position, now.yaw) : doorPlaces[focus]
    const target = shot.target
    // Phones see a narrow slice above the page, so stand further back.
    const camera = wide ? shot.camera : target.clone().lerp(shot.camera, 1.9)
    // Keep the place clear of the page: it opens on the right on wide
    // screens and from the bottom on phones. Farther shots need a bigger
    // shift for the place to clear it.
    const distance = camera.distanceTo(target)
    rig.setFocalOffset(
      wide ? distance * 0.27 : 0,
      wide ? 0 : distance * 0.21,
      0,
      true
    )
    rig.setLookAt(...camera.toArray(), ...target.toArray(), true)
    if (focus === "hearth") {
      followFrom.current = clock.elapsedTime + 1.4
      lastCastle.current.copy(now.position)
    }
  }, [focus, intro, wide, clock])

  useFrame((state, delta) => {
    const rig = controls.current
    if (!rig) return
    const t = state.clock.elapsedTime
    // Walk alongside the castle once the camera has caught up with it.
    if (focus === "hearth" && t > followFrom.current) {
      castleAt(t, castle.current)
      const step = castle.current.clone().sub(lastCastle.current)
      const target = rig.getTarget(new THREE.Vector3()).add(step)
      const position = rig.getPosition(new THREE.Vector3()).add(step)
      rig.setLookAt(...position.toArray(), ...target.toArray(), false)
      lastCastle.current.copy(castle.current)
    } else if (focus === "hearth") {
      castleAt(t, lastCastle.current)
    }
    idle.current += delta
    if (focus === null && idle.current > 4) rig.azimuthAngle += delta * 0.04
  })

  return (
    <CameraControls
      ref={controls}
      makeDefault
      minDistance={10}
      maxDistance={72}
      minPolarAngle={0.45}
      maxPolarAngle={1.42}
      truckSpeed={0}
      smoothTime={0.7}
      onStart={() => (idle.current = -1e9)}
      onEnd={() => (idle.current = 0)}
    />
  )
}
