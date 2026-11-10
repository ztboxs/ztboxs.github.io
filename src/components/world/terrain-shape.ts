import * as THREE from "three"
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js"

import { palette } from "./toon"

// Small seeded generator so the island looks the same on every visit.
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const simplex = new SimplexNoise({ random: seeded(7) })

export const ISLAND_RADIUS = 30
export const WATER_LEVEL = 0

// Where each place sits on the island, in world units (y is filled in from
// the terrain). The castle walks a loop around the middle.
export const places = {
  harbor: new THREE.Vector3(17, 0, -9),
  meadow: new THREE.Vector3(-13, 0, 11),
  lookout: new THREE.Vector3(-11, 0, -13),
  castle: new THREE.Vector3(0, 0, 0),
} as const

export const CASTLE_LOOP_RADIUS = 8

const smoothstep = THREE.MathUtils.smoothstep

function bump(x: number, z: number, cx: number, cz: number, radius: number) {
  const d2 = ((x - cx) ** 2 + (z - cz) ** 2) / (radius * radius)
  return Math.exp(-d2)
}

// Height of the ground at (x, z). Rolling hills that sink into the lake at
// the rim, a hill for the lookout, a low shore for the harbour and a flat
// meadow.
export function terrainHeight(x: number, z: number) {
  const r = Math.hypot(x, z) / ISLAND_RADIUS
  // 1 in the interior, falling to 0 at the shoreline and below it.
  const land = 1 - smoothstep(r, 0.62, 1.0)
  const rolling =
    (simplex.noise(x * 0.045, z * 0.045) * 0.5 + 0.5) * 3.2 +
    simplex.noise(x * 0.13, z * 0.13) * 0.55
  let h = 0.6 + rolling * land - (1 - land) * 4.2

  h += bump(x, z, places.lookout.x, places.lookout.z, 7) * 6.5
  // Keep the meadow gentle and the castle's walk fairly level.
  const meadow = bump(x, z, places.meadow.x, places.meadow.z, 8)
  h = THREE.MathUtils.lerp(h, 1.4 + rolling * 0.15, meadow * 0.85)
  const centre = 1 - smoothstep(Math.hypot(x, z), CASTLE_LOOP_RADIUS + 3, 13)
  h = THREE.MathUtils.lerp(h, 1.8 + rolling * 0.2, centre * 0.8)
  // A bay where the harbour's jetty runs into the water.
  h -= bump(x, z, places.harbor.x + 3, places.harbor.z - 1, 6) * 2.6
  return h
}

export function groundAt(position: THREE.Vector3) {
  return position.clone().setY(terrainHeight(position.x, position.z))
}

// Steepness at (x, z), 0 for flat ground.
export function terrainSlope(x: number, z: number) {
  const e = 0.4
  const dx = terrainHeight(x + e, z) - terrainHeight(x - e, z)
  const dz = terrainHeight(x, z + e) - terrainHeight(x, z - e)
  return Math.hypot(dx, dz) / (2 * e)
}

export function noise2(x: number, z: number) {
  return simplex.noise(x, z)
}

// Colour of the ground at (x, z): grass of varying depth, a paler meadow
// and sand along the waterline.
export function groundColour(x: number, z: number, h: number) {
  const grass = new THREE.Color(palette.grass).lerp(
    new THREE.Color(palette.grassDeep),
    THREE.MathUtils.clamp(noise2(x * 0.08, z * 0.08) * 0.5 + 0.45, 0, 1)
  )
  const meadow = Math.exp(
    -((x - places.meadow.x) ** 2 + (z - places.meadow.z) ** 2) / 70
  )
  grass.lerp(new THREE.Color(palette.meadow), meadow * 0.8)
  const colour = grass
  // Sand along the waterline.
  colour.lerp(
    new THREE.Color(palette.sand),
    1 - THREE.MathUtils.smoothstep(h, 0.15, 0.55)
  )
  return colour
}
