import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Interlude from './components/Interlude'
import Beyond from './components/Beyond'
import Contact from './components/Contact'
import ScrollToTop from './components/ScrollToTop'
gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    if (import.meta.env.DEV) window.__lenis = lenis

    const raf = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <main className="grain relative overflow-x-hidden">
      <Cursor />
      <Nav />
      <Hero />
      {/* Orbital arc — anchored at the hero/About seam. The 0-height anchor sits
          in <main> (no overflow clip) so the arc scrolls with the page like a
          real horizon instead of staying glued to the viewport. */}
      <div className="orbital-anchor">
        <div className="orbital-fade">
          <div className="orbital-arc" />
        </div>
      </div>
      <About />
      <Projects />
      <Interlude />
      <Beyond />
      <Contact />
      <ScrollToTop />
    </main>
  )
}
