'use client'

import { useEffect, useState } from 'react'

const themes = [
  { id: 'dark',   label: 'Dark',   bg: '#080B0F', surface: '#0F1318', card: '#141920', border: '#1E2530', text: '#E2E8F0', muted: '#64748B', accent: '#E84545' },
  { id: 'light',  label: 'Light',  bg: '#F8F9FC', surface: '#FFFFFF', card: '#F1F4F9', border: '#DDE1EA', text: '#111827', muted: '#6B7280', accent: '#E84545' },
  { id: 'slate',  label: 'Slate',  bg: '#0D1117', surface: '#161B22', card: '#1C2128', border: '#30363D', text: '#E6EDF3', muted: '#7D8590', accent: '#58A6FF' },
  { id: 'matrix', label: 'Matrix', bg: '#020F05', surface: '#061109', card: '#0A1A0D', border: '#143D19', text: '#C9F7D0', muted: '#4A8C56', accent: '#2ECC71' },
]

export default function Header() {
  const [active, setActive] = useState('dark')

  const applyTheme = (t: typeof themes[0]) => {
    const root = document.documentElement
    root.style.setProperty('--theme-bg', t.bg)
    root.style.setProperty('--theme-surface', t.surface)
    root.style.setProperty('--theme-card', t.card)
    root.style.setProperty('--theme-border', t.border)
    root.style.setProperty('--theme-text', t.text)
    root.style.setProperty('--theme-muted', t.muted)
    root.style.setProperty('--theme-accent', t.accent)
    document.body.style.background = t.bg
    document.body.style.color = t.text
    setActive(t.id)
  }

  useEffect(() => { applyTheme(themes[0]) }, [])

  return (
    <header style={{ borderBottom: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded flex items-center justify-center font-mono text-white text-xs font-bold" style={{ background: 'var(--theme-accent)' }}>PM</div>
          <div>
            <span className="font-sans font-medium text-sm" style={{ color: 'var(--theme-text)' }}>PostMortem AI</span>
            <span className="text-xs ml-2 font-mono" style={{ color: 'var(--theme-muted)' }}>v1.0</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: 'var(--theme-muted)' }}>theme</span>
            {themes.map(t => (
              <button
                key={t.id}
                title={t.label}
                onClick={() => applyTheme(t)}
                style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: t.surface,
                  border: active === t.id ? '2.5px solid ' + t.accent : '2px solid ' + t.border,
                  cursor: 'pointer',
                  boxShadow: active === t.id ? '0 0 0 2px ' + t.accent + '50' : 'none',
                  transition: 'all .2s',
                  position: 'relative',
                  outline: 'none',
                }}
              >
                <span style={{
                  position: 'absolute', top: 4, left: 4, right: 4, bottom: 4,
                  borderRadius: '50%', background: t.accent, display: 'block'
                }} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse 2s infinite' }} />
            <span className="text-xs font-mono hidden sm:block" style={{ color: 'var(--theme-muted)' }}>GPT-4o powered</span>
          </div>
        </div>
      </div>
    </header>
  )
}
