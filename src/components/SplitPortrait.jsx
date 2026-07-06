import { useCallback, useEffect, useRef, useState } from 'react'

// Drag-to-reveal portrait compare. Two shots of the same pose, same crop —
// quiet studio vs. NYC at night — split by a vertical line the visitor drags.
export default function SplitPortrait({
  frontSrc,
  frontAlt,
  backSrc,
  backAlt,
  className = '',
  frameClassName = 'rounded-2xl aspect-[3/4] max-w-md',
  radiusClassName = 'rounded-2xl',
}) {
  const frameRef = useRef(null)
  const [pos, setPos] = useState(50) // % of width showing the front (studio) image
  const [dragging, setDragging] = useState(false)
  const [touched, setTouched] = useState(false)

  const setFromClientX = useCallback((clientX) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX
      setFromClientX(x)
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, setFromClientX])

  const startDrag = (e) => {
    setDragging(true)
    setTouched(true)
    const x = e.touches ? e.touches[0].clientX : e.clientX
    setFromClientX(x)
  }

  return (
    <div
      ref={frameRef}
      className={`split-portrait relative select-none overflow-hidden mx-auto w-full cursor-grow ${frameClassName} ${className}`}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
    >
      {/* back layer — full image, revealed as the divider moves left */}
      <img
        src={backSrc}
        alt={backAlt}
        draggable="false"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />
      {/* front layer — clipped to the divider position */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={frontSrc}
          alt={frontAlt}
          draggable="false"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* divider line + handle */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gold/70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-pill flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gold/90">
            <path d="M4 3L1 7L4 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 3L13 7L10 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className={`absolute inset-0 ring-1 ring-inset ring-white/[0.06] pointer-events-none ${radiusClassName}`} />

      {!touched && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-luxe text-bone/70 pointer-events-none transition-opacity duration-700">
          Drag to reveal
        </p>
      )}
    </div>
  )
}
