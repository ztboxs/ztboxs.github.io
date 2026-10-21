import type { SectionId } from "@/content/site"
import { useSiteStore } from "@/stores/site-store"

// Props for an <a href="#section"> that walks through the magic door instead
// of jumping. The plain href keeps it working as a normal link.
export function useDoorLink() {
  const openDoor = useSiteStore((state) => state.openDoor)

  return (target: SectionId) => ({
    href: `#${target}`,
    onClick: (event: React.MouseEvent<Element>) => {
      event.preventDefault()
      const rect = event.currentTarget.getBoundingClientRect()
      openDoor(target, {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    },
  })
}
