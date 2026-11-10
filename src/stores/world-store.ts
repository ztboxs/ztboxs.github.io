import { create } from "zustand"

import type { DoorId } from "@/content/site"

type WorldState = {
  // "world" is the explorable island, "read" the plain page with every word.
  mode: "world" | "read"
  // The door whose place the camera has flown to and whose page is open.
  focus: DoorId | null
  // The opening title card, shown until the visitor starts exploring.
  intro: boolean
  setMode: (mode: WorldState["mode"]) => void
  setFocus: (door: DoorId | null) => void
  dismissIntro: () => void
}

export const useWorldStore = create<WorldState>()((set) => ({
  mode: "world",
  focus: null,
  intro: true,
  setMode: (mode) => set({ mode, focus: null }),
  setFocus: (focus) => set(focus ? { focus, intro: false } : { focus }),
  dismissIntro: () => set({ intro: false }),
}))
