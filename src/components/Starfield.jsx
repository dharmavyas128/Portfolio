import { useEffect, useRef } from 'react'

const PI2 = Math.PI * 2

// Weighted star colour temperature: mostly neutral, some cool blue-white,
// a few warm gold to echo the palette.
function pickColor() {
  const r = Math.random()
  if (r < 0.12) return '201, 163, 94' // gold
  if (r < 0.42) return '200, 216, 255' // cool blue-white
  return '244, 241, 234' // neutral bone
}

// Three depth layers. Far = many tiny dim stars that drift slowly; near =
// few large bright stars that lead the parallax and can sparkle.
const LAYERS = [
  { weight: 0.55, pf: 0.07, rMin: 0.3, rMax: 0.95, aMin: 0.22, aMax: 0.5, twAmp: 0.55, twMin: 0.8, twMax: 2.4, glint: false },
  { weight: 0.31, pf: 0.0, rMin: 0.5, rMax: 1.5, aMin: 0.4, aMax: 0.8, twAmp: 0.38, twMin: 0.5, twMax: 1.5, glint: false },
  { weight: 0.14, pf: -0.1, rMin: 1.0, rMax: 2.4, aMin: 0.6, aMax: 1.0, twAmp: 0.22, twMin: 0.3, twMax: 0.9, glint: true },
]

