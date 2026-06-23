import { useEffect, useRef, useState } from 'react'
import Starfield from './Starfield'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const FRAME_COUNT = 121
const framePath = (i) =>
  `/sequence/frame_${String(i).padStart(3, '0')}.jpg`

// Decide once how to render: scrubbed canvas sequence on desktop,
// a light autoplay loop on touch devices, a still frame if motion is reduced.
function pickMode() {
  if (typeof window === 'undefined') return 'sequence'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'still'
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return 'video'
  return 'sequence'
}

export default function Hero() {
  const root = useRef(null)
  const canvasRef = useRef(null)
  const [mode] = useState(pickMode)

  // ---- Canvas image-sequence scrub (desktop) ----
  useEffect(() => {
    if (mode !== 'sequence') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const images = new Array(FRAME_COUNT)
    const state = { frame: 0 }
    let drawnFrame = -1

    const drawCover = (img) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr
        canvas.height = ch * dpr
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const ir = img.width / img.height
      const cr = cw / ch
      let dw, dh, dx, dy
      if (ir > cr) {
        dh = ch
        dw = ch * ir
        dx = (cw - dw) * 0.5
        dy = 0
      } else {
        dw = cw
        dh = cw / ir
        dx = 0
        dy = (ch - dh) * 0.5
      }
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    const render = () => {
      const img = images[state.frame]
      if (img && img.complete && img.naturalWidth) {
        drawCover(img)
        drawnFrame = state.frame
      } else if (drawnFrame >= 0 && images[drawnFrame]?.complete) {
        // hold the last good frame if the target isn't loaded yet
        drawCover(images[drawnFrame])
      }
    }

    // Preload the whole sequence; paint frame 0 the moment it lands.
    // Track per-frame load count so the preloader bar fills in real time.
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      if (i === 0) img.onload = render
      img.src = framePath(i + 1)
      images[i] = img
    }
    if (images[0].complete) render()

    const onResize = () => render()
    window.addEventListener('resize', onResize)

    const ctxGsap = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: '+=260%',
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress
          const f = Math.min(
            FRAME_COUNT - 1,
            Math.round(p * (FRAME_COUNT - 1))
          )
          if (f !== state.frame) {
            state.frame = f
            render()
          }
          // Opening copy fades out over the first fifth of the scroll.
          const copyP = gsap.utils.clamp(0, 1, p / 0.2)
          gsap.set('.hero-copy', { opacity: 1 - copyP, y: -copyP * 44 })
          gsap.set('.hero-scroll', {
            opacity: 1 - gsap.utils.clamp(0, 1, p / 0.06),
          })
          // Mid-scroll stat: fades in after copy exits, out before the bloom.
          const statIn  = gsap.utils.clamp(0, 1, (p - 0.24) / 0.1)
          const statOut = gsap.utils.clamp(0, 1, (p - 0.66) / 0.09)
          gsap.set('.hero-stat', {
            opacity: statIn * (1 - statOut),
            y: (1 - statIn) * 30 - statOut * 18,
          })
          // Ball rushes the lens: red bloom in, then cut to night sky.
          const flashP = gsap.utils.clamp(0, 1, (p - 0.78) / 0.12)
          const blackP = gsap.utils.clamp(0, 1, (p - 0.9) / 0.1)
          gsap.set('.hero-flash', { opacity: flashP })
          gsap.set('.hero-blackout', { opacity: blackP })
          // Orbital arc fades in with the night sky (wrapper owns opacity; the
          // arc itself runs the CSS breathing animation underneath).
          gsap.set('.orbital-fade', { opacity: blackP })
          // Chapter label fades in just after the night sky settles.
          const labelP = gsap.utils.clamp(0, 1, (p - 0.94) / 0.06)
          gsap.set('.hero-about-label', { opacity: labelP, y: (1 - labelP) * 14 })
        },
      })
      // Fade the arc out as the About section scrolls up past it
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top bottom',
        end: 'top 40%',
        scrub: 0.4,
        onUpdate(self) {
          gsap.set('.orbital-fade', { opacity: 1 - self.progress })
        },
      })
      // Repaint once everything has measured.
      ScrollTrigger.addEventListener('refresh', render)
      requestAnimationFrame(() => {
        st.refresh()
        render()
      })
    }, root)

    return () => {
      window.removeEventListener('resize', onResize)
      ScrollTrigger.removeEventListener('refresh', render)
      ctxGsap.revert()
    }
  }, [mode])

  // ---- Intro animation for the overlay copy (all modes) ----
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-kicker', { y: 24, opacity: 0, duration: 0.9, delay: 0.2 })
        .from(
          '.hero-name span',
          { yPercent: 120, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out' },
          '-=0.6'
        )
        .from('.hero-tag', { y: 24, opacity: 0, duration: 0.9 }, '-=0.6')
        .from('.hero-scroll', { opacity: 0, duration: 0.8 }, '-=0.3')
    },
    { scope: root }
  )

  return (
    <section
      id="top"
      ref={root}
      className="relative h-[100svh] w-full overflow-hidden vignette"
    >
      {/* Visual layer */}
      <div className="absolute inset-0">
        {mode === 'sequence' && (
          <canvas ref={canvasRef} className="h-full w-full block" />
        )}

        {mode === 'video' && (
          <video
            className="h-full w-full object-cover object-center"
            poster="/photos/shot-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/photos/shot-mobile.webm" type="video/webm" />
            <source src="/photos/shot-mobile.mp4" type="video/mp4" />
          </video>
        )}

        {mode === 'still' && (
          <img
            src="/photos/shot-poster.jpg"
            alt="Dharma Vyas batting in his Washington Fighters whites"
            className="h-full w-full object-cover object-center"
          />
        )}

        {/* Legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/90" />
      </div>

      {/* Mid-scroll stat — 107 not out */}
      <div className="hero-stat pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center opacity-0">
        <p className="font-display text-[28vw] sm:text-[22vw] lg:text-[18vw] leading-none font-medium text-bone/90">
          107
        </p>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-bone/45 mt-1">
          Not out
        </p>
      </div>

      {/* Red impact flood, then a cut to ink — driven by scroll on desktop */}
      <div className="hero-flash pointer-events-none absolute inset-0 opacity-0 hero-flash-bg" />
      <div className="hero-blackout hero-night-sky pointer-events-none absolute inset-0 opacity-0" style={{ zIndex: 30 }}>
        <Starfield density={1} className="absolute inset-0 h-full w-full" />
        {/* Chapter label — appears as the night sky settles */}
        <div className="hero-about-label absolute inset-0 flex items-center justify-center opacity-0">
          <p className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-bone/85 tracking-tight">
            Patience.{' '}
            <span className="italic text-gold">Intention.</span>{' '}
            Craft.
          </p>
        </div>
      </div>

      {/* Opening copy */}
      <div className="hero-copy relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="hero-kicker text-xs sm:text-sm uppercase tracking-luxe text-gold/90 mb-6">
          Information Systems · UMBC
        </p>
        <h1 className="hero-name font-display text-[18vw] sm:text-[14vw] lg:text-[10rem] leading-[0.9] font-medium">
          <span className="inline-block">Dharma</span>{' '}
          <span className="inline-block">Vyas</span>
        </h1>
        <p className="hero-tag max-w-xl mt-7 text-base sm:text-lg text-bone/75 font-light text-balance">
          I build things the same way I bat — with patience, intention,
          and an eye for the details that matter.
        </p>
      </div>

      {/* Scroll hint */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault()
          document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-bone/60 hover:text-bone transition-colors"
      >
        <span className="text-[10px] uppercase tracking-luxe">
          {mode === 'sequence' ? 'Scroll to play' : 'Scroll'}
        </span>
        <span className="w-px h-10 bg-gradient-to-b from-bone/50 to-transparent animate-pulse" />
      </a>
    </section>
  )
}
