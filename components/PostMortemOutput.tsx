'use client'

import { useState } from 'react'
import { PostMortemData, FormData } from '@/app/page'

interface Props {
  postMortem: PostMortemData
  formData: FormData
  rawText: string
  onReset: () => void
}

const sections = [
  { key: 'executiveSummary', label: 'Executive Summary', icon: '◈' },
  { key: 'timeline', label: 'Timeline', icon: '◷' },
  { key: 'rootCause', label: 'Root Cause', icon: '◉' },
  { key: 'impactAnalysis', label: 'Impact Analysis', icon: '◐' },
  { key: 'actionItems', label: 'Action Items', icon: '◆' },
  { key: 'lessonsLearned', label: 'Lessons Learned', icon: '◈' },
] as const

export default function PostMortemOutput({ postMortem, formData, rawText, onReset }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  const severityColor = {
    P0: 'text-accent border-accent bg-accent/10',
    P1: 'text-amber border-amber bg-amber/10',
    P2: 'text-blue-400 border-blue-400 bg-blue-400/10',
  }[formData.severity]

  const toggle = (key: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const copyMarkdown = () => {
    navigator.clipboard.writeText(rawText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportPDF = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          severity: formData.severity,
          content: rawText,
          date: new Date().toISOString().split('T')[0],
        }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `postmortem-${formData.severity}-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    }
    setExporting(false)
  }

  return (
    <div className="max-w-3xl mx-auto section-fade">
      {/* Top bar */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-xs font-mono font-bold border px-2 py-0.5 rounded ${severityColor}`}>
              {formData.severity}
            </span>
            <span className="text-xs text-muted font-mono">
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <h2 className="text-lg font-medium text-slate-100">{formData.title}</h2>
          <p className="text-xs text-muted mt-1">{formData.affectedSystems}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={copyMarkdown}
            className="text-xs font-mono border border-border px-3 py-1.5 rounded text-muted hover:border-slate-400 hover:text-slate-300 transition-colors"
          >
            {copied ? '✓ Copied' : '⎘ Markdown'}
          </button>
          <button
            onClick={exportPDF}
            disabled={exporting}
            className="text-xs font-mono border border-accent px-3 py-1.5 rounded text-accent hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : '↓ Export PDF'}
          </button>
          <button
            onClick={onReset}
            className="text-xs font-mono border border-border px-3 py-1.5 rounded text-muted hover:border-slate-400 transition-colors"
          >
            ← New
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map(({ key, label, icon }) => {
          const content = postMortem[key]
          const isCollapsed = collapsed.has(key)
          const isTimeline = key === 'timeline'
          const isActionItems = key === 'actionItems'

          return (
            <div key={key} className="bg-surface border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(key)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-card transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-accent text-xs font-mono">{icon}</span>
                  <span className="text-sm font-medium text-slate-200">{label}</span>
                </div>
                <span className="text-muted font-mono text-xs">{isCollapsed ? '+ expand' : '- collapse'}</span>
              </button>

              {!isCollapsed && (
                <div className="px-5 pb-5 border-t border-border">
                  {isTimeline ? (
                    <TimelineContent content={content} />
                  ) : isActionItems ? (
                    <ActionItemsContent content={content} />
                  ) : (
                    <ProseContent content={content} />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-muted mt-8 font-mono">
        Generated by PostMortem AI · Built by Nidhi Sharma
      </p>
    </div>
  )
}

function ProseContent({ content }: { content: string }) {
  return (
    <div className="pt-4 text-sm text-slate-300 leading-relaxed space-y-2">
      {content.split('\n').filter(Boolean).map((line, i) => {
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-accent mt-0.5 flex-shrink-0">•</span>
              <span>{line.slice(2)}</span>
            </div>
          )
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-medium text-slate-200">{line.replace(/\*\*/g, '')}</p>
        }
        return <p key={i}>{line}</p>
      })}
    </div>
  )
}

function TimelineContent({ content }: { content: string }) {
  const events = content.split('\n').filter(l => l.trim())
  return (
    <div className="pt-4 space-y-1">
      {events.map((event, i) => {
        const match = event.match(/^\[?(\d{2}:\d{2})\]?\s*[-–]?\s*(.+)/)
        if (match) {
          return (
            <div key={i} className="flex gap-4 items-start py-1.5 border-b border-border/50 last:border-0">
              <span className="font-mono text-xs text-green-400 flex-shrink-0 mt-0.5 w-12">{match[1]}</span>
              <span className="text-sm text-slate-300">{match[2]}</span>
            </div>
          )
        }
        return <p key={i} className="text-sm text-slate-400">{event}</p>
      })}
    </div>
  )
}

function ActionItemsContent({ content }: { content: string }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const items = content.split('\n').filter(l => l.trim() && (l.startsWith('-') || l.startsWith('•')))

  const priorityColor = (line: string) => {
    if (line.includes('HIGH')) return 'text-accent bg-accent/10 border-accent/30'
    if (line.includes('MEDIUM')) return 'text-amber bg-amber/10 border-amber/30'
    return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
  }

  const getPriority = (line: string) => {
    if (line.includes('HIGH')) return 'HIGH'
    if (line.includes('MEDIUM')) return 'MED'
    return 'LOW'
  }

  return (
    <div className="pt-4 space-y-2">
      {items.map((item, i) => {
        const text = item.replace(/^[-•]\s*/, '')
        const isChecked = checked.has(i)
        return (
          <div
            key={i}
            onClick={() => setChecked(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })}
            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
              isChecked ? 'border-border bg-card opacity-50' : 'border-border bg-card hover:border-dim'
            }`}
          >
            <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              isChecked ? 'bg-green-500 border-green-500' : 'border-muted'
            }`}>
              {isChecked && <span className="text-white text-[10px]">✓</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${isChecked ? 'line-through text-muted' : 'text-slate-300'}`}>{text}</p>
            </div>
            <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded flex-shrink-0 ${priorityColor(text)}`}>
              {getPriority(text)}
            </span>
          </div>
        )
      })}
      <p className="text-xs text-muted font-mono pt-1">{checked.size}/{items.length} resolved</p>
    </div>
  )
}