export default function Starfield({ density = 1, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let stars = []
    let nebula = null
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let running = false
    let last = 0
    let meteor = null
    let nextMeteor = 1500 + Math.random() * 6000

    const PAD = 340 // vertical overscan so parallax never reveals an edge

    const buildNebula = () => {
      const nd = 0.5 // low-res; it's soft so upscaling blurs it nicely
      const nc = document.createElement('canvas')
      nc.width = Math.max(1, Math.round(w * nd))
      nc.height = Math.max(1, Math.round(h * nd))
      const nx = nc.getContext('2d')
      nx.scale(nd, nd)
      nx.globalCompositeOperation = 'lighter'
      // A faint diagonal band (top-left → bottom-right); corners stay dark.
      const blobs = [
        { x: w * 0.22, y: h * 0.2, r: w * 0.4, c: '46, 78, 150' },
        { x: w * 0.5, y: h * 0.46, r: w * 0.42, c: '74, 52, 130' },
        { x: w * 0.78, y: h * 0.74, r: w * 0.4, c: '30, 92, 118' },
      ]
      for (const b of blobs) {
        const g = nx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, `rgba(${b.c}, 0.16)`)
        g.addColorStop(0.5, `rgba(${b.c}, 0.04)`)
        g.addColorStop(1, `rgba(${b.c}, 0)`)
        nx.fillStyle = g
        nx.beginPath()
        nx.arc(b.x, b.y, b.r, 0, PI2)
        nx.fill()
      }
      nebula = nc
    }

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      if (!w || !h) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const total = Math.round(((w * h) / 2600) * density)
      stars = []
      for (const L of LAYERS) {
        const n = Math.round(total * L.weight)
        for (let i = 0; i < n; i++) {
          const r = L.rMin + Math.random() * Math.random() * (L.rMax - L.rMin)
          stars.push({
            x: Math.random() * w,
            y: -PAD + Math.random() * (h + PAD * 2),
            r,
            base: L.aMin + Math.random() * (L.aMax - L.aMin),
            tw: L.twMin + Math.random() * (L.twMax - L.twMin),
            ph: Math.random() * PI2,
            amp: L.twAmp,
            pf: L.pf,
            color: pickColor(),
            // only the biggest near-layer stars get a sparkle
            glint: L.glint && r > 1.85,
          })
        }
      }
      buildNebula()
    }

    const sparkle = (x, y, len, a, color) => {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, len)
      glow.addColorStop(0, `rgba(${color}, ${0.45 * a})`)
      glow.addColorStop(1, `rgba(${color}, 0)`)
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(x, y, len, 0, PI2)
      ctx.fill()
      ctx.lineWidth = 0.8
      const gh = ctx.createLinearGradient(x - len, y, x + len, y)
      gh.addColorStop(0, `rgba(${color}, 0)`)
      gh.addColorStop(0.5, `rgba(${color}, ${a})`)
      gh.addColorStop(1, `rgba(${color}, 0)`)
      ctx.strokeStyle = gh
      ctx.beginPath()
      ctx.moveTo(x - len, y)
      ctx.lineTo(x + len, y)
      ctx.stroke()
      const gv = ctx.createLinearGradient(x, y - len, x, y + len)
      gv.addColorStop(0, `rgba(${color}, 0)`)
      gv.addColorStop(0.5, `rgba(${color}, ${a})`)
      gv.addColorStop(1, `rgba(${color}, 0)`)
      ctx.strokeStyle = gv
      ctx.beginPath()
      ctx.moveTo(x, y - len)
      ctx.lineTo(x, y + len)
      ctx.stroke()
    }

    const draw = (t, dt) => {
      // Section-relative scroll: 0 at section top, grows as it scrolls past.
      const pscroll = -canvas.getBoundingClientRect().top

      ctx.clearRect(0, 0, w, h)

      // Nebula haze (slowest layer)
      if (nebula) {
        ctx.globalAlpha = 0.5
        ctx.drawImage(nebula, 0, pscroll * 0.04, w, h)
        ctx.globalAlpha = 1
      }

      for (const s of stars) {
        const a = reduce
          ? s.base
          : s.base *
            (1 - s.amp + s.amp * (0.5 + 0.5 * Math.sin(s.ph + t * 0.001 * s.tw)))
        if (a <= 0.015) continue
        const y = s.y + pscroll * s.pf
        if (y < -PAD || y > h + PAD) continue
        if (s.glint) {
          sparkle(s.x, y, s.r * 5.5, a, s.color)
        }
        ctx.fillStyle = `rgba(${s.color}, ${a})`
        ctx.beginPath()
        ctx.arc(s.x, y, s.r, 0, PI2)
        ctx.fill()
      }

      // Shooting star
      if (!reduce) {
        if (!meteor) {
          nextMeteor -= dt
          if (nextMeteor <= 0) {
            const fromLeft = Math.random() < 0.6
            meteor = {
              x: fromLeft ? w * (0.05 + Math.random() * 0.4) : w * (0.55 + Math.random() * 0.4),
              y: -20 + Math.random() * h * 0.25,
              vx: (fromLeft ? 1 : -1) * (520 + Math.random() * 380),
              vy: 360 + Math.random() * 260,
              life: 0,
              max: 0.9 + Math.random() * 0.5,
            }
          }
        } else {
          meteor.life += dt / 1000
          meteor.x += (meteor.vx * dt) / 1000
          meteor.y += (meteor.vy * dt) / 1000
          const k = meteor.life / meteor.max
          const fade = Math.sin(Math.min(1, k) * Math.PI) // ease in/out
          const len = 150 + 90 * fade
          const ang = Math.atan2(meteor.vy, meteor.vx)
          const tx = meteor.x - Math.cos(ang) * len
          const ty = meteor.y - Math.sin(ang) * len
          const g = ctx.createLinearGradient(meteor.x, meteor.y, tx, ty)
          g.addColorStop(0, `rgba(255, 250, 235, ${0.85 * fade})`)
          g.addColorStop(0.4, `rgba(201, 163, 94, ${0.3 * fade})`)
          g.addColorStop(1, 'rgba(201, 163, 94, 0)')
          ctx.strokeStyle = g
          ctx.lineWidth = 1.4
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(meteor.x, meteor.y)
          ctx.lineTo(tx, ty)
          ctx.stroke()
          ctx.lineCap = 'butt'
          if (k >= 1 || meteor.x < -200 || meteor.x > w + 200 || meteor.y > h + 200) {
            meteor = null
            nextMeteor = 9000 + Math.random() * 12000
          }
        }
      }
    }

    const loop = (t) => {
      const dt = last ? Math.min(64, t - last) : 16
      last = t
      draw(t, dt)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || reduce) return
      running = true
      last = 0
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    build()
    draw(0, 16)
    start()

    const ro = new ResizeObserver(() => {
      build()
      draw(0, 16)
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(canvas)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    />
  )
}
