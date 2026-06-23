import { useEffect, useState } from 'react'

const links = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Beyond', href: '#beyond', id: 'beyond' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)

      // Scroll progress (0–1) across the whole page
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0)

      // Active section = the last one whose top has crossed 40% of the viewport
      const threshold = window.innerHeight * 0.4
      let current = ''
      for (const l of links) {
        const el = document.getElementById(l.id)
        if (el && el.getBoundingClientRect().top <= threshold) current = l.id
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Scroll progress line */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none">
        <div
          className="h-full bg-gold origin-left will-change-transform"
          style={{
            transform: `scaleX(${progress})`,
            boxShadow: '0 0 8px rgba(201, 163, 94, 0.5)',
          }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
          scrolled ? 'pt-4' : 'pt-6'
        }`}
      >
        <nav
          className={`glass-pill rounded-full flex items-center gap-1 transition-all duration-500 ${
            scrolled ? 'px-2 py-2' : 'px-3 py-2.5'
          }`}
        >
          <a
            href="#top"
            onClick={(e) => go(e, '#top')}
            className="px-4 py-2 font-display text-lg tracking-wide text-bone/90 hover:text-gold transition-colors"
          >
            DV
          </a>
          <span className="hidden sm:block w-px h-5 bg-white/15 mx-1" />
          <div className="hidden sm:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                aria-current={active === l.id ? 'true' : undefined}
                className={`px-4 py-2 text-sm tracking-wide rounded-full transition-colors ${
                  active === l.id
                    ? 'text-gold bg-white/5'
                    : 'text-bone/70 hover:text-bone hover:bg-white/5'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden px-4 py-2 text-sm text-bone/80"
            aria-label="Toggle menu"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </nav>

        {open && (
          <div className="sm:hidden absolute top-20 glass-strong rounded-2xl px-6 py-4 flex flex-col gap-1 w-[80vw] max-w-xs">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                aria-current={active === l.id ? 'true' : undefined}
                className={`py-3 text-center transition-colors border-b border-white/5 last:border-0 ${
                  active === l.id ? 'text-gold' : 'text-bone/80 hover:text-gold'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  )
}
