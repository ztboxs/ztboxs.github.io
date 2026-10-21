import { create } from "zustand"

import { sections, type SectionId } from "@/content/site"

type SiteState = {
  visibleSections: SectionId[]
  navTarget: SectionId | null
  // The door the visitor is walking through; the portal overlay plays while set.
  doorTarget: SectionId | null
  // Where the door was opened from, in viewport pixels.
  doorOrigin: { x: number; y: number }
  setSectionVisible: (id: SectionId, visible: boolean) => void
  setNavTarget: (id: SectionId | null) => void
  openDoor: (id: SectionId, origin?: { x: number; y: number }) => void
  closeDoor: () => void
}

export const useSiteStore = create<SiteState>()((set) => ({
  visibleSections: [],
  navTarget: null,
  doorTarget: null,
  doorOrigin: { x: 0, y: 0 },
  setSectionVisible: (id, visible) =>
    set(({ visibleSections }) => ({
      visibleSections: visible
        ? [...visibleSections.filter((other) => other !== id), id]
        : visibleSections.filter((other) => other !== id),
    })),
  setNavTarget: (id) => set({ navTarget: id }),
  openDoor: (id, origin) =>
    set({
      doorTarget: id,
      navTarget: id,
      doorOrigin: origin ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
    }),
  closeDoor: () => set({ doorTarget: null }),
}))

// A chosen door wins until the visitor scrolls by hand. Otherwise the active
// section is the last one (in page order) reaching into the upper part of the
// viewport, i.e. the one whose top most recently crossed that line.
export const useActiveSection = () =>
  useSiteStore(
    ({ navTarget, visibleSections }) =>
      navTarget ??
      sections.findLast(({ id }) => visibleSections.includes(id))?.id ??
      "home"
  )
