import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Starfield from './Starfield'
import SectionMarks from './SectionMarks'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })

      gsap.from('.about-portrait img', {
        scale: 1.2,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.about-portrait', start: 'top 80%' },
      })

      gsap.from('.century-frame img', {
        scale: 1.18,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.century-frame', start: 'top 85%' },
      })
    },
    { scope: root }
  )

  return (
    <section id="about" ref={root} className="relative py-28 sm:py-40 px-6 overflow-hidden">
      {/* Night sky backdrop */}
      <div className="absolute inset-0 night-sky" />
      <Starfield density={1} className="absolute inset-0 h-full w-full" />
      {/* Soft scrim so stars sit in the margins, never fighting the text */}
      <div className="absolute inset-0 sky-scrim" />

      <SectionMarks index={1} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <p className="reveal text-xs uppercase tracking-luxe text-gold/80 mb-16 text-center">
          N° 01  About
        </p>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
          <div className="about-portrait reveal relative rounded-2xl overflow-hidden aspect-[3/4] max-w-md mx-auto w-full">
            <img
              src="/photos/portrait.jpg"
              alt="Portrait of Dharma Vyas"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
          </div>

          <div>
            <h2 className="reveal font-display text-4xl sm:text-5xl lg:text-6xl leading-tight font-medium mb-8">
              A builder with <span className="italic text-gold">an eye</span> for the details.
            </h2>
            <div className="reveal space-y-5 text-bone/70 text-lg font-light leading-relaxed">
              <p>
                I&apos;m Dharma — an Information Systems student at the University of
                Maryland, Baltimore County, where I&apos;m drawn to the space where
                technology meets people.
              </p>
              <p>
                I taught myself to design and ship full-stack web applications — from
                real-time PostgreSQL backends to interfaces that feel effortless. I care
                about the twenty milliseconds between a click and a response, because
                that&apos;s where good products are quietly won.
              </p>
              <p>
                Off the screen, I&apos;m a cricketer, a photographer, and a quiet
                obsessive about anything built with care — whether that&apos;s a
                well-engineered car or a clean line of code.
              </p>
            </div>

            <div className="reveal mt-10 flex flex-wrap gap-3">
              {['Python', 'Java', 'React', 'Supabase', 'PostgreSQL', 'Git'].map((s) => (
                <span
                  key={s}
                  className="glass-pill rounded-full px-4 py-2 text-sm text-bone/80"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Century moment */}
        <div className="century-block reveal mt-28 sm:mt-40 grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-center">
          <div className="century-frame relative rounded-3xl overflow-hidden aspect-[2/3] max-w-sm mx-auto w-full">
            <img
              src="/photos/century.jpg"
              alt="Dharma Vyas looking skyward in celebration after a cricket century"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
          </div>

          <div className="glass rounded-3xl px-8 py-9 sm:px-10 sm:py-11 max-w-xl">
            <p className="text-xs uppercase tracking-luxe text-gold/90 mb-5">
              A century, and a moment of stillness
            </p>
            <p className="font-display text-3xl sm:text-4xl leading-snug mb-6">
              &ldquo;The best things take patience to build — and a moment to
              appreciate once they&apos;re done.&rdquo;
            </p>
            <p className="text-bone/60 font-light leading-relaxed">
              Scoring a hundred takes hours of focus and the discipline not to throw
              it away. Building software is the same — patience, attention, and knowing
              the small moments are where it&apos;s won.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
