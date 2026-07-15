import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionMarks from './SectionMarks'
import GithubActivity from './GithubActivity'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    n: '01',
    title: 'Real-time, ball by ball',
    body: 'Friends watch live games update instantly through Supabase Realtime. No refresh, no waiting.',
  },
  {
    n: '02',
    title: 'A pure-reducer scoring engine',
    body: 'Immutable state with a snapshot-based history stack, enabling unlimited undo without ever mutating state.',
  },
  {
    n: '03',
    title: 'Postgres with teeth',
    body: 'Row-Level Security and 6+ custom PL/pgSQL functions powering a fantasy-style points system.',
  },
  {
    n: '04',
    title: 'Built for everyone',
    body: 'Email, Google OAuth, and guest mode, plus a social friendships system to bring your crew along.',
  },
]

const mandirFeatures = [
  {
    n: '01',
    title: 'Scroll-scrubbed cinematic intro',
    body: 'A temple video mapped frame-by-frame to scroll position via requestAnimationFrame, re-encoded all-intra to eliminate seek lag.',
  },
  {
    n: '02',
    title: 'Pixel-precise Charan Chinh explorer',
    body: '16 auspicious marks hand-calibrated against a real reference photo, each triggering a glow that glides exactly onto the mark.',
  },
  {
    n: '03',
    title: 'Sarthi, the in-app guide',
    body: 'A client-side keyword/fuzzy-matching chat engine. Every answer is pre-written and reviewable, zero hallucination risk on sensitive content.',
  },
  {
    n: '04',
    title: '"Emerald Dynasty" design system',
    body: 'Custom glassmorphism, an animated toran and mandala motifs, built from scratch. No template, fully gated behind reduced-motion.',
  },
]

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

// Real-time broadcast · reducer/undo · database · people
const ICONS = [
  <svg key="0" {...iconProps}>
    <circle cx="8" cy="8" r="1.2" />
    <path d="M5.2 10.8a4 4 0 010-5.6M10.8 5.2a4 4 0 010 5.6M3.4 12.6a6.5 6.5 0 010-9.2M12.6 3.4a6.5 6.5 0 010 9.2" />
  </svg>,
  <svg key="1" {...iconProps}>
    <path d="M2.6 8a5.4 5.4 0 105.4-5.4A5.4 5.4 0 004 4.3L2.6 5.7" />
    <path d="M2.6 2.6v3.1h3.1" />
  </svg>,
  <svg key="2" {...iconProps}>
    <ellipse cx="8" cy="3.6" rx="4.8" ry="1.9" />
    <path d="M3.2 3.6v8.8c0 1 2.1 1.9 4.8 1.9s4.8-.9 4.8-1.9V3.6" />
    <path d="M3.2 8c0 1 2.1 1.9 4.8 1.9s4.8-.9 4.8-1.9" />
  </svg>,
  <svg key="3" {...iconProps}>
    <circle cx="6" cy="6" r="2.1" />
    <path d="M2.2 13a3.8 3.8 0 017.6 0" />
    <path d="M10.8 4.1a2.1 2.1 0 010 3.9M13.8 13a3.8 3.8 0 00-2.9-3.7" />
  </svg>,
]

// Scroll/play · crosshair mark · chat guide · sparkle
const MANDIR_ICONS = [
  <svg key="0" {...iconProps}>
    <rect x="2" y="2" width="12" height="12" rx="2.4" />
    <path d="M6.4 5.3l4.2 2.7-4.2 2.7z" />
  </svg>,
  <svg key="1" {...iconProps}>
    <circle cx="8" cy="8" r="5.2" />
    <circle cx="8" cy="8" r="0.9" fill="currentColor" stroke="none" />
    <path d="M8 1.6v2M8 12.4v2M1.6 8h2M12.4 8h2" />
  </svg>,
  <svg key="2" {...iconProps}>
    <path d="M2.6 4.6a2 2 0 012-2h6.8a2 2 0 012 2v4.6a2 2 0 01-2 2H7.2l-2.9 2.4v-2.4H4.6a2 2 0 01-2-2z" />
  </svg>,
  <svg key="3" {...iconProps}>
    <path d="M8 1.6l1 3.8 3.8 1-3.8 1-1 3.8-1-3.8-3.8-1 3.8-1z" />
  </svg>,
]

