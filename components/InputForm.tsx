'use client'

import { useState } from 'react'
import { FormData, Severity } from '@/app/page'

const DEMO_DATA: FormData = {
  severity: 'P0',
  title: 'Payment Gateway Timeout — Checkout Failure',
  errorLogs: `[2024-01-15 14:23:01] ERROR PaymentService: Tabby gateway connection timeout after 30000ms
[2024-01-15 14:23:01] ERROR OrderController: Payment processing failed for order #ORD-9823x
[2024-01-15 14:23:05] CRITICAL Redis: Connection pool exhausted (max: 100, active: 100)
[2024-01-15 14:23:07] ERROR CheckoutService: Fallback to Tamara gateway failed - upstream timeout
[2024-01-15 14:25:11] ERROR MonitoringService: 3,847 checkout attempts failed in last 2 minutes
[2024-01-15 14:31:00] INFO PaymentService: Tabby gateway restored - connection successful`,
  timeline: `14:20 - Spike in checkout error rate detected by Datadog alert
14:23 - On-call engineer paged, begins investigation
14:25 - Identified Tabby payment gateway as root cause
14:27 - Attempted failover to Tamara — also timing out
14:29 - Escalated to infrastructure team, Redis pool issue identified
14:31 - Tabby gateway restored, checkout success rate recovering
14:40 - All systems normal, incident resolved`,
  teamNotes: `- Root cause appears to be Tabby's infrastructure issue on their side
- Our Redis connection pool was exhausted as a secondary effect of retry storms
- ~3,800 orders failed during the 17-minute window
- Estimated revenue impact: AED 285,000
- No data loss, all failed orders correctly marked as failed in DB`,
  affectedSystems: 'Checkout Service, Payment Gateway (Tabby), Redis Cache, Order Management System',
}

interface InputFormProps {
  onGenerate: (data: FormData) => void
}

export default function InputForm({ onGenerate }: InputFormProps) {
  const [form, setForm] = useState<FormData>({
    severity: 'P1',
    title: '',
    errorLogs: '',
    timeline: '',
    teamNotes: '',
    affectedSystems: '',
  })

  const set = (key: keyof FormData, value: string) => setForm(f => ({ ...f, [key]: value }))
  const loadDemo = () => setForm(DEMO_DATA)

  const severities: Severity[] = ['P0', 'P1', 'P2']
  const severityLabels = { P0: 'Critical — Full Outage', P1: 'High — Major Degradation', P2: 'Medium — Partial Impact' }
  const severityColors = {
    P0: 'border-accent text-accent bg-accent/10',
    P1: 'border-amber text-amber bg-amber/10',
    P2: 'border-blue-400 text-blue-400 bg-blue-400/10',
  }

  const canSubmit = form.title && form.errorLogs && form.timeline

  return (
    <div className="max-w-3xl mx-auto section-fade">
      {/* Hero */}
      <div className="text-center mb-10 pt-6">
        <h1 className="text-3xl font-light text-slate-100 mb-3 tracking-tight">
          Incident Post-Mortem
          <span className="text-accent"> Generator</span>
        </h1>
        <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
          Paste your logs, timeline, and notes. Get a structured, professional post-mortem in seconds.
        </p>
        <button
          onClick={loadDemo}
          className="mt-4 text-xs font-mono text-muted border border-border px-4 py-1.5 rounded hover:border-accent hover:text-accent transition-colors"
        >
          ↗ Load demo incident
        </button>
      </div>

      <div className="space-y-5">
        {/* Severity */}
        <div>
          <label className="block text-xs text-muted font-mono uppercase tracking-wider mb-2">Severity</label>
          <div className="flex gap-2">
            {severities.map(s => (
              <button
                key={s}
                onClick={() => set('severity', s)}
                className={`flex-1 py-2.5 border rounded-lg text-sm font-mono font-medium transition-all ${
                  form.severity === s ? severityColors[s] : 'border-border text-muted hover:border-dim'
                }`}
              >
                <div>{s}</div>
                <div className="text-[10px] font-sans font-normal mt-0.5 opacity-70">{severityLabels[s]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs text-muted font-mono uppercase tracking-wider mb-2">Incident Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. Payment Gateway Timeout — Checkout Failure"
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Affected Systems */}
        <div>
          <label className="block text-xs text-muted font-mono uppercase tracking-wider mb-2">Affected Systems</label>
          <input
            type="text"
            value={form.affectedSystems}
            onChange={e => set('affectedSystems', e.target.value)}
            placeholder="e.g. Checkout Service, Redis Cache, Payment Gateway"
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Error Logs */}
        <div>
          <label className="block text-xs text-muted font-mono uppercase tracking-wider mb-2">
            Error Logs
            <span className="text-accent ml-1">*</span>
          </label>
          <textarea
            value={form.errorLogs}
            onChange={e => set('errorLogs', e.target.value)}
            rows={6}
            placeholder={`[14:23:01] ERROR PaymentService: Connection timeout\n[14:23:05] CRITICAL Redis: Pool exhausted\n...`}
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-xs font-mono text-slate-300 placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-xs text-muted font-mono uppercase tracking-wider mb-2">
            Incident Timeline
            <span className="text-accent ml-1">*</span>
          </label>
          <textarea
            value={form.timeline}
            onChange={e => set('timeline', e.target.value)}
            rows={5}
            placeholder={`14:20 - Alert triggered\n14:23 - Engineer paged\n14:30 - Root cause identified\n...`}
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-xs font-mono text-slate-300 placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Team Notes */}
        <div>
          <label className="block text-xs text-muted font-mono uppercase tracking-wider mb-2">Team Notes</label>
          <textarea
            value={form.teamNotes}
            onChange={e => set('teamNotes', e.target.value)}
            rows={4}
            placeholder="Any context, observations, or initial findings from the team..."
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-slate-300 placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Submit */}
        <button
          onClick={() => onGenerate(form)}
          disabled={!canSubmit}
          className={`w-full py-3.5 rounded-lg font-medium text-sm transition-all ${
            canSubmit
              ? 'bg-accent text-white hover:bg-red-500 active:scale-[0.99]'
              : 'bg-surface border border-border text-muted cursor-not-allowed'
          }`}
        >
          {canSubmit ? '→ Generate Post-Mortem' : 'Fill required fields to continue'}
        </button>
      </div>
    </div>
  )
}
