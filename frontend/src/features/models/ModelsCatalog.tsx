import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'
import { Search, ChevronDown, ArrowRight } from 'lucide-react'

export const ModelsCatalog: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'ranking' | 'list'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('All')
  const [rankingTimeframe, setRankingTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('today')

  const providers = [
    'All',
    'Ollama',
    'Anthropic',
    'Qwen',
    'OpenAI',
    'DeepSeek',
    'Mistral',
    'Alibaba',
    'ZAI',
    'Cohere',
  ]

  const models = [
    {
      id: 'deepseek-r1',
      name: 'deepseek-r1',
      provider: 'DeepSeek',
      price: 'Free · 1 req / min',
      latency: 314,
      tps: 70.0,
      tier: 'DEFAULT · FREE USE',
      partnerBadge: 'FREE TIER',
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'claude-3.5-sonnet',
      provider: 'Anthropic',
      price: '$3.00 in · $15.00 out',
      latency: 410,
      tps: 112.0,
      tier: 'SWIMORE PLUS+',
      partnerBadge: 'PARTNER · NOVA COMPUTE',
    },
    {
      id: 'llama-3-3-70b',
      name: 'llama-3.3-70b',
      provider: 'Ollama',
      price: 'Free · 1 req / min',
      latency: 190,
      tps: 95.0,
      tier: 'DEFAULT · FREE USE',
      partnerBadge: 'FREE TIER',
    },
    {
      id: 'gpt-4o',
      name: 'gpt-4o',
      provider: 'OpenAI',
      price: '$2.50 in · $10.00 out',
      latency: 520,
      tps: 95.7,
      tier: 'SWIMORE PLUS+',
      partnerBadge: 'PARTNER MARKET',
    },
    {
      id: 'gemini-1-5-pro',
      name: 'gemini-1.5-pro',
      provider: 'Gemini',
      price: '$1.25 in · $5.00 out',
      latency: 560,
      tps: 102.0,
      tier: 'SWIMORE PLUS+',
      partnerBadge: 'PARTNER · NOVA COMPUTE',
    },
    {
      id: 'qwen-2-5-72b',
      name: 'qwen-2.5-72b',
      provider: 'Alibaba',
      price: 'Free · 1 req / min',
      latency: 220,
      tps: 92.0,
      tier: 'DEFAULT · FREE USE',
      partnerBadge: 'FREE TIER',
    },
  ]

  const leaderboardRows = [
    { rank: '01', model: 'Llama 3.3', provider: 'Meta', ttft: '190ms', speed: '95 T/s', quality: '88', uptime: '99.9%', status: 'Ready' },
    { rank: '02', model: 'Qwen 2.5', provider: 'Alibaba', ttft: '220ms', speed: '92 T/s', quality: '84', uptime: '99.94%', status: 'Ready' },
    { rank: '03', model: 'Mistral Large', provider: 'Mistral', ttft: '280ms', speed: '78 T/s', quality: '86', uptime: '99.98%', status: 'Ready' },
    { rank: '04', model: 'DeepSeek R1', provider: 'DeepSeek', ttft: '340ms', speed: '70 T/s', quality: '91', uptime: '99.94%', status: 'Ready' },
    { rank: '05', model: 'Claude 3.5', provider: 'Anthropic', ttft: '410ms', speed: '112 T/s', quality: '94', uptime: '99.98%', status: 'Ready' },
    { rank: '06', model: 'GPT-4o', provider: 'OpenAI', ttft: '520ms', speed: '95 T/s', quality: '93', uptime: '97.80%', status: 'Degraded' },
    { rank: '07', model: 'Gemini 1.5', provider: 'Google', ttft: '560ms', speed: '102 T/s', quality: '90', uptime: '99.92%', status: 'Ready' },
    { rank: '08', model: 'Command R+', provider: 'Cohere', ttft: '630ms', speed: '148 T/s', quality: '85', uptime: '99.81%', status: 'Degraded' },
  ]

  const connectionIssues = [
    { model: 'Mistral 8x7B', provider: 'Mistral', status: 'Down', issue: 'Connections exhausted', success: '41.2%', latency: '12.4 s', time: '28 min ago' },
    { model: 'Llama 3.1 8B', provider: 'Ollama', status: 'Down', issue: 'Connection limit reached', success: '38.5%', latency: '-', time: '21 min ago' },
    { model: 'Command R+', provider: 'Cohere', status: 'Degraded', issue: 'Upstream timeouts', success: '92.1%', latency: '3.2 s', time: '14 min ago' },
    { model: 'GPT-4o', provider: 'OpenAI', status: 'Degraded', issue: 'Connection pool near limit', success: '96.8%', latency: '1.8 s', time: '6 min ago' },
    { model: 'Gemini 1.5 Pro', provider: 'Google', status: 'Degraded', issue: 'Elevated errors', success: '97.4%', latency: '1.1 s', time: '3 min ago' },
  ]

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProvider =
      selectedProvider === 'All' || m.provider.toLowerCase() === selectedProvider.toLowerCase()
    return matchesSearch && matchesProvider
  })

  return (
    <div className="min-h-screen w-full bg-[#060808] text-[#F5F5F2] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-[1240px] w-full mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Header Row */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#98A0A8]">
              {activeTab === 'ranking' ? '02 · MODEL RANKING' : '02 · MODEL LIST'}
            </span>
            <h1 className="text-4xl lg:text-5xl font-normal tracking-tight">
              {activeTab === 'ranking' ? (
                <>
                  Model <span className="font-serif italic font-normal">Ranking</span>
                </>
              ) : (
                <>
                  200+ Models. <span className="font-serif italic font-normal">One Endpoint.</span>
                </>
              )}
            </h1>
            <p className="text-xs text-[#98A0A8] max-w-lg">
              {activeTab === 'ranking'
                ? 'Rank every model by speed and cost, with a clear leaderboard of latency and uptime.'
                : 'Browse the directory, filter by category, partner, and provider, then invoke through one API.'}
            </p>
          </div>

          {/* Tab Switcher Capsule */}
          <div className="p-1 rounded-full bg-[#0A0C0E] border border-[#22272B] flex items-center">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'list'
                  ? 'bg-[#F5F5F2] text-[#060808] shadow-sm'
                  : 'text-[#98A0A8] hover:text-[#F5F5F2]'
              }`}
            >
              Model list
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'ranking'
                  ? 'bg-[#F5F5F2] text-[#060808] shadow-sm'
                  : 'text-[#98A0A8] hover:text-[#F5F5F2]'
              }`}
            >
              Ranking
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VIEW A: MODEL LIST VIEW                                  */}
        {/* ======================================================== */}
        {activeTab === 'list' && (
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#98A0A8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models or providers"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0A0C0E] border border-[#22272B] text-sm text-[#F5F5F2] placeholder-[#5A626A] focus:outline-none focus:border-[#333A40]"
              />
            </div>

            {/* Provider Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {providers.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedProvider(p)}
                  className={`py-1.5 px-3.5 rounded-full text-xs font-mono transition-all ${
                    selectedProvider === p
                      ? 'bg-[#F5F5F2] text-[#060808] font-semibold'
                      : 'bg-[#0A0C0E] border border-[#22272B] text-[#98A0A8] hover:text-[#F5F5F2] hover:border-[#333A40]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Dropdown Filters & Count */}
            <div className="flex items-center justify-between pt-2 text-xs text-[#98A0A8]">
              <div className="flex items-center gap-3">
                <button className="py-1 px-3 rounded-lg border border-[#22272B] bg-[#0A0C0E] flex items-center gap-2">
                  <span>Category: All</span> <ChevronDown className="w-3 h-3" />
                </button>
                <button className="py-1 px-3 rounded-lg border border-[#22272B] bg-[#0A0C0E] flex items-center gap-2">
                  <span>Partner: All</span> <ChevronDown className="w-3 h-3" />
                </button>
                <button className="py-1 px-3 rounded-lg border border-[#22272B] bg-[#0A0C0E] flex items-center gap-2">
                  <span>Endpoint: All</span> <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <span className="font-mono">{filteredModels.length} models</span>
            </div>

            {/* Models Cards Grid */}
            <div className="flex flex-col gap-3">
              {filteredModels.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#333A40] transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#121619] border border-[#22272B] flex items-center justify-center font-mono text-xs font-bold text-[#F5F5F2]">
                      {m.provider.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/models/${m.id}`}
                          className="font-medium text-[#F5F5F2] hover:text-[#00E599] transition-colors"
                        >
                          {m.name}
                        </Link>
                        <span className="text-[10px] font-mono text-[#98A0A8]">{m.provider}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161B1E] text-[#00E599] border border-[#00E599]/20">
                          {m.tier}
                        </span>
                        {m.partnerBadge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161B1E] text-[#98A0A8] border border-[#22272B]">
                            {m.partnerBadge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-xs font-mono">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#5A626A]">PER 1M TOKENS</span>
                      <span className="text-[#F5F5F2] font-semibold">{m.price}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#5A626A]">LATENCY</span>
                      <span className="text-[#00E599]">{m.latency}ms</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#5A626A]">THROUGHPUT</span>
                      <span className="text-[#F5F5F2]">{m.tps.toFixed(1)} t/s</span>
                    </div>

                    <Link
                      to={`/models/${m.id}`}
                      className="px-4 py-2 rounded-xl bg-[#121619] border border-[#22272B] hover:border-[#333A40] text-xs font-medium text-[#F5F5F2] hover:text-[#00E599] transition-all flex items-center gap-1.5"
                    >
                      Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <button className="px-6 py-2.5 rounded-full border border-[#22272B] bg-[#0A0C0E] hover:border-[#333A40] text-xs font-mono text-[#98A0A8] hover:text-[#F5F5F2] transition-colors">
                Show all 64 models
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW B: RANKING & RADAR VIEW                             */}
        {/* ======================================================== */}
        {activeTab === 'ranking' && (
          <div className="flex flex-col gap-8">
            {/* Top Models Hourly Chart Card */}
            <div className="rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-6 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#22272B]/60">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-[#121619] border border-[#22272B] flex items-center">
                    {(['today', 'week', 'month', 'year'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setRankingTimeframe(t)}
                        className={`px-3 py-1 rounded-full text-xs font-mono capitalize transition-all ${
                          rankingTimeframe === t
                            ? 'bg-[#1E2328] text-[#F5F5F2]'
                            : 'text-[#98A0A8] hover:text-[#F5F5F2]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-2xl font-mono font-bold text-[#F5F5F2]">32.9M</span>
                  <span className="text-[10px] font-mono text-[#98A0A8]">Tokens / 24h</span>
                </div>
              </div>

              {/* Stacked Chart Simulation */}
              <div className="h-44 w-full flex items-end justify-between gap-2 pt-4 px-2">
                {[45, 60, 85, 50, 40, 25, 30, 35, 55, 65, 45, 20, 25, 65, 30, 45, 35, 75, 40, 50].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-0.5 h-full group relative">
                    <div style={{ height: `${h * 0.35}%` }} className="w-full bg-[#00E599] rounded-t-xs" />
                    <div style={{ height: `${h * 0.25}%` }} className="w-full bg-[#38BDF8]" />
                    <div style={{ height: `${h * 0.25}%` }} className="w-full bg-[#A855F7]" />
                    <div style={{ height: `${h * 0.15}%` }} className="w-full bg-[#E0A458]" />
                  </div>
                ))}
              </div>
            </div>

            {/* LLM Ranking Board Pareto Plot */}
            <div className="rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-6 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#22272B]/60 text-xs font-mono">
                <span className="font-semibold text-[#F5F5F2]">LLM ranking board</span>
                <span className="text-[#98A0A8]">SAMPLE</span>
              </div>
              <p className="text-xs text-[#98A0A8]">Speed against cost. The dashed line is the efficient frontier.</p>

              <div className="h-48 w-full border border-[#22272B] rounded-xl bg-[#060808] relative p-4 flex items-center justify-between">
                <div className="absolute left-6 bottom-8 text-[11px] font-mono text-[#00E599] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00E599]" /> Qwen 2.5
                </div>
                <div className="absolute left-32 bottom-16 text-[11px] font-mono text-[#38BDF8] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> DeepSeek R1
                </div>
                <div className="absolute right-48 top-16 text-[11px] font-mono text-[#F5F5F2] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F5F5F2]" /> Claude 3.5
                </div>
                <div className="absolute right-12 top-8 text-[11px] font-mono text-[#E0A458] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E0A458]" /> Command R+
                </div>
                <div className="absolute inset-x-8 inset-y-12 border-b border-dashed border-[#333A40] pointer-events-none" />
              </div>
            </div>

            {/* Model Leaderboard Table */}
            <div className="rounded-2xl border border-[#22272B] bg-[#0A0C0E] overflow-hidden shadow-xl">
              <div className="p-4 border-b border-[#22272B] flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#F5F5F2]">Model leaderboard</span>
                <span className="font-mono text-[10px] text-[#98A0A8]">UPDATED · SAMPLE</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0E1215] text-[#98A0A8] border-b border-[#22272B]">
                    <tr>
                      <th className="py-2.5 px-4">#</th>
                      <th className="py-2.5 px-4">Model</th>
                      <th className="py-2.5 px-4">Provider</th>
                      <th className="py-2.5 px-4">TTFT ↓</th>
                      <th className="py-2.5 px-4">Speed</th>
                      <th className="py-2.5 px-4">Quality</th>
                      <th className="py-2.5 px-4">Uptime</th>
                      <th className="py-2.5 px-4">Fallback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161B1E]">
                    {leaderboardRows.map((row) => (
                      <tr key={row.rank} className="hover:bg-[#121619] transition-colors">
                        <td className="py-3 px-4 text-[#5A626A]">{row.rank}</td>
                        <td className="py-3 px-4 font-medium text-[#F5F5F2]">{row.model}</td>
                        <td className="py-3 px-4 text-[#98A0A8]">{row.provider}</td>
                        <td className="py-3 px-4 text-[#00E599]">{row.ttft}</td>
                        <td className="py-3 px-4 text-[#F5F5F2]">{row.speed}</td>
                        <td className="py-3 px-4 text-[#98A0A8]">{row.quality}</td>
                        <td className="py-3 px-4 text-[#00E599]">{row.uptime}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              row.status === 'Ready'
                                ? 'bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30'
                                : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Connection Issues Radar Table */}
            <div className="rounded-2xl border border-[#22272B] bg-[#0A0C0E] overflow-hidden shadow-xl">
              <div className="p-4 border-b border-[#22272B] flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#F5F5F2] block">
                    Connection issues
                  </span>
                  <span className="text-[11px] text-[#98A0A8]">
                    Models that ran out of connections or are reporting performance problems right now
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#EF4444]">5 AFFECTED · LIVE</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0E1215] text-[#98A0A8] border-b border-[#22272B]">
                    <tr>
                      <th className="py-2.5 px-4">Model</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Issue</th>
                      <th className="py-2.5 px-4">Success</th>
                      <th className="py-2.5 px-4">Latency</th>
                      <th className="py-2.5 px-4">Last 24h</th>
                      <th className="py-2.5 px-4">Since</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161B1E]">
                    {connectionIssues.map((issue) => (
                      <tr key={issue.model} className="hover:bg-[#121619] transition-colors">
                        <td className="py-3 px-4 font-medium text-[#F5F5F2]">{issue.model}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              issue.status === 'Down'
                                ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                                : 'bg-[#E0A458]/20 text-[#E0A458] border border-[#E0A458]/40'
                            }`}
                          >
                            {issue.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#98A0A8]">{issue.issue}</td>
                        <td className="py-3 px-4 text-[#EF4444]">{issue.success}</td>
                        <td className="py-3 px-4 text-[#98A0A8]">{issue.latency}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5, 6, 7].map((b) => (
                              <div
                                key={b}
                                className={`w-1.5 h-3 rounded-xs ${
                                  b > 4 ? 'bg-[#EF4444]' : 'bg-[#00E599]'
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#5A626A]">{issue.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
