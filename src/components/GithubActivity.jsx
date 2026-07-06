import { useEffect, useState } from 'react'

const USERNAME = 'dharmavyas128'

const iconProps = {
  width: 15,
  height: 15,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

// commit · plus/create · pull-request · issue · star · fork · tag/release
const ICONS = {
  push: (
    <svg {...iconProps}>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v4.3M8 10.2v4.3" />
    </svg>
  ),
  create: (
    <svg {...iconProps}>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5.2v5.6M5.2 8h5.6" />
    </svg>
  ),
  pr: (
    <svg {...iconProps}>
      <circle cx="4.5" cy="4" r="1.6" />
      <circle cx="4.5" cy="12" r="1.6" />
      <circle cx="11.5" cy="12" r="1.6" />
      <path d="M4.5 5.6V10.4M9.9 12h-.14a3.3 3.3 0 01-3.3-3.3V6" />
    </svg>
  ),
  issue: (
    <svg {...iconProps}>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3.4" />
      <circle cx="8" cy="10.8" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  ),
  star: (
    <svg {...iconProps}>
      <path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6z" />
    </svg>
  ),
  fork: (
    <svg {...iconProps}>
      <circle cx="4.5" cy="3.6" r="1.5" />
      <circle cx="11.5" cy="3.6" r="1.5" />
      <circle cx="8" cy="12.4" r="1.5" />
      <path d="M4.5 5.1v1.4a2.4 2.4 0 002.4 2.4h2.2a2.4 2.4 0 002.4-2.4V5.1M8 8.9v1.5" />
    </svg>
  ),
  release: (
    <svg {...iconProps}>
      <path d="M2 8.4L8.4 2H13a1 1 0 011 1v4.6L7.6 14 2 8.4z" />
      <circle cx="9.6" cy="5.4" r="0.9" />
    </svg>
  ),
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function timeAgo(iso) {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return `${Math.floor(d / 30)}mo ago`
}

// Map a GitHub public event to a short, friendly line. Returns null for
// event types that aren't worth surfacing (e.g. routine branch deletes).
function describeEvent(e) {
  const repo = e.repo.name.split('/').pop()
  const url = `https://github.com/${e.repo.name}`
  const base = { repo, url, createdAt: e.created_at }

  switch (e.type) {
    case 'PushEvent': {
      const n = e.payload?.commits?.length || 1
      return { ...base, icon: 'push', text: `Pushed ${n} commit${n === 1 ? '' : 's'} to` }
    }
    case 'CreateEvent':
      if (e.payload?.ref_type === 'repository') {
        return { ...base, icon: 'create', text: 'Created repository' }
      }
      return null
    case 'PullRequestEvent':
      return { ...base, icon: 'pr', text: `${cap(e.payload?.action)} a pull request in` }
    case 'IssuesEvent':
      return { ...base, icon: 'issue', text: `${cap(e.payload?.action)} an issue in` }
    case 'WatchEvent':
      return { ...base, icon: 'star', text: 'Starred' }
    case 'ForkEvent':
      return { ...base, icon: 'fork', text: 'Forked' }
    case 'ReleaseEvent':
      return { ...base, icon: 'release', text: 'Published a release in' }
    case 'PublicEvent':
      return { ...base, icon: 'create', text: 'Open-sourced' }
    default:
      return null
  }
}

export default function GithubActivity() {
  const [state, setState] = useState({ status: 'loading', items: [] })

  useEffect(() => {
    let cancelled = false

    fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=30`)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API responded ${res.status}`)
        return res.json()
      })
      .then((events) => {
        if (cancelled) return
        const items = events.map(describeEvent).filter(Boolean).slice(0, 5)
        setState({ status: 'ready', items })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', items: [] })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="reveal glass rounded-3xl p-8 sm:p-10 mt-10 sm:mt-14">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs uppercase tracking-luxe text-gold/80">Recent activity</p>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-bone/50 hover:text-gold transition-colors"
        >
          @{USERNAME} ↗
        </a>
      </div>

      {state.status === 'loading' && (
        <div className="space-y-4" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-4 rounded-full bg-white/5 animate-pulse"
              style={{ width: `${72 - i * 14}%` }}
            />
          ))}
        </div>
      )}

      {state.status === 'error' && (
        <p className="text-sm text-bone/50">
          Couldn&apos;t load recent activity right now — see the full history on{' '}
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="text-gold hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      )}

      {state.status === 'ready' && state.items.length === 0 && (
        <p className="text-sm text-bone/50">No recent public activity.</p>
      )}

      {state.status === 'ready' && state.items.length > 0 && (
        <ul className="space-y-4">
          {state.items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className="text-gold/70 shrink-0">{ICONS[item.icon]}</span>
              <span className="text-bone/75 min-w-0 truncate">
                {item.text}{' '}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-bone hover:text-gold transition-colors"
                >
                  {item.repo}
                </a>
              </span>
              <span className="ml-auto text-xs text-bone/40 shrink-0">
                {timeAgo(item.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
