import React, { useState } from 'react'
import { Navbar } from '@/components/navigation/Navbar'
import { Plus, Search, ChevronDown, Copy, Check, RefreshCw } from 'lucide-react'

export const ApiKeysDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('day')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [latencyTest, setLatencyTest] = useState<number>(214)
  const [isPinging, setIsPinging] = useState(false)

  const [keysList, setKeysList] = useState([
    {
      id: 'k1',
      name: 'prod-backend',
      rawKey: 'sk-sw-prod-882910-49iq',
      masked: 'sk-sw-••••49iq',
      tokens: '1.28M',
      group: 'Swimore Plus',
      category: 'Verified',
      models: 'claude-3.5-sonnet +2',
      time: '9 days',
      latency: 214,
    },
    {
      id: 'k2',
      name: 'cursor-ide',
      rawKey: 'sk-sw-dev-441092-91az',
      masked: 'sk-sw-••••91az',
      tokens: '412K',
      group: 'Swimore Plus',
      category: 'Verified',
      models: 'llama-3.3-70b',
      time: '2 days',
      latency: 188,
    },
  ])

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/v1/user/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer swimore-session-jwt-alex-doe',
        },
        body: JSON.stringify({ name: keyName }),
      })
      const json = await res.json()
      if (json.secret_key) {
        setNewKey(json.secret_key)
        setKeysList([
          {
            id: json.id,
            name: json.name,
            rawKey: json.secret_key,
            masked: json.key_prefix,
            tokens: '0',
            group: 'Swimore Plus',
            category: 'Verified',
            models: 'All approved models',
            time: 'Just now',
            latency: 195,
          },
          ...keysList,
        ])
      }
    } catch {
      // fallback
    }
  }

  const handleCopy = (keyText: string, id: string) => {
    navigator.clipboard.writeText(keyText)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handlePingTest = async () => {
    setIsPinging(true)
    const start = performance.now()
    try {
      await fetch('/health')
      const diff = Math.round(performance.now() - start)
      setLatencyTest(diff || 18)
    } catch {
      setLatencyTest(210)
    } finally {
      setIsPinging(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#060808] text-[#F5F5F2] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-[1240px] w-full mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#98A0A8]">
              05 · DEVELOPERS
            </span>
            <h1 className="text-4xl lg:text-5xl font-normal tracking-tight">
              API <span className="font-serif italic font-normal">Keys</span>
            </h1>
            <p className="text-xs text-[#98A0A8] max-w-lg">
              Track usage, manage keys and test every connection.
            </p>
          </div>

          <button
            onClick={() => {
              setNewKey(null)
              setKeyName('')
              setCreateModalOpen(true)
            }}
            className="px-6 py-3 rounded-full bg-[#F5F5F2] hover:bg-white text-[#060808] font-medium text-xs font-mono tracking-wide flex items-center gap-2 transition-all shadow-md self-start md:self-auto active:scale-95"
          >
            + Create API Key
          </button>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <span className="text-[10px] text-[#5A626A] uppercase tracking-wider">
            USAGE OVERVIEW
          </span>

          <div className="flex items-center gap-3">
            <div className="p-1 rounded-full bg-[#0A0C0E] border border-[#22272B] flex items-center">
              {(['day', 'week', 'month', 'year'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-full text-xs font-mono capitalize transition-all ${
                    timeframe === t
                      ? 'bg-[#1E2328] text-[#F5F5F2]'
                      : 'text-[#98A0A8] hover:text-[#F5F5F2]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button className="py-1.5 px-3 rounded-xl border border-[#22272B] bg-[#0A0C0E] text-[#98A0A8] flex items-center gap-2">
              <span>Oct 10 – Oct 11, 2026</span> <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 6 Metric Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-4 rounded-xl border border-[#22272B] bg-[#0A0C0E] flex flex-col gap-1">
            <span className="text-[10px] text-[#5A626A]">TOTAL TOKENS</span>
            <span className="text-xl font-bold text-[#F5F5F2]">1.78M</span>
            <span className="text-[10px] text-[#00E599]">↑ 12% vs yesterday</span>
          </div>

          <div className="p-4 rounded-xl border border-[#22272B] bg-[#0A0C0E] flex flex-col gap-1">
            <span className="text-[10px] text-[#5A626A]">TOTAL REQUESTS</span>
            <span className="text-xl font-bold text-[#F5F5F2]">2,846</span>
            <span className="text-[10px] text-[#00E599]">↑ 8% vs yesterday</span>
          </div>

          <div className="p-4 rounded-xl border border-[#22272B] bg-[#0A0C0E] flex flex-col gap-1">
            <span className="text-[10px] text-[#5A626A]">FAILED REQUESTS</span>
            <span className="text-xl font-bold text-[#F5F5F2]">37</span>
            <span className="text-[10px] text-[#EF4444]">1.3% failure rate</span>
          </div>

          <div className="p-4 rounded-xl border border-[#22272B] bg-[#0A0C0E] flex flex-col gap-1">
            <span className="text-[10px] text-[#5A626A]">FREE QUOTA LEFT</span>
            <span className="text-xl font-bold text-[#F5F5F2]">18 / 50</span>
            <span className="text-[10px] text-[#38BDF8]">Resets in 05:12:40</span>
          </div>

          <div className="p-4 rounded-xl border border-[#22272B] bg-[#0A0C0E] flex flex-col gap-1">
            <span className="text-[10px] text-[#5A626A]">AVG TPM</span>
            <span className="text-xl font-bold text-[#F5F5F2]">1,240</span>
            <span className="text-[10px] text-[#98A0A8]">tokens / minute</span>
          </div>

          <div className="p-4 rounded-xl border border-[#22272B] bg-[#0A0C0E] flex flex-col gap-1">
            <span className="text-[10px] text-[#5A626A]">AVG RPM</span>
            <span className="text-xl font-bold text-[#F5F5F2]">11.9</span>
            <span className="text-[10px] text-[#98A0A8]">requests / minute</span>
          </div>
        </div>

        {/* Stacked Chart & Notifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Stacked Chart Card */}
          <div className="lg:col-span-8 rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-6 flex flex-col justify-between gap-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#22272B]/60 text-xs font-mono">
              <span className="text-[#98A0A8]">TOKENS PER HOUR · K</span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-[#00E599]"><span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" /> claude-3.5-sonnet</span>
                <span className="flex items-center gap-1 text-[#38BDF8]"><span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" /> gpt-4o</span>
                <span className="flex items-center gap-1 text-[#A855F7]"><span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" /> gemini-1.5-pro</span>
                <span className="flex items-center gap-1 text-[#E0A458]"><span className="w-1.5 h-1.5 rounded-full bg-[#E0A458]" /> llama-3.1-70b</span>
              </div>
            </div>

            <div className="h-44 w-full flex items-end justify-between gap-2 pt-2 px-2">
              {[60, 85, 55, 45, 20, 30, 40, 25, 65, 30, 45, 20].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end gap-0.5 h-full">
                  <div style={{ height: `${val * 0.35}%` }} className="w-full bg-[#00E599] rounded-t-xs" />
                  <div style={{ height: `${val * 0.3}%` }} className="w-full bg-[#38BDF8]" />
                  <div style={{ height: `${val * 0.2}%` }} className="w-full bg-[#A855F7]" />
                  <div style={{ height: `${val * 0.15}%` }} className="w-full bg-[#E0A458]" />
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#5A626A] pt-2 border-t border-[#161B1E]">
              <span>11:00</span>
              <span>14:00</span>
              <span>17:00</span>
              <span>20:00</span>
              <span>23:00</span>
              <span>02:00</span>
              <span>05:00</span>
              <span>08:00</span>
            </div>
          </div>

          {/* Notifications Feed */}
          <div className="lg:col-span-4 rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-6 flex flex-col justify-between gap-4 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#22272B]/60">
              <span className="text-[#98A0A8]">NOTIFICATIONS</span>
              <span className="text-[10px] text-[#00E599] cursor-pointer">View all</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#E0A458] mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <div className="flex justify-between text-[10px] text-[#98A0A8]">
                    <span>SWIMORE</span>
                    <span>2h ago</span>
                  </div>
                  <span className="text-[11px] text-[#F5F5F2]">Scheduled maintenance Oct 12, 02:00 UTC</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <div className="flex justify-between text-[10px] text-[#98A0A8]">
                    <span>ANTHROPIC</span>
                    <span>5h ago</span>
                  </div>
                  <span className="text-[11px] text-[#F5F5F2]">Elevated latency on claude-3.5-sonnet</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#00E599] mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <div className="flex justify-between text-[10px] text-[#98A0A8]">
                    <span>@novacompute</span>
                    <span>1d ago</span>
                  </div>
                  <span className="text-[11px] text-[#F5F5F2]">Price update: gpt-4o input -10%</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#98A0A8] mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <div className="flex justify-between text-[10px] text-[#98A0A8]">
                    <span>SWIMORE</span>
                    <span>3d ago</span>
                  </div>
                  <span className="text-[11px] text-[#F5F5F2]">New: per-key usage alerts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Keys Table */}
        <div className="rounded-2xl border border-[#22272B] bg-[#0A0C0E] overflow-hidden shadow-xl flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs text-[#5A626A] uppercase">YOUR KEYS</span>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#98A0A8]" />
                  <input
                    type="text"
                    placeholder="Filter by name..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0E1215] border border-[#22272B] text-xs text-[#F5F5F2] placeholder-[#5A626A]"
                  />
                </div>
                <button className="py-1.5 px-3 rounded-lg border border-[#22272B] bg-[#0E1215] text-[#98A0A8] flex items-center gap-2">
                  <span>All status</span> <ChevronDown className="w-3 h-3" />
                </button>
                <button className="py-1.5 px-3 rounded-lg border border-[#22272B] bg-[#0E1215] text-[#98A0A8] flex items-center gap-2">
                  <span>All categories</span> <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              <span className="text-[#98A0A8]">{keysList.length} keys</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0E1215] text-[#98A0A8] border-b border-[#22272B]">
                <tr>
                  <th className="py-2.5 px-4">NAME</th>
                  <th className="py-2.5 px-4">API KEY</th>
                  <th className="py-2.5 px-4">TOKENS</th>
                  <th className="py-2.5 px-4">GROUP</th>
                  <th className="py-2.5 px-4">CATEGORY</th>
                  <th className="py-2.5 px-4">MODELS</th>
                  <th className="py-2.5 px-4">TIME</th>
                  <th className="py-2.5 px-4">TEST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161B1E]">
                {keysList.map((k) => (
                  <tr key={k.id} className="hover:bg-[#121619] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#F5F5F2]">{k.name}</td>
                    <td className="py-3 px-4 text-[#98A0A8]">
                      <div className="flex items-center gap-2">
                        <span>{k.masked}</span>
                        <button
                          onClick={() => handleCopy(k.rawKey, k.id)}
                          className="text-[#98A0A8] hover:text-[#00E599]"
                        >
                          {copiedKey === k.id ? <Check className="w-3 h-3 text-[#00E599]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#F5F5F2]">{k.tokens}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#161B1E] border border-[#22272B] text-[10px] text-[#00E599]">
                        {k.group}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#00E599]">✓ {k.category}</td>
                    <td className="py-3 px-4 text-[#98A0A8]">{k.models}</td>
                    <td className="py-3 px-4 text-[#5A626A]">{k.time}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={handlePingTest}
                        disabled={isPinging}
                        className="px-2.5 py-1 rounded-full bg-[#121619] border border-[#22272B] hover:border-[#333A40] text-[11px] text-[#00E599] flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Ping Gateway"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
                        <span>{latencyTest} ms</span>
                        <RefreshCw className={`w-3 h-3 text-[#98A0A8] ${isPinging ? 'animate-spin' : ''}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Key Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <form
            onSubmit={handleCreateKey}
            className="max-w-md w-full rounded-2xl bg-[#0A0C0E] border border-[#22272B] p-6 flex flex-col gap-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#22272B]">
              <span className="font-semibold text-[#F5F5F2]">CREATE NEW API KEY</span>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-[#98A0A8] hover:text-[#F5F5F2]"
              >
                ✕
              </button>
            </div>

            {newKey ? (
              <div className="flex flex-col gap-3 py-2">
                <span className="text-[#00E599]">Key generated successfully! Copy it now:</span>
                <div className="p-3 rounded-xl bg-[#0E1215] border border-[#00E599]/40 flex items-center justify-between text-[#F5F5F2]">
                  <span className="truncate pr-2">{newKey}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(newKey, 'modal')}
                    className="p-1 hover:text-[#00E599]"
                  >
                    {copiedKey === 'modal' ? <Check className="w-4 h-4 text-[#00E599]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="w-full mt-2 py-2.5 rounded-full bg-[#F5F5F2] text-[#060808] font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#98A0A8]">Key Name</label>
                  <input
                    type="text"
                    required
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="e.g. Production Ingress Gateway"
                    className="p-2.5 rounded-lg bg-[#0E1215] border border-[#22272B] text-[#F5F5F2] focus:outline-none focus:border-[#333A40]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#22272B] text-[#98A0A8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#F5F5F2] text-[#060808] font-medium hover:bg-white"
                  >
                    Generate Key
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
