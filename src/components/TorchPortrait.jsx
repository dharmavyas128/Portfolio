import { useEffect, useRef } from 'react'

// Spotlight / torch reveal. Same pose, same crop — the quiet studio shot sits
// on top, the NYC night shot underneath. The cursor burns a soft circle
// through the top layer to reveal the city below. Wanders on its own until
// the visitor takes over, so touch devices still get the full effect.
export default function TorchPortrait({ frontSrc, frontAlt, backSrc, backAlt, className = '' }) {
  const frameRef = useRef(null)
  const frontRef = useRef(null)
  const backRef = useRef(null)
  const hintRef = useRef(null)

  useEffect(() => {
    const frame = frameRef.current
    const front = frontRef.current
    const back = backRef.current
    const hint = hintRef.current
    if (!frame || !front || !back) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = frame.clientWidth
    let h = frame.clientHeight
    const pos = { x: w / 2, y: h * 0.4 }
    const tgt = { x: w / 2, y: h * 0.4 }
    let pointer = false
    let drift = Math.PI / 2
    let raf

    const onResize = () => {
      w = frame.clientWidth
      h = frame.clientHeight
    }
    window.addEventListener('resize', onResize)

    const paint = () => {
      const r = Math.min(w, h) * 0.4
      const mask =
        `radial-gradient(circle ${r}px at ${pos.x}px ${pos.y}px,` +
        ' transparent 0%, transparent 35%,' +
        ' rgba(0,0,0,0.55) 60%, #000 85%)'
      front.style.webkitMaskImage = mask
      front.style.maskImage = mask

      // Same base scale on both layers — the photos are pixel-matched at the
      // source, so any scale mismatch here breaks that alignment and the
      // torch reveals a "zoomed" seam instead of the same body at the same
      // size. Only translate shifts, identically, to suggest depth.
      const dx = pos.x / w - 0.5
      const dy = pos.y / h - 0.5
      back.style.transform = `scale(1.04) translate(${dx * 10}px, ${dy * 10}px)`
      front.style.transform = `scale(1.04) translate(${dx * 10}px, ${dy * 10}px)`
    }

    const loop = () => {
      if (!pointer) {
        drift += 0.007
        tgt.x = w * (0.5 + 0.28 * Math.sin(drift))
        tgt.y = h * (0.42 + 0.2 * Math.sin(drift * 1.7))
      }
      pos.x += (tgt.x - pos.x) * 0.12
      pos.y += (tgt.y - pos.y) * 0.12
      paint()
      raf = requestAnimationFrame(loop)
    }

    const takePointer = (clientX, clientY) => {
      const rect = frame.getBoundingClientRect()
      tgt.x = clientX - rect.left
      tgt.y = clientY - rect.top
      if (!pointer) {
        pointer = true
        if (hint) hint.style.opacity = '0'
      }
    }

    const onMove = (e) => takePointer(e.clientX, e.clientY)
    const onTouchMove = (e) => {
      const t = e.touches[0]
      if (t) takePointer(t.clientX, t.clientY)
    }
    const onLeave = () => {
      pointer = false
      drift = Math.atan2(pos.y / h - 0.42, pos.x / w - 0.5)
    }

    frame.addEventListener('mousemove', onMove)
    frame.addEventListener('touchmove', onTouchMove, { passive: true })
    frame.addEventListener('mouseleave', onLeave)

    if (reduce) {
      pos.x = w / 2
      pos.y = h * 0.4
      paint()
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      window.removeEventListener('resize', onResize)
      frame.removeEventListener('mousemove', onMove)
      frame.removeEventListener('touchmove', onTouchMove)
      frame.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={frameRef}
      className={`cursor-grow relative rounded-2xl overflow-hidden aspect-[3/4] max-w-md mx-auto w-full ${className}`}
    >
      <img
        ref={backRef}
        src={backSrc}
        alt={backAlt}
        draggable="false"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none will-change-transform"
      />
      <img
        ref={frontRef}
        src={frontSrc}
        alt={frontAlt}
        draggable="false"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none will-change-transform"
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
      <p
        ref={hintRef}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-luxe text-bone/70 pointer-events-none transition-opacity duration-700"
      >
        Move to reveal
      </p>
    </div>
  )
}
