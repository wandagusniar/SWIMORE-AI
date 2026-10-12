import React, { useState } from 'react'
import { Navbar } from '@/components/navigation/Navbar'
import { Search, ChevronDown, Check, X, ArrowRight } from 'lucide-react'

export const PartnerMarketplace: React.FC = () => {
  const [selectedPartners, setSelectedPartners] = useState<string[]>(['@novacompute', '@gridai'])
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [registerHandle, setRegisterHandle] = useState('')
  const [registerModel, setRegisterModel] = useState('Claude 3.5 Sonnet')
  const [registerType, setRegisterType] = useState('TYPE_B')
  const [registerSeaBank, setRegisterSeaBank] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const categories = [
    'All',
    '✓ Verified only',
    'Claude',
    'DeepSeek',
    'Llama',
    'Qwen',
    'Gemini',
    'Free tier',
  ]

  const partners = [
    {
      id: 'novacompute',
      handle: '@novacompute',
      initials: 'NC',
      model: 'Claude 3.5 Sonnet',
      verified: true,
      tags: ['Reasoning', '200K ctx'],
      inputPrice: '$2.70',
      outputPrice: '$13.50',
      inputNum: 2.70,
      latency: 410,
      uptime: '99.9%',
      uptimeNum: 99.9,
      usersBought: 1284,
    },
    {
      id: 'gridai',
      handle: '@gridai',
      initials: 'GR',
      model: 'Claude 3.5 Sonnet',
      verified: true,
      tags: ['Coding', '200K ctx'],
      inputPrice: '$2.85',
      outputPrice: '$14.20',
      inputNum: 2.85,
      latency: 380,
      uptime: '99.7%',
      uptimeNum: 99.7,
      usersBought: 962,
    },
    {
      id: 'llamaworks',
      handle: '@llamaworks',
      initials: 'LW',
      model: 'Llama 3.3 70B',
      verified: true,
      tags: ['Open Source', '128K ctx'],
      inputPrice: '$0.38',
      outputPrice: '$0.38',
      inputNum: 0.38,
      latency: 190,
      uptime: '99.9%',
      uptimeNum: 99.9,
      usersBought: 2310,
    },
    {
      id: 'tokenforge',
      handle: '@tokenforge',
      initials: 'TF',
      model: 'DeepSeek R1',
      verified: true,
      tags: ['Reasoning', '128K ctx'],
      inputPrice: '$0.52',
      outputPrice: '$2.05',
      inputNum: 0.52,
      latency: 340,
      uptime: '99.5%',
      uptimeNum: 99.5,
      usersBought: 1740,
    },
    {
      id: 'edgeinfer',
      handle: '@edgeinfer',
      initials: 'EI',
      model: 'Qwen 2.5 72B',
      verified: false,
      tags: ['Coding', '128K ctx'],
      inputPrice: '$0.30',
      outputPrice: '$0.36',
      inputNum: 0.30,
      latency: 260,
      uptime: '98.1%',
      uptimeNum: 98.1,
      usersBought: 86,
    },
    {
      id: 'aurahost',
      handle: '@aurahost',
      initials: 'AH',
      model: 'Mistral Large',
      verified: true,
      tags: ['Reasoning', '128K ctx'],
      inputPrice: '$1.90',
      outputPrice: '$5.80',
      inputNum: 1.90,
      latency: 280,
      uptime: '99.6%',
      uptimeNum: 99.6,
      usersBought: 540,
    },
  ]

  const toggleSelectPartner = (handle: string) => {
    if (selectedPartners.includes(handle)) {
      setSelectedPartners(selectedPartners.filter((p) => p !== handle))
    } else {
      setSelectedPartners([...selectedPartners, handle])
    }
  }

  const handleRegisterPartner = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/v1/partner/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: registerHandle,
          model: registerModel,
          endpoint_type: registerType,
          input_price_1m: 0.75,
          output_price_1m: 2.25,
          seabank_account: registerSeaBank,
        }),
      })
      if (res.ok) {
        setRegisterSuccess(true)
        setTimeout(() => {
          setRegisterSuccess(false)
          setRegisterModalOpen(false)
        }, 2000)
      }
    } catch {
      // error
    }
  }

  const comparedList = partners.filter((p) => selectedPartners.includes(p.handle))

  return (
    <div className="min-h-screen w-full bg-[#060808] text-[#F5F5F2] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-[1240px] w-full mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#98A0A8]">
              03 · PARTNER MARKETPLACE
            </span>
            <h1 className="text-4xl lg:text-5xl font-normal tracking-tight">
              Partner APIs. <span className="font-serif italic">Unique prices.</span>
            </h1>
            <p className="text-xs text-[#98A0A8] max-w-lg">
              Compare verified partners selling API access to the same models, each at their own price.
            </p>
          </div>

          <button
            onClick={() => setRegisterModalOpen(true)}
            className="px-6 py-3 rounded-full bg-[#F5F5F2] hover:bg-white text-[#060808] font-medium text-xs tracking-wide flex items-center gap-2 transition-all shadow-md self-start md:self-auto"
          >
            Join as Partner →
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-3 text-[#98A0A8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partner, model or provider..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#0A0C0E] border border-[#22272B] text-xs text-[#F5F5F2] placeholder-[#5A626A] focus:outline-none focus:border-[#333A40]"
              />
            </div>
            <button className="py-2.5 px-4 rounded-xl border border-[#22272B] bg-[#0A0C0E] text-xs font-mono text-[#98A0A8] flex items-center gap-2">
              <span>Sort: Most bought</span> <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-mono transition-all ${
                  filterCategory === c
                    ? 'bg-[#F5F5F2] text-[#060808] font-semibold'
                    : 'bg-[#0A0C0E] border border-[#22272B] text-[#98A0A8] hover:text-[#F5F5F2]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid and Comparison Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Partners Cards Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${comparedList.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            {partners.map((p) => {
              const isChecked = selectedPartners.includes(p.handle)
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between gap-5 transition-all bg-[#0A0C0E] ${
                    isChecked ? 'border-[#00E599]/60 shadow-[0_0_15px_rgba(0,229,153,0.1)]' : 'border-[#22272B] hover:border-[#333A40]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#121619] border border-[#22272B] flex items-center justify-center font-mono text-xs font-bold text-[#F5F5F2]">
                        {p.initials}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[#F5F5F2]">{p.handle}</span>
                          {p.verified && <span className="w-3 h-3 rounded-full bg-[#00E599] text-black text-[8px] flex items-center justify-center font-bold">✓</span>}
                        </div>
                        <span className="text-[11px] text-[#98A0A8]">{p.model}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSelectPartner(p.handle)}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-[#00E599] border-[#00E599] text-[#060808]'
                          : 'border-[#333A40] bg-[#121619] text-[#98A0A8] hover:border-[#F5F5F2]'
                      }`}
                      title="Compare endpoint"
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-xs">+</span>}
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[#121619] border border-[#22272B] text-[10px] font-mono text-[#98A0A8]">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Pricing & Latency Stats */}
                  <div className="grid grid-cols-2 gap-3 py-3 px-3.5 rounded-xl bg-[#0E1215] border border-[#22272B] text-xs font-mono">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#5A626A]">Input / 1M</span>
                      <span className="text-[#F5F5F2] font-semibold">{p.inputPrice}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#5A626A]">Output / 1M</span>
                      <span className="text-[#F5F5F2] font-semibold">{p.outputPrice}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#5A626A]">Latency</span>
                      <span className="text-[#00E599]">{p.latency}ms</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#5A626A]">Uptime</span>
                      <span className="text-[#00E599]">{p.uptime}</span>
                    </div>
                  </div>

                  {/* Bottom Adoption & CTAs */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-[#98A0A8]">
                      👥 {p.usersBought.toLocaleString()} users bought
                    </span>

                    <div className="flex items-center gap-2">
                      <button className="px-3.5 py-1.5 rounded-full bg-[#F5F5F2] hover:bg-white text-[#060808] font-medium text-xs shadow-sm">
                        Get access
                      </button>
                      <button className="px-3.5 py-1.5 rounded-full border border-[#22272B] hover:border-[#333A40] text-xs text-[#F5F5F2]">
                        Details →
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Comparison Drawer */}
          {comparedList.length > 0 && (
            <div className="lg:col-span-4 rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-5 flex flex-col gap-6 shadow-xl sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-[#22272B]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#F5F5F2]">
                    Compare ({comparedList.length})
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPartners([])}
                  className="text-[#98A0A8] hover:text-[#F5F5F2] text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                {comparedList.map((p, idx) => (
                  <div key={p.handle} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#00E599]' : 'bg-[#FFFFFF]'}`} />
                    <span className="text-[#F5F5F2]">{p.handle}</span>
                  </div>
                ))}
              </div>

              {/* Comparison Bars */}
              <div className="flex flex-col gap-4 font-mono text-xs">
                {/* Price Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[11px] text-[#98A0A8]">
                    <span>PRICE (LOWER IS BETTER)</span>
                  </div>
                  {comparedList.map((p, idx) => (
                    <div key={p.handle} className="flex items-center gap-2">
                      <div className="flex-1 bg-[#121619] h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, (p.inputNum / 3.0) * 100)}%` }}
                          className={`h-full ${idx === 0 ? 'bg-[#00E599]' : 'bg-[#FFFFFF]'}`}
                        />
                      </div>
                      <span className="text-[10px] w-10 text-right">{p.inputPrice}</span>
                    </div>
                  ))}
                </div>

                {/* Latency Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[11px] text-[#98A0A8]">
                    <span>LATENCY</span>
                  </div>
                  {comparedList.map((p, idx) => (
                    <div key={p.handle} className="flex items-center gap-2">
                      <div className="flex-1 bg-[#121619] h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, (p.latency / 600) * 100)}%` }}
                          className={`h-full ${idx === 0 ? 'bg-[#00E599]' : 'bg-[#FFFFFF]'}`}
                        />
                      </div>
                      <span className="text-[10px] w-10 text-right">{p.latency}ms</span>
                    </div>
                  ))}
                </div>

                {/* Uptime Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[11px] text-[#98A0A8]">
                    <span>UPTIME</span>
                  </div>
                  {comparedList.map((p, idx) => (
                    <div key={p.handle} className="flex items-center gap-2">
                      <div className="flex-1 bg-[#121619] h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${p.uptimeNum}%` }}
                          className={`h-full ${idx === 0 ? 'bg-[#00E599]' : 'bg-[#FFFFFF]'}`}
                        />
                      </div>
                      <span className="text-[10px] w-10 text-right">{p.uptime}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sell Card CTA */}
              <div className="p-4 rounded-xl bg-[#0E1215] border border-[#22272B] flex flex-col gap-3 mt-2">
                <span className="text-xs font-semibold text-[#F5F5F2]">Sell your API access</span>
                <span className="text-[11px] text-[#98A0A8] leading-relaxed">
                  Become a verified partner and list your models at your own price. 1.1% platform fee.
                </span>
                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="w-full py-2 rounded-full bg-[#F5F5F2] hover:bg-white text-[#060808] font-medium text-xs font-mono transition-all"
                >
                  Join as Partner →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Partner Registration Modal with SeaBank Account */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRegisterPartner}
            className="max-w-md w-full rounded-2xl bg-[#0A0C0E] border border-[#22272B] p-6 flex flex-col gap-4 shadow-2xl font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#22272B]">
              <span className="font-semibold text-[#F5F5F2]">REGISTER PARTNER ENDPOINT</span>
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="text-[#98A0A8] hover:text-[#F5F5F2]"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#98A0A8]">Partner Handle (e.g. @novacompute)</label>
              <input
                type="text"
                required
                value={registerHandle}
                onChange={(e) => setRegisterHandle(e.target.value)}
                placeholder="@mycompute"
                className="p-2.5 rounded-lg bg-[#0E1215] border border-[#22272B] text-[#F5F5F2] focus:outline-none focus:border-[#333A40]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#98A0A8]">Model Contributed</label>
              <input
                type="text"
                required
                value={registerModel}
                onChange={(e) => setRegisterModel(e.target.value)}
                className="p-2.5 rounded-lg bg-[#0E1215] border border-[#22272B] text-[#F5F5F2] focus:outline-none focus:border-[#333A40]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#98A0A8]">Endpoint Type</label>
              <select
                value={registerType}
                onChange={(e) => setRegisterType(e.target.value)}
                className="p-2.5 rounded-lg bg-[#0E1215] border border-[#22272B] text-[#F5F5F2] focus:outline-none focus:border-[#333A40]"
              >
                <option value="TYPE_A">Type A — Partner-Hosted Model</option>
                <option value="TYPE_B">Type B — Authorized 3rd-Party API</option>
                <option value="TYPE_C">Type C — Exclusive Contribution</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#98A0A8]">SeaBank Payout Account Number</label>
              <input
                type="text"
                required
                value={registerSeaBank}
                onChange={(e) => setRegisterSeaBank(e.target.value)}
                placeholder="9018281928"
                className="p-2.5 rounded-lg bg-[#0E1215] border border-[#22272B] text-[#F5F5F2] focus:outline-none focus:border-[#333A40]"
              />
              <span className="text-[10px] text-[#5A626A]">
                1.1% website maintenance fee deducted upon automated payout.
              </span>
            </div>

            {registerSuccess && (
              <div className="p-2.5 rounded bg-[#00E599]/10 text-[#00E599] text-center">
                Partner registered! Status: PENDING_REVIEW.
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#22272B] text-[#98A0A8]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#F5F5F2] text-[#060808] font-medium hover:bg-white"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
