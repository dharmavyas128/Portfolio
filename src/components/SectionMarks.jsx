// Quiet "observation plate" registration marks — corner crosshairs + a small
// catalog tag — threaded through every section so the page reads as one
// coherent series. Whisper-faint by design; never competes with content.
function Cross({ className }) {
  return (
    <svg
      className={`absolute ${className} text-bone/15`}
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6.5 0V13M0 6.5H13" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export default function SectionMarks({ index }) {
  const code = String(index).padStart(2, '0')
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] hidden sm:block">
      <Cross className="top-8 left-8" />
      <Cross className="top-8 right-8" />
      <Cross className="bottom-8 left-8" />
      <Cross className="bottom-8 right-8" />
      <span className="absolute bottom-7 right-14 text-[10px] tracking-[0.3em] uppercase text-bone/20 font-light">
        Fig. {code}
      </span>
    </div>
  )
}
