'use client'

import { useState } from 'react'
import InputForm from '@/components/InputForm'
import PostMortemOutput from '@/components/PostMortemOutput'
import Header from '@/components/Header'

export type Severity = 'P0' | 'P1' | 'P2'

export interface FormData {
  severity: Severity
  title: string
  errorLogs: string
  timeline: string
  teamNotes: string
  affectedSystems: string
}

export interface PostMortemData {
  executiveSummary: string
  timeline: string
  rootCause: string
  impactAnalysis: string
  actionItems: string
  lessonsLearned: string
}

export default function Home() {
  const [step, setStep] = useState<'input' | 'generating' | 'output'>('input')
  const [formData, setFormData] = useState<FormData | null>(null)
  const [streamedText, setStreamedText] = useState('')
  const [postMortem, setPostMortem] = useState<PostMortemData | null>(null)

  const handleGenerate = async (data: FormData) => {
    setFormData(data)
    setStep('generating')
    setStreamedText('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStreamedText(fullText)
      }

      // Parse sections from the streamed text
      const parsed = parsePostMortem(fullText)
      setPostMortem(parsed)
      setStep('output')
    } catch (err) {
      console.error(err)
      setStep('input')
    }
  }

  const handleReset = () => {
    setStep('input')
    setStreamedText('')
    setPostMortem(null)
    setFormData(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {step === 'input' && (
          <InputForm onGenerate={handleGenerate} />
        )}
        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="font-mono text-sm text-muted">Analyzing incident data...</span>
            </div>
            <div className="w-full max-w-2xl bg-surface border border-border rounded-lg p-6 font-mono text-xs text-slate-400 leading-relaxed max-h-64 overflow-y-auto">
              <span className="text-green-400">$ </span>
              <span className="text-slate-300">postmortem-ai generate</span>
              <br /><br />
              <span className="whitespace-pre-wrap text-slate-400">{streamedText}</span>
              <span className="streaming-cursor" />
            </div>
          </div>
        )}
        {step === 'output' && postMortem && formData && (
          <PostMortemOutput
            postMortem={postMortem}
            formData={formData}
            rawText={streamedText}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}

function parsePostMortem(text: string): PostMortemData {
  const extract = (label: string, nextLabel?: string): string => {
    const startTag = `## ${label}`
    const start = text.indexOf(startTag)
    if (start === -1) return ''
    const contentStart = start + startTag.length
    if (!nextLabel) return text.slice(contentStart).trim()
    const end = text.indexOf(`## ${nextLabel}`, contentStart)
    return end === -1 ? text.slice(contentStart).trim() : text.slice(contentStart, end).trim()
  }

  return {
    executiveSummary: extract('Executive Summary', 'Timeline'),
    timeline: extract('Timeline', 'Root Cause'),
    rootCause: extract('Root Cause', 'Impact Analysis'),
    impactAnalysis: extract('Impact Analysis', 'Action Items'),
    actionItems: extract('Action Items', 'Lessons Learned'),
    lessonsLearned: extract('Lessons Learned'),
  }
}
