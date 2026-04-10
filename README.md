# PostMortem AI — Incident Report Generator

> Paste your error logs and incident timeline. Get a structured, professional post-mortem in seconds.

![PostMortem AI](https://img.shields.io/badge/GPT--4o-powered-E84545?style=flat&logo=openai&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)

## What It Does

Engineers spend 2–4 hours writing post-mortems. This tool does it in 20 seconds.

Input your:
- **Severity** (P0 / P1 / P2)
- **Error logs** from your monitoring tools
- **Incident timeline**
- **Team notes**

Get back a structured post-mortem with:
- Executive summary
- Chronological timeline
- Root cause analysis
- Impact analysis
- Action items (with priority + owner)
- Lessons learned

Export as **PDF** or copy as **Markdown**.

## Demo

→ [Live Demo](https://postmortem-ai.vercel.app) *(deploy your own below)*

## Built With

- **Next.js 14** (App Router + Server Actions)
- **OpenAI GPT-4o** with streaming responses
- **pdf-lib** for PDF export
- **Tailwind CSS**
- Deployed on **Vercel**

## Quick Start

```bash
git clone https://github.com/NidhiSharmaProductLedEngineering/postmortem-ai
cd postmortem-ai
npm install
cp .env.example .env.local
# Add your OpenAI API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NidhiSharmaProductLedEngineering/postmortem-ai)

Set your `OPENAI_API_KEY` environment variable in Vercel dashboard.

## Project Structure

```
postmortem-ai/
├── app/
│   ├── page.tsx              # Main page + state management
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       ├── generate/route.ts # Streaming GPT-4o endpoint
│       └── export/route.ts   # PDF generation endpoint
├── components/
│   ├── Header.tsx            # App header
│   ├── InputForm.tsx         # Incident input form
│   └── PostMortemOutput.tsx  # Structured output + export
```

## Built By

**Nidhi Sharma** — Senior Full Stack Engineer  
14 years building eCommerce and marketplace platforms across UAE/KSA  
[LinkedIn](https://linkedin.com/in/nidhisharma-fe-arc/) · [GitHub](https://github.com/NidhiSharmaProductLedEngineering)