export default function Projects() {
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    },
    { scope: root }
  )

  return (
    <section id="work" ref={root} className="relative py-28 sm:py-40 px-6 overflow-hidden">
      {/* morphing colour blob behind the heading */}
      <div className="liquid-blob w-[46rem] h-[30rem] top-0 left-1/2 -translate-x-1/2" />
      <SectionMarks index={2} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <p className="reveal text-xs uppercase tracking-luxe text-gold/80 mb-6 text-center">
          N° 02  Selected Work
        </p>
        <h2 className="reveal font-display text-4xl sm:text-6xl text-center font-medium mb-20">
          Things I&apos;ve <span className="italic text-gold">built</span>.
        </h2>

        {/* Featured — Street Stumps */}
        <article className="glass glow-soft rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="reveal relative min-h-[340px] lg:min-h-full overflow-hidden">
              <img
                src="/photos/jersey.jpg"
                alt="Dharma Vyas in cricket whites with DHARMA 28 on the back"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/40" />
            </div>

            <div className="p-8 sm:p-12 lg:p-14">
              <div className="reveal flex items-center gap-3 mb-6">
                <span className="text-xs uppercase tracking-luxe text-gold/90">
                  Featured Project
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                <span className="text-xs text-emerald-300/80">Live</span>
              </div>

              <h3 className="reveal font-display text-4xl sm:text-5xl font-medium mb-4">
                Street Stumps
              </h3>
              <p className="reveal text-bone/80 text-lg font-light leading-relaxed mb-8">
                A mobile-first cricket scoring app for casual games, built because the
                only tool most street cricketers have is a scrap of paper. Score live,
                share with friends, and keep the game honest.
              </p>

              <div className="reveal flex flex-wrap gap-2 mb-9">
                {['React', 'Vite', 'Tailwind', 'Supabase', 'PostgreSQL', 'Realtime'].map(
                  (t) => (
                    <span
                      key={t}
                      className="text-xs glass-pill rounded-full px-3 py-1.5 text-bone/75"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>

              <div className="reveal flex flex-wrap gap-4">
                <a
                  href="https://street-stumps.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-liquid rounded-full px-6 py-3 text-sm tracking-wide"
                >
                  View live ↗
                </a>
                <a
                  href="https://github.com/dharmavyas128/street-stumps"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full px-6 py-3 text-sm tracking-wide text-bone/70 hover:text-bone border border-white/15 hover:border-white/30 transition-colors"
                >
                  Source code
                </a>
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10">
            {features.map((f, i) => (
              <div
                key={f.n}
                className="reveal p-7 border-b sm:border-b-0 sm:border-r border-white/10 last:border-r-0"
              >
                <div className="flex items-center gap-2.5 text-gold/70">
                  {ICONS[i]}
                  <span className="font-display text-sm">{f.n}</span>
                </div>
                <h4 className="mt-3 mb-2 text-base font-medium">{f.title}</h4>
                <p className="text-sm text-bone/75 font-light leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </article>

        {/* Mini Mandir */}
        <article className="glass glow-soft rounded-3xl overflow-hidden mt-10">
          <div className="grid lg:grid-cols-2">
            <div className="reveal relative min-h-[340px] lg:min-h-full overflow-hidden lg:order-last">
              <img
                src="/photos/mini-mandir.jpg"
                alt="Kalupur Mandir, Ahmedabad: opening frame of the Mini Mandir scroll intro"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-ink/40" />
            </div>

            <div className="p-8 sm:p-12 lg:p-14">
              <div className="reveal flex items-center gap-3 mb-6">
                <span className="text-xs uppercase tracking-luxe text-gold/90">
                  Kids&apos; Education · Devotional
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                <span className="text-xs text-emerald-300/80">Live</span>
              </div>

              <h3 className="reveal font-display text-4xl sm:text-5xl font-medium mb-4">
                Mini Mandir
              </h3>
              <p className="reveal text-bone/80 text-lg font-light leading-relaxed mb-8">
                A devotional web app that teaches kids the Swaminarayan Sampraday
                tradition and the Hindi &amp; Gujarati languages, a scroll-driven
                temple video, an interactive Charan Chinh explorer, language lessons,
                and a friendly in-app guide, all in a custom-built glass design system.
              </p>

              <div className="reveal flex flex-wrap gap-2 mb-9">
                {['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Motion', 'Vercel'].map(
                  (t) => (
                    <span
                      key={t}
                      className="text-xs glass-pill rounded-full px-3 py-1.5 text-bone/75"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>

              <div className="reveal flex flex-wrap gap-4">
                <a
                  href="https://mini-mandir.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-liquid rounded-full px-6 py-3 text-sm tracking-wide"
                >
                  View live ↗
                </a>
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10">
            {mandirFeatures.map((f, i) => (
              <div
                key={f.n}
                className="reveal p-7 border-b sm:border-b-0 sm:border-r border-white/10 last:border-r-0"
              >
                <div className="flex items-center gap-2.5 text-gold/70">
                  {MANDIR_ICONS[i]}
                  <span className="font-display text-sm">{f.n}</span>
                </div>
                <h4 className="mt-3 mb-2 text-base font-medium">{f.title}</h4>
                <p className="text-sm text-bone/75 font-light leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </article>

        <GithubActivity />

        <p className="reveal text-center text-bone/40 text-sm mt-10 font-light">
          More projects in progress. The best is still being written.
        </p>
      </div>
    </section>
  )
}
