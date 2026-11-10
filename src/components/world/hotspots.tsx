import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

import { doors, type DoorId } from "@/content/site"
import { useWorldStore } from "@/stores/world-store"

import { CASTLE_MARKER_HEIGHT, castleAt, doorPlaces } from "./places"

// The door colours as glowing lantern light; values above 1 feed the bloom.
const lanternColours: Record<DoorId, string> = {
  harbor: "#5aa2ff",
  hearth: "#ff7a45",
  meadow: "#7fd36a",
  night: "#ffe9a8",
}

// A small floating lantern in the door's colour with its name beneath, so
// every place on the island can be found and opened.
function Marker({ door }: { door: (typeof doors)[number] }) {
  const lantern = useRef<THREE.Mesh>(null)
  const focus = useWorldStore((state) => state.focus)
  const setFocus = useWorldStore((state) => state.setFocus)
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(lanternColours[door.id]).multiplyScalar(2.4),
        toneMapped: false,
      }),
    [door.id]
  )
  useFrame((state) => {
    if (!lantern.current) return
    const t = state.clock.elapsedTime + door.angle
    lantern.current.position.y = Math.sin(t * 1.4) * 0.25
    lantern.current.scale.setScalar(1 + Math.sin(t * 3) * 0.06)
  })
  const open = focus === door.id
  return (
    <>
      <mesh ref={lantern} material={material} visible={!open}>
        <icosahedronGeometry args={[0.32, 2]} />
      </mesh>
      <Html center position={[0, -1.1, 0]} zIndexRange={[30, 0]}>
        <button
          type="button"
          onClick={() => setFocus(door.id)}
          aria-label={`${door.name}之门，前往${door.label}`}
          data-open={open}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-paper/90 px-3 py-1.5 text-sm whitespace-nowrap text-ink shadow-[0_6px_18px_-6px_rgb(20_30_60/0.5)] ring-1 ring-paper-edge backdrop-blur transition hover:-translate-y-0.5 hover:bg-paper data-[open=true]:pointer-events-none data-[open=true]:opacity-0"
        >
          <span
            className="size-2.5 rounded-full ring-2 ring-white/70"
            style={{ backgroundColor: door.color }}
          />
          {door.name}之门 · {door.label}
        </button>
      </Html>
    </>
  )
}

function CastleMarker({ door }: { door: (typeof doors)[number] }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    castleAt(state.clock.elapsedTime, group.current.position)
    group.current.position.y += CASTLE_MARKER_HEIGHT
  })
  return (
    <group ref={group}>
      <Marker door={door} />
    </group>
  )
}

export function Hotspots() {
  return (
    <>
      {doors.map((door) =>
        door.id === "hearth" ? (
          <CastleMarker key={door.id} door={door} />
        ) : (
          <group key={door.id} position={doorPlaces[door.id].marker}>
            <Marker door={door} />
          </group>
        )
      )}
    </>
  )
}
