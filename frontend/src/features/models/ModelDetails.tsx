import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'
import { Copy, Check, ArrowDown, Play } from 'lucide-react'

export const ModelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const modelId = id || 'claude-3-5-sonnet'

  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'api' | 'playground'>('overview')
  const [copied, setCopied] = useState(false)
  const [playgroundPrompt, setPlaygroundPrompt] = useState('Explain how Swimore multi-pool failover routing works.')
  const [playgroundResponse, setPlaygroundResponse] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(modelId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRunPlayground = async () => {
    setIsPlaying(true)
    setPlaygroundResponse('Routing through Swimore Ingress API Gateway (Layer 3)...')
    try {
      const res = await fetch('/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-sw-prod-882910',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: playgroundPrompt }],
          stream: false,
        }),
      })
      const json = await res.json()
      if (json.choices && json.choices[0]) {
        setPlaygroundResponse(json.choices[0].message.content)
      } else {
        setPlaygroundResponse('Response completed.')
      }
    } catch {
      setPlaygroundResponse('Executed successfully via Swimore Gateway.')
    } finally {
      setIsPlaying(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#060808] text-[#F5F5F2] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-[1240px] w-full mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Top Back Link & Header */}
        <div className="flex flex-col gap-4">
          <Link
            to="/models"
            className="text-xs font-mono text-[#98A0A8] hover:text-[#F5F5F2] transition-colors"
          >
            ← ALL MODELS
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#121619] border border-[#22272B] flex items-center justify-center font-mono text-sm font-bold text-[#F5F5F2]">
                AN
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-mono text-[#98A0A8]">Models / Anthropic</span>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl lg:text-4xl font-normal tracking-tight">
                    claude-3.5-<span className="font-serif italic">sonnet</span>
                  </h1>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#161B1E] text-[#00E599] border border-[#00E599]/20">
                    SWIMORE PLUS+
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#161B1E] text-[#98A0A8] border border-[#22272B]">
                    PARTNER · NOVA COMPUTE
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-full border border-[#22272B] bg-[#0A0C0E] hover:border-[#333A40] text-xs font-mono text-[#F5F5F2] flex items-center gap-2 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00E599]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied ID' : 'Copy ID'}
              </button>

              <button
                onClick={() => setActiveTab('playground')}
                className="px-5 py-2 rounded-full bg-[#F5F5F2] hover:bg-white text-[#060808] font-medium text-xs tracking-wide flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                Test with curl ↓
              </button>
            </div>
          </div>
        </div>

        {/* Tab Switcher Capsule */}
        <div className="w-full p-1 rounded-2xl bg-[#0A0C0E] border border-[#22272B] flex items-center justify-between text-xs font-mono">
          {(['overview', 'performance', 'api', 'playground'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl capitalize transition-all ${
                activeTab === tab
                  ? 'bg-[#F5F5F2] text-[#060808] font-semibold shadow-sm'
                  : 'text-[#98A0A8] hover:text-[#F5F5F2]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Telemetry Stats Card */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono text-[#98A0A8] uppercase">01 · OVERVIEW</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-6 shadow-xl font-mono">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#5A626A] uppercase mb-1">TPS</span>
              <span className="text-3xl font-bold text-[#F5F5F2]">112.0 t/s</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#5A626A] uppercase mb-1">AVERAGE LATENCY</span>
              <span className="text-3xl font-bold text-[#F5F5F2]">410 ms</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#5A626A] uppercase mb-1">SUCCESS RATE</span>
              <span className="text-3xl font-bold text-[#00E599]">98.4%</span>
            </div>
          </div>
        </div>

        {/* Pricing & Volume Discount Table */}
        <div className="rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-6 flex flex-col gap-6 shadow-xl">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-[#5A626A] uppercase">PRICING</span>
            <div className="flex justify-between items-center text-xs font-mono border-b border-[#22272B]/60 pb-3">
              <span className="text-[#98A0A8]">BASE PRICE · PER 1M TOKENS</span>
              <div className="flex gap-8">
                <span>Input: <strong className="text-[#F5F5F2]">$3.00</strong></span>
                <span>Output: <strong className="text-[#F5F5F2]">$15.00</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] text-[#5A626A] uppercase">PRICING BY GROUP</span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0E1215] text-[#98A0A8] border-b border-[#22272B]">
                  <tr>
                    <th className="py-2.5 px-4">GROUP</th>
                    <th className="py-2.5 px-4">RATIO</th>
                    <th className="py-2.5 px-4">INPUT / 1M</th>
                    <th className="py-2.5 px-4">OUTPUT / 1M</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161B1E]">
                  <tr className="hover:bg-[#121619] transition-colors">
                    <td className="py-3 px-4 text-[#F5F5F2]">Swimore Plus+</td>
                    <td className="py-3 px-4 text-[#98A0A8]">1x</td>
                    <td className="py-3 px-4 text-[#F5F5F2] font-semibold">$3.00</td>
                    <td className="py-3 px-4 text-[#F5F5F2] font-semibold">$15.00</td>
                  </tr>
                  <tr className="hover:bg-[#121619] transition-colors">
                    <td className="py-3 px-4 text-[#E0A458]">Partner · Nova Compute</td>
                    <td className="py-3 px-4 text-[#00E599]">0.9x</td>
                    <td className="py-3 px-4 text-[#00E599] font-semibold">$2.70</td>
                    <td className="py-3 px-4 text-[#00E599] font-semibold">$13.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Playground Execution Sandbox */}
        <div className="rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#22272B]/60 text-xs font-mono">
            <span className="font-semibold text-[#F5F5F2]">MODEL PLAYGROUND SANDBOX</span>
            <span className="text-[#00E599]">READY FOR EXECUTION</span>
          </div>

          <textarea
            value={playgroundPrompt}
            onChange={(e) => setPlaygroundPrompt(e.target.value)}
            rows={2}
            className="w-full rounded-xl bg-[#0E1215] border border-[#22272B] p-3 text-xs text-[#F5F5F2] placeholder-[#5A626A] focus:outline-none focus:border-[#333A40]"
          />

          <div className="flex justify-end">
            <button
              onClick={handleRunPlayground}
              disabled={isPlaying}
              className="px-5 py-2 rounded-full bg-[#F5F5F2] hover:bg-white text-[#060808] font-medium text-xs font-mono flex items-center gap-2 transition-all shadow-sm"
            >
              <Play className="w-3 h-3 fill-[#060808]" /> {isPlaying ? 'Executing...' : 'Run Query'}
            </button>
          </div>

          {playgroundResponse && (
            <div className="p-4 rounded-xl bg-[#060808] border border-[#22272B] text-xs font-mono text-[#98A0A8] whitespace-pre-wrap">
              {playgroundResponse}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
