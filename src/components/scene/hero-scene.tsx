import { Cloud, Clouds, Sparkles, useTexture } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import type { MotionValue } from "motion/react"
import { useRef } from "react"
import * as THREE from "three"

import { art } from "@/content/art"

type SceneProps = {
  // Scroll progress through the hero, 0 at the top and 1 once it has left.
  progress: MotionValue<number>
  // Element whose pointer movement steers the camera.
  eventSource: React.RefObject<HTMLElement | null>
  active: boolean
}

const CASTLE_ASPECT = art.castle.width / art.castle.height

function useCompact() {
  return useThree((state) => state.size.width < 768)
}

function Castle({ progress }: Pick<SceneProps, "progress">) {
  const compact = useCompact()
  const group = useRef<THREE.Group>(null)
  const texture = useTexture(art.castle.src, (loaded) => {
    loaded.colorSpace = THREE.SRGBColorSpace
    loaded.anisotropy = 4
  })
  const viewport = useThree((state) => state.viewport)
  // On narrow screens the castle stands in the empty strip below the text.
  const height = compact ? Math.min(2.6, viewport.height * 0.3) : 4.6
  const base = compact
    ? new THREE.Vector3(0.3, -viewport.height / 2 + height / 2 + 0.2, 0)
    : new THREE.Vector3(2.7, -0.35, 0)

  useFrame((state, delta) => {
    const castle = group.current
    if (!castle) return
    const t = state.clock.elapsedTime
    const p = progress.get()
    // A heavy, plodding gait: each step lifts the castle and rolls it a little.
    const step = Math.abs(Math.sin(t * 2.1))
    castle.position.x = base.x - p * 3.2 + Math.sin(t * 0.25) * 0.15
    castle.position.y = base.y + step * 0.07 + p * 1.2
    castle.rotation.z = Math.sin(t * 2.1) * 0.012
    castle.rotation.y = THREE.MathUtils.damp(
      castle.rotation.y,
      state.pointer.x * 0.1,
      3,
      delta
    )
  })

  return (
    <group ref={group} position={base}>
      <mesh>
        <planeGeometry args={[height * CASTLE_ASPECT, height]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.02}
          toneMapped={false}
        />
      </mesh>
      {/* Fresh smoke billowing out of the tall chimneys. */}
      <Clouds texture="/textures/cloud.png" limit={40}>
        <Cloud
          seed={11}
          segments={10}
          bounds={[0.5, 0.9, 0.2]}
          volume={0.9}
          growth={2}
          speed={0.6}
          opacity={0.75}
          color="#fbfaf6"
          position={[height * 0.24, height * 0.52, -0.05]}
        />
      </Clouds>
      <Sparkles
        count={46}
        scale={[height * 1.3, height * 1.1, 2]}
        size={2.6}
        speed={0.35}
        opacity={0.9}
        color="#ffe39a"
      />
    </group>
  )
}

function SkyClouds() {
  const compact = useCompact()
  return (
    <Clouds
      texture="/textures/cloud.png"
      material={THREE.MeshLambertMaterial}
      limit={220}
    >
      {/* Far banks drifting in the sky behind the castle. */}
      <Cloud
        seed={1}
        segments={22}
        bounds={[7, 1.6, 2]}
        volume={6}
        speed={0.08}
        fade={40}
        opacity={0.95}
        color="#ffffff"
        position={[-13, 7.5, -17]}
      />
      <Cloud
        seed={2}
        segments={22}
        bounds={[7, 1.6, 2]}
        volume={6}
        speed={0.06}
        fade={40}
        opacity={0.95}
        color="#ffffff"
        position={[13, 6.5, -18]}
      />
      {/* Low mist around the castle's feet. */}
      <Cloud
        seed={3}
        segments={24}
        bounds={[compact ? 5 : 8, 0.5, 1.2]}
        volume={compact ? 3 : 4}
        speed={0.1}
        opacity={0.7}
        color="#ffffff"
        position={[compact ? 0.2 : 3.4, compact ? -3.9 : -3.6, -0.8]}
      />
      {/* Foreground wisps at the edges; the camera flies through them on scroll. */}
      <Cloud
        seed={4}
        segments={14}
        bounds={[2.5, 1, 1]}
        volume={3}
        speed={0.12}
        opacity={0.55}
        color="#ffffff"
        position={[-8.5, -3.4, 3.5]}
      />
      <Cloud
        seed={5}
        segments={12}
        bounds={[2.5, 0.8, 1]}
        volume={2.6}
        speed={0.12}
        opacity={0.45}
        color="#ffffff"
        position={[8.8, 3.8, 2.5]}
      />
    </Clouds>
  )
}

function CameraRig({ progress }: Pick<SceneProps, "progress">) {
  useFrame((state, delta) => {
    const p = progress.get()
    const camera = state.camera
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      state.pointer.x * 0.8,
      2.5,
      delta
    )
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.3 + state.pointer.y * 0.4 + p * 1.6,
      2.5,
      delta
    )
    // Dolly forward through the foreground clouds as the visitor scrolls on.
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      11 - p * 4.5,
      4,
      delta
    )
    camera.lookAt(0, 0.4 + p * 1.2, 0)
  })
  return null
}

export default function HeroScene({
  progress,
  eventSource,
  active,
}: SceneProps) {
  return (
    <Canvas
      className="absolute! inset-0"
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix="client"
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.3, 11], fov: 35 }}
    >
      <hemisphereLight args={["#ffffff", "#e3ecd6", 2.6]} />
      <directionalLight position={[6, 9, 6]} intensity={2.4} color="#fff6e6" />
      <SkyClouds />
      <Castle progress={progress} />
      <CameraRig progress={progress} />
    </Canvas>
  )
}
