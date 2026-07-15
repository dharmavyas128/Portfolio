import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionMarks from './SectionMarks'

gsap.registerPlugin(ScrollTrigger)

const shots = [
  { src: '/photos/flame1.jpg', label: 'Aarti, in available light', span: 'row-span-2' },
  { src: '/photos/road.jpg', label: 'Backroads, golden hour', span: 'row-span-2' },
  { src: '/photos/flame2.jpg', label: 'Aarti, a moment later', span: '' },
  { src: '/photos/ocean.jpg', label: 'Last light on the water', span: '' },
  { src: '/photos/skyline2.jpg', label: 'The city, from above', span: 'col-span-2' },
]

export default function Beyond() {
  const root = useRef(null)
  const [active, setActive] = useState(null)

  useGSAP(
    () => {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
      gsap.utils.toArray('.shot-photo').forEach((img) => {
        gsap.from(img, {
          scale: 1.18,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: img, start: 'top 92%' },
        })
      })
    },
    { scope: root }
  )

  // Close the lightbox on Escape; lock background scroll while it's open.
  useEffect(() => {
    if (!active) return
    const onKey = (e) => e.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active])

  return (
    <section id="beyond" ref={root} className="relative py-28 sm:py-40 px-6 overflow-hidden">
      {/* morphing colour blob behind the heading */}
      <div className="liquid-blob w-[42rem] h-[26rem] top-4 left-1/2 -translate-x-1/2" />
      <SectionMarks index={3} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <p className="reveal text-xs uppercase tracking-luxe text-gold/80 mb-6 text-center">
          N° 03  Beyond the Code
        </p>
        <h2 className="reveal font-display text-4xl sm:text-6xl text-center font-medium mb-6">
          The way I <span className="italic text-gold">see</span> things.
        </h2>
        <p className="reveal max-w-xl mx-auto text-center text-bone/75 font-light text-lg mb-16">
          Cricket taught me patience. Photography taught me to notice. Both show up
          in the way I build.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[230px] gap-4">
          {shots.map((s) => (
            <figure
              key={s.src}
              className={`shot reveal group relative ${s.span}`}
            >
              <button
                type="button"
                onClick={() => setActive(s)}
                aria-label={`Enlarge photo: ${s.label}`}
                className="block h-full w-full rounded-2xl overflow-hidden"
              >
                <img
                  src={s.src}
                  alt={s.label}
                  className="shot-photo h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-ink/70 to-transparent">
                  <span className="text-sm text-bone/90 tracking-wide">{s.label}</span>
                </span>
              </button>
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox — click any photo to enlarge */}
      {active && (
        <div
          className="lightbox"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.label}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            ×
          </button>
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={active.src} alt={active.label} />
            <figcaption>{active.label}</figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}
