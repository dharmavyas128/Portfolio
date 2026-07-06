import Starfield from './Starfield'

// Fixed liquid-light backdrop for everything below the hero. A deep navy base
// (bottom stop matches the hero night-sky exactly, so the pinned-hero → About
// seam stays invisible) with huge blurred colour blobs drifting on
// transform-only animations, an iridescent conic sheen, and one global
// starfield. Sections above render transparent so this glows through.
// Dimmed and gold-leaning so the aurora reads as atmosphere, not a light show.
// Purple is pulled back hard so content in the foreground stays legible.
const blobs = [
  { c: 'rgba(124, 58, 237, 0.16)', w: '55vw', h: '55vw', top: '-12%', left: '-14%', anim: 'aurora-drift-a 46s ease-in-out infinite' },
  { c: 'rgba(34, 211, 238, 0.12)', w: '48vw', h: '48vw', top: '6%', left: '58%', anim: 'aurora-drift-b 58s ease-in-out infinite' },
  { c: 'rgba(201, 163, 94, 0.14)', w: '44vw', h: '44vw', top: '38%', left: '18%', anim: 'aurora-drift-c 52s ease-in-out infinite' },
  { c: 'rgba(201, 163, 94, 0.12)', w: '38vw', h: '38vw', top: '30%', left: '68%', anim: 'aurora-drift-a 64s ease-in-out infinite reverse' },
  { c: 'rgba(37, 99, 235, 0.14)', w: '52vw', h: '52vw', top: '-6%', left: '28%', anim: 'aurora-drift-b 72s ease-in-out infinite reverse' },
]

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none aurora-base" aria-hidden="true">
      {blobs.map((b, i) => (
        <div
          key={i}
          className="aurora-blob"
          style={{
            background: `radial-gradient(circle, ${b.c} 0%, transparent 70%)`,
            width: b.w,
            height: b.h,
            top: b.top,
            left: b.left,
            animation: b.anim,
          }}
        />
      ))}
      {/* slow-turning iridescent sheen — barely-there colour wash */}
      <div className="aurora-sheen" />
      <Starfield density={0.8} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
