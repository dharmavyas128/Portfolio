import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionMarks from './SectionMarks'

gsap.registerPlugin(ScrollTrigger)

const socials = [
  { label: 'Email', href: 'mailto:dharmavyas128@gmail.com', handle: 'dharmavyas128@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/dharmavyas128', handle: 'github.com/dharmavyas128' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/dharma-vyas-739b6134a',
    handle: 'in/dharma-vyas',
  },
]

export default function Contact() {
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.from('.contact-bg', {
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      })
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
    },
    { scope: root }
  )

  return (
    <section
      id="contact"
      ref={root}
      className="relative min-h-[100svh] flex items-center justify-center px-6 py-28 overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src="/photos/skyline1.jpg"
          alt=""
          aria-hidden="true"
          className="contact-bg contact-fade h-full w-full object-cover"
        />
        <div className="absolute inset-0 contact-scrim backdrop-blur-sm" />
      </div>

      <SectionMarks index={4} />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <p className="reveal text-xs uppercase tracking-luxe text-gold/80 mb-6">
          N° 04  Contact
        </p>
        <h2 className="reveal font-display text-5xl sm:text-7xl font-medium leading-[0.95] mb-8">
          Let&apos;s build
          <br />
          <span className="italic text-irid">something good.</span>
        </h2>
        <p className="reveal text-bone/80 text-lg font-light max-w-md mx-auto mb-12">
          I&apos;m looking for internships where I can learn fast and ship things that
          matter. If that sounds like your team, I&apos;d love to talk.
        </p>

        <a
          href="/Dharma-Vyas-resume.pdf"
          download
          className="reveal inline-flex items-center gap-3 btn-liquid rounded-full px-7 py-3.5 text-sm tracking-wide mb-10 group"
        >
          <span>Download Résumé</span>
          <span className="group-hover:translate-y-0.5 transition-transform inline-block">↓</span>
        </a>

        <div className="reveal glass-strong glow-soft rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col divide-y divide-white/10">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <span className="text-sm uppercase tracking-luxe text-bone/50 group-hover:text-gold transition-colors">
                  {s.label}
                </span>
                <span className="text-base sm:text-lg text-bone/85 group-hover:text-bone transition-colors flex items-center gap-2">
                  {s.handle}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <p className="reveal mt-12 text-xs text-bone/40 tracking-wide">
          Laurel, Maryland · Designed &amp; built by Dharma Vyas
        </p>
      </div>
    </section>
  )
}
