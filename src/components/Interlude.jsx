import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Starfield from './Starfield'

gsap.registerPlugin(ScrollTrigger)

// A quiet typographic "breath" between Work and Beyond. The line illuminates
// word-by-word as the section scrolls through — a soft lit front travelling
// left-to-right across a deep starfield void.
const WORDS = ['Mastery', 'is', 'a', 'thousand', 'small', 'decisions.']
const ACCENT = 'small'

export default function Interlude() {
  const root = useRef(null)

  useGSAP(
    () => {
      const words = gsap.utils.toArray('.interlude-word')
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 78%',
        end: 'bottom 62%',
        scrub: 0.6,
        onUpdate: (self) => {
          const lit = self.progress * (words.length + 1)
          words.forEach((wd, i) => {
            const local = gsap.utils.clamp(0, 1, lit - i)
            gsap.set(wd, { opacity: 0.12 + 0.85 * local })
          })
        },
      })
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      className="relative py-40 sm:py-56 px-6 overflow-hidden bg-ink"
    >
      <Starfield density={0.5} className="absolute inset-0 h-full w-full" />
      {/* faint center glow + edge darkening to focus the line */}
      <div className="absolute inset-0 interlude-veil" />

      <p className="relative z-10 max-w-4xl mx-auto text-center font-display text-3xl sm:text-5xl lg:text-6xl leading-tight font-medium">
        {WORDS.map((wd, i) => (
          <span
            key={i}
            className={`interlude-word inline-block mr-[0.28em] ${
              wd === ACCENT ? 'italic text-gold' : 'text-bone'
            }`}
            style={{ opacity: 0.12 }}
          >
            {wd}
          </span>
        ))}
      </p>
    </section>
  )
}
