import { Cloud, Clouds } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

import { night, SUN_DIRECTION, tint } from "./daylight"
import { noise2 } from "./terrain-shape"
import { palette } from "./toon"

const skyVertex = /* glsl */ `
varying vec3 vDirection;
void main() {
  vDirection = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const skyFragment = /* glsl */ `
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uSun;
uniform float uNight;
uniform float uTime;
varying vec3 vDirection;

float starHash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
  vec3 direction = normalize(vDirection);
  float up = clamp(direction.y, 0.0, 1.0);
  vec3 day = mix(uHorizon, uZenith, pow(up, 0.55));
  // A warm haze around the sun, soft like a watercolour wash.
  float sun = max(dot(direction, uSun), 0.0);
  day = mix(day, vec3(1.0, 0.97, 0.86), pow(sun, 18.0) * 0.55);

  // Night: deep blue overhead, a few twinkling stars and a pale moon.
  vec3 dark = mix(vec3(0.13, 0.17, 0.34), vec3(0.02, 0.035, 0.11), pow(up, 0.5));
  float seed = starHash(floor(direction * 320.0));
  float star = step(0.9972, seed) * smoothstep(0.03, 0.3, direction.y);
  dark += vec3(1.0, 0.95, 0.82) * star * (0.55 + 0.45 * sin(uTime * 2.0 + seed * 80.0));
  vec3 moon = normalize(vec3(0.88, 0.3, 0.39));
  float toMoon = dot(direction, moon);
  dark += vec3(0.22, 0.27, 0.42) * pow(max(toMoon, 0.0), 40.0);
  dark = mix(dark, vec3(1.0, 0.96, 0.82), smoothstep(0.99935, 0.9996, toMoon));

  gl_FragColor = vec4(mix(day, dark, uNight), 1.0);
}
`

function SkyDome() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uZenith: { value: new THREE.Color(palette.skyZenith) },
          uHorizon: { value: new THREE.Color(palette.skyHorizon) },
          uSun: { value: SUN_DIRECTION },
          uNight: night,
          uTime: { value: 0 },
        },
      }),
    []
  )
  const ref =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })
  return (
    <mesh ref={ref} material={material} renderOrder={-1}>
      <sphereGeometry args={[420, 32, 16]} />
    </mesh>
  )
}

type RingOptions = {
  radius: number
  // Lowest and highest summit in world units.
  low: number
  high: number
  // Colours at the foot and at the top of the slopes.
  foot: string
  top: string
  snowLine?: number
  seed: number
}

// A ring of hills far across the lake, painted rather than lit: a wash from
// a hazy foot to a deeper top, one flat shadow tone on slopes facing away
// from the light, and snow above the snow line.
function MountainRing({
  radius,
  low,
  high,
  foot,
  top,
  snowLine,
  seed,
}: RingOptions) {
  const geometry = useMemo(() => {
    const ring = new THREE.CylinderGeometry(1, 1, 1, 420, 20, true)
    const position = ring.attributes.position
    const colours = new Float32Array(position.count * 3)
    const footColour = new THREE.Color(foot)
    const topColour = new THREE.Color(top)
    const shadow = new THREE.Color("#5d6f96")
    const snow = new THREE.Color(palette.snow)
    const snowShadow = new THREE.Color("#c3d0e6")
    const ridge = (angle: number) =>
      Math.abs(noise2(angle * 2.1 + seed, seed)) * 0.55 +
      Math.abs(noise2(angle * 6.5 + seed, 3)) * 0.3 +
      Math.abs(noise2(angle * 17 + seed, 9)) * 0.15
    for (let i = 0; i < position.count; i++) {
      const angle = Math.atan2(position.getZ(i), position.getX(i))
      const t = position.getY(i) + 0.5
      const summit = low + ridge(angle) * (high - low)
      const y = -1 + Math.pow(t, 1.25) * summit
      position.setXYZ(i, Math.cos(angle) * radius, y, Math.sin(angle) * radius)
      const lit = ridge(angle + 0.004) > ridge(angle - 0.004)
      const colour = footColour.clone().lerp(topColour, t)
      if (!lit) colour.lerp(shadow, 0.28 * t)
      if (snowLine !== undefined && y > snowLine + noise2(angle * 30, 1) * 3) {
        colour.copy(lit ? snow : snowShadow)
      }
      colour.toArray(colours, i * 3)
    }
    ring.setAttribute("color", new THREE.BufferAttribute(colours, 3))
    return ring
  }, [radius, low, high, foot, top, snowLine, seed])
  // Painted, so unlit: the night tint dims it instead of the lights.
  const ref =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>(null)
  useFrame(() => {
    ref.current?.material.color.copy(tint.value)
  })
  return (
    <mesh ref={ref} geometry={geometry}>
      <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  )
}

function Mountains() {
  return (
    <>
      <MountainRing
        radius={320}
        low={22}
        high={78}
        foot="#b7c8dc"
        top="#8197c0"
        snowLine={46}
        seed={31}
      />
      <MountainRing
        radius={205}
        low={4}
        high={20}
        foot="#a9c3b0"
        top="#6f9a79"
        seed={57}
      />
    </>
  )
}

const banks = [
  { position: [-120, 62, -210], bounds: [40, 9, 10], seed: 1 },
  { position: [90, 70, -230], bounds: [46, 10, 10], seed: 2 },
  { position: [230, 56, 40], bounds: [36, 8, 10], seed: 3 },
  { position: [-230, 52, 70], bounds: [40, 8, 10], seed: 4 },
  { position: [20, 74, 240], bounds: [46, 10, 10], seed: 5 },
  { position: [160, 88, 170], bounds: [30, 7, 8], seed: 6 },
] as const

function SkyClouds() {
  return (
    <Clouds
      texture="/textures/cloud.png"
      material={THREE.MeshLambertMaterial}
      limit={320}
    >
      {banks.map((bank) => (
        <Cloud
          key={bank.seed}
          seed={bank.seed}
          segments={40}
          bounds={bank.bounds}
          volume={30}
          speed={0.04}
          fade={600}
          opacity={1}
          color="#ffffff"
          position={bank.position}
        />
      ))}
    </Clouds>
  )
}

export function Sky() {
  return (
    <>
      <SkyDome />
      <Mountains />
      <SkyClouds />
    </>
  )
}
