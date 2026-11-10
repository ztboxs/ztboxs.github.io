import { Canvas } from "@react-three/fiber"
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

import { Birds } from "./birds"
import { CameraRig } from "./camera-rig"
import { Castle } from "./castle"
import { Daylight } from "./daylight"
import { Grass, Trees } from "./foliage"
import { Hotspots } from "./hotspots"
import { Props } from "./props"
import { Sky } from "./sky"
import { Terrain } from "./terrain"
import { palette } from "./toon"

export default function WorldScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      className="absolute! inset-0"
      frameloop={active ? "always" : "never"}
      flat
      shadows="soft"
      dpr={[1, 1.75]}
      camera={{ position: [44, 14, 44], fov: 36, near: 0.5, far: 1000 }}
    >
      <fog attach="fog" args={[palette.skyHorizon, 110, 520]} />
      <Daylight />
      <Sky />
      <Terrain />
      <Trees />
      <Grass />
      <Castle />
      <Props />
      <Birds />
      <Hotspots />
      <CameraRig />
      <EffectComposer multisampling={4}>
        <Bloom luminanceThreshold={0.92} intensity={0.35} mipmapBlur />
        <Vignette offset={0.32} darkness={0.42} />
        <Noise
          premultiply
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={0.18}
        />
      </EffectComposer>
    </Canvas>
  )
}
