import { NextRequest } from 'next/server'
import OpenAI from 'openai'



export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const body = await req.json()
  const { severity, title, errorLogs, timeline, teamNotes, affectedSystems } = body

  const severityContext = {
    P0: 'Critical — full outage, all users affected, revenue impact',
    P1: 'High — major feature down, significant user impact',
    P2: 'Medium — degraded performance, partial user impact',
  }[severity as string] || 'Unknown'

  const prompt = `You are a senior engineering lead writing a professional post-mortem report. 
Generate a comprehensive, structured incident post-mortem based on the following data.

Severity: ${severity} — ${severityContext}
Incident Title: ${title}
Affected Systems: ${affectedSystems}

Error Logs:
${errorLogs}

Incident Timeline:
${timeline}

Team Notes:
${teamNotes}

Write a detailed post-mortem with these exact sections (use ## as section headers):

## Executive Summary
2-3 sentences. What happened, severity, impact, and current status.

## Timeline
A chronological list of events. Format each as: [HH:MM] — Event description

## Root Cause
Detailed technical root cause analysis. Be specific and technical.

## Impact Analysis
- Users affected (estimate if not given)
- Systems/services impacted
- Business impact (revenue, SLA, reputation)
- Duration of incident

## Action Items
List of concrete action items with format:
- [OWNER] Action description — Priority: HIGH/MEDIUM/LOW — Due: X days

## Lessons Learned
What went well, what failed, and systemic improvements needed.

Be professional, technical, and thorough. Use markdown formatting within sections.`

  const stream = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    max_tokens: 2000,
    temperature: 0.3,
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || ''
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
