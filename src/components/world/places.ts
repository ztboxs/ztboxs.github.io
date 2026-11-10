import * as THREE from "three"

import type { DoorId } from "@/content/site"

import { CASTLE_LOOP_RADIUS, places, terrainHeight } from "./terrain-shape"

const ground = (point: THREE.Vector3, lift = 0) =>
  new THREE.Vector3(point.x, terrainHeight(point.x, point.z) + lift, point.z)

// Where each door leads on the island: the spot its marker floats over and
// the shot the camera flies to. The hearth door follows the walking castle,
// so its marker and shot are worked out every frame instead.
export const doorPlaces: Record<
  Exclude<DoorId, "hearth">,
  { marker: THREE.Vector3; camera: THREE.Vector3; target: THREE.Vector3 }
> = {
  harbor: {
    marker: ground(places.harbor, 4.2),
    camera: new THREE.Vector3(37, 11, -25),
    target: new THREE.Vector3(places.harbor.x + 3, 1, places.harbor.z - 1),
  },
  meadow: {
    marker: ground(places.meadow, 3.6),
    camera: new THREE.Vector3(-27, 8, 25),
    target: ground(places.meadow, 1),
  },
  night: {
    marker: ground(places.lookout, 4.4),
    camera: new THREE.Vector3(-27, 10, -32),
    target: ground(places.lookout, 4.5),
  },
}

// The castle's shot, relative to where it stands: ahead of it and to the
// outside of its walk, so it comes plodding toward the camera face first.
export const CASTLE_MARKER_HEIGHT = 16.5
export const castleShot = (castle: THREE.Vector3, yaw: number) => {
  const ahead = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw))
  const outward = castle.clone().setY(0).normalize()
  return {
    camera: castle
      .clone()
      .addScaledVector(ahead, 31)
      .addScaledVector(outward, 22)
      .add(new THREE.Vector3(0, 14, 0)),
    target: castle.clone().add(new THREE.Vector3(0, 7, 0)),
  }
}

// Seconds for one full lap of the castle around the middle of the island.
export const CASTLE_LAP = 150

// Where the castle stands at time t, and which way it faces (the yaw that
// turns its local +x, its front, along the direction of travel).
export function castleAt(t: number, into = new THREE.Vector3()) {
  const angle = (t / CASTLE_LAP) * Math.PI * 2
  const x = Math.cos(angle) * CASTLE_LOOP_RADIUS
  const z = Math.sin(angle) * CASTLE_LOOP_RADIUS
  into.set(x, terrainHeight(x, z) - 0.05, z)
  return { position: into, yaw: Math.atan2(-Math.cos(angle), -Math.sin(angle)) }
}
