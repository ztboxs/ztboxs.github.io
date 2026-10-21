// Shared SVG filters and gradients. Rendered once; other SVGs reference the ids.
export function PaintDefs() {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0">
      <defs>
        {/* Slightly wobbly, hand-inked edges. */}
        <filter id="paint-wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="2"
            seed="7"
          />
          <feDisplacementMap in="SourceGraphic" scale="3.2" />
        </filter>
        {/* Soft, billowing cloud edges. */}
        <filter id="paint-cloud" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="3"
            seed="3"
          />
          <feDisplacementMap in="SourceGraphic" scale="14" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="paint-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
    </svg>
  )
}
