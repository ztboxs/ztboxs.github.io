import { Outlines } from "@react-three/drei"
import * as THREE from "three"

import { paintedToon } from "./toon"

// Paints for everything built on the island: rusted iron, brass, plaster,
// red tiles, timber and stone.
export const paint = {
  iron: paintedToon({ color: "#7a665b", brush: 0.16, brushScale: 1.4 }),
  ironDark: paintedToon({ color: "#574843", brush: 0.14, brushScale: 1.6 }),
  rust: paintedToon({ color: "#9a5f41", brush: 0.18, brushScale: 1.5 }),
  brass: paintedToon({ color: "#b8904f", brush: 0.12, brushScale: 1.8 }),
  plaster: paintedToon({ color: "#eadcc2", brush: 0.08, brushScale: 1.2 }),
  tile: paintedToon({ color: "#c0573b", brush: 0.12, brushScale: 1.8 }),
  slate: paintedToon({ color: "#61707f", brush: 0.1, brushScale: 1.8 }),
  glass: paintedToon({ color: "#2f3a45", brush: 0.04 }),
  wood: paintedToon({ color: "#9b7451", brush: 0.14, brushScale: 2.2 }),
  woodDark: paintedToon({ color: "#6b4f3a", brush: 0.12, brushScale: 2.2 }),
  stone: paintedToon({ color: "#b3ab9c", brush: 0.14, brushScale: 1.2 }),
  sail: paintedToon({ color: "#f3ead6", brush: 0.06, side: THREE.DoubleSide }),
  hullBlue: paintedToon({ color: "#3f6f95", brush: 0.08 }),
  glow: new THREE.MeshBasicMaterial({ color: "#ffd38a" }),
}

export const INK = "#2b211d"

type PartProps = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  material: THREE.Material
  geometry?: THREE.BufferGeometry
  children?: React.ReactNode
  outline?: number
}

// One painted piece with an ink outline.
export function Part({
  material,
  children,
  outline = 2.2,
  ...props
}: PartProps) {
  return (
    <mesh {...props} material={material} castShadow receiveShadow>
      {children}
      {outline > 0 && <Outlines thickness={outline} color={INK} />}
    </mesh>
  )
}

// A gable roof: a triangular prism one unit wide, half a unit tall and one
// unit deep, with the ridge running front to back.
const gable = (() => {
  const shape = new THREE.Shape()
  shape.moveTo(-0.5, 0)
  shape.lineTo(0.5, 0)
  shape.lineTo(0, 0.5)
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1,
    bevelEnabled: false,
  })
  geometry.translate(0, 0, -0.5)
  return geometry
})()

// A little half-timbered house: plaster walls, a steep gable roof with
// overhanging eaves, and windows that light up after dark.
export function Cottage({
  position,
  size,
  rotation = 0,
  roof = paint.tile,
}: {
  position: [number, number, number]
  size: [number, number, number]
  rotation?: number
  roof?: THREE.Material
}) {
  const [w, h, d] = size
  const windows: [number, number, number][] = [
    [-w * 0.22, 0.05, d / 2 + 0.01],
    [w * 0.22, 0.05, d / 2 + 0.01],
    [0, 0.05, -d / 2 - 0.01],
  ]
  return (
    <group position={position} rotation-y={rotation}>
      <Part material={paint.plaster}>
        <boxGeometry args={size} />
      </Part>
      {/* Dark timber framing along the eaves line. */}
      <Part
        material={paint.woodDark}
        position={[0, h / 2 - 0.04, 0]}
        outline={0}
      >
        <boxGeometry args={[w + 0.02, 0.08, d + 0.02]} />
      </Part>
      <Part
        material={roof}
        geometry={gable}
        position={[0, h / 2, 0]}
        scale={[w * 1.25, h * 1.5, d * 1.18]}
      />
      {windows.map((at) => (
        <Part
          key={at.join()}
          material={paint.glass}
          position={at}
          outline={1.2}
        >
          <boxGeometry args={[w * 0.18, h * 0.3, 0.03]} />
        </Part>
      ))}
    </group>
  )
}

export function Chimney({
  position,
  height,
  radius,
}: {
  position: [number, number, number]
  height: number
  radius: number
}) {
  return (
    <group position={position}>
      <Part material={paint.ironDark} position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius * 1.15, height, 10]} />
      </Part>
      <Part material={paint.rust} position={[0, height, 0]}>
        <cylinderGeometry args={[radius * 1.35, radius * 1.2, 0.18, 10]} />
      </Part>
    </group>
  )
}
