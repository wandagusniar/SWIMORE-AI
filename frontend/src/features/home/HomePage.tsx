import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'
import { ArrowUp, Play, Plus, ChevronDown } from 'lucide-react'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('swimore/auto-fast')
  const [saveChat, setSaveChat] = useState(true)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  const availableModels = [
    { id: 'swimore/auto-fast', name: 'swimore/auto-fast (Sub-second fallback)' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet (Anthropic)' },
    { id: 'llama-3-3-70b', name: 'Llama 3.3 70B (@novacompute)' },
    { id: 'deepseek-r1', name: 'DeepSeek R1 (@tokenforge)' },
    { id: 'gpt-4o', name: 'GPT-4o (Direct Provider)' },
  ]

  const handleSendPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!prompt.trim()) return
    navigate('/chat', {
      state: {
        initialPrompt: prompt,
        model: selectedModel,
        privateMode: !saveChat,
      },
    })
  }

  const promptSuggestions = [
    'Compare latency across models',
    'Migrate from OpenAI in one line',
    'Estimate my savings',
  ]

  return (
    <div className="min-h-screen w-full bg-[#060808] text-[#F5F5F2] flex flex-col font-sans selection:bg-[#00E599]/20 selection:text-[#00E599]">
      {/* Exact Floating Navbar */}
      <Navbar />

      <main className="w-full flex-1 flex flex-col items-center px-6">
        {/* UPPER SECTION: Playground Hero */}
        <section className="w-full max-w-[820px] flex flex-col items-center pt-8 pb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00E599]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#98A0A8]">
              PLAYGROUND · ASK ANYTHING
            </span>
          </div>

          {/* Interactive Prompt Card */}
          <form
            onSubmit={handleSendPrompt}
            className="w-full rounded-2xl bg-[#0A0C0E] border border-[#22272B] p-5 flex flex-col justify-between shadow-2xl relative transition-all focus-within:border-[#333A40]"
          >
            {/* Card Top Row */}
            <div className="flex items-center justify-between pb-3">
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="w-7 h-7 rounded-full bg-[#121619] border border-[#22272B] hover:border-[#333A40] flex items-center justify-center text-[#98A0A8] hover:text-[#F5F5F2] transition-colors"
                title="Clear input"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#98A0A8]">Save chat history</span>
                <button
                  type="button"
                  onClick={() => setSaveChat(!saveChat)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    saveChat ? 'bg-[#00E599]' : 'bg-[#22272B]'
                  }`}
                  aria-label="Toggle chat history"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      saveChat ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <Link
                  to="/chat"
                  className="text-[#98A0A8] hover:text-[#F5F5F2] transition-colors ml-1"
                >
                  Sign in to chat
                </Link>
              </div>
            </div>

            {/* Input Textarea */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendPrompt()
                }
              }}
              placeholder="Try Swimore — ask anything..."
              rows={3}
              className="w-full bg-transparent border-0 resize-none text-[#F5F5F2] placeholder-[#5A626A] text-sm leading-relaxed focus:outline-none py-2"
            />

            {/* Card Bottom Row */}
            <div className="flex items-center justify-between pt-2 border-t border-[#161B1E]">
              {/* Model Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  className="py-1.5 px-3 rounded-full bg-[#121619] border border-[#22272B] hover:border-[#333A40] text-xs font-mono text-[#F5F5F2] flex items-center gap-1.5 transition-all"
                >
                  <span>{selectedModel}</span>
                  <ChevronDown className="w-3 h-3 text-[#98A0A8]" />
                </button>

                {modelDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl bg-[#0E1215] border border-[#22272B] p-1.5 shadow-2xl z-30 flex flex-col gap-1">
                    {availableModels.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedModel(m.id)
                          setModelDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          selectedModel === m.id
                            ? 'bg-[#1E2328] text-[#00E599] font-medium'
                            : 'text-[#98A0A8] hover:text-[#F5F5F2] hover:bg-[#161B1E]'
                        }`}
                      >
                        <span className="truncate">{m.name}</span>
                        {selectedModel === m.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!prompt.trim()}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  prompt.trim()
                    ? 'bg-[#F5F5F2] text-[#060808] hover:scale-105 active:scale-95 shadow-md'
                    : 'bg-[#1A1F24] text-[#5A626A] border border-[#22272B]'
                }`}
                aria-label="Send prompt to chat"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Suggestion Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {promptSuggestions.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => {
                  setPrompt(text)
                }}
                className="py-1.5 px-4 rounded-full bg-[#0A0C0E] border border-[#22272B] hover:border-[#333A40] text-xs text-[#98A0A8] hover:text-[#F5F5F2] transition-all hover:bg-[#121619]"
              >
                {text}
              </button>
            ))}
          </div>
        </section>

        {/* LOWER SECTION: Headline + Live Routing Diagram */}
        <section className="w-full max-w-[1240px] pt-12 pb-24 border-t border-[#22272B]/40">
          {/* Top Right Mini Tags */}
          <div className="flex justify-end mb-6 font-mono text-[11px] text-[#98A0A8] tracking-widest leading-loose text-right">
            <div>
              LOW LATENCY<br />
              SMART FALLBACKS<br />
              ZERO-LOG PRIVACY
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Heading & Subtitle */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E599]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#98A0A8]">
                  MULTI-PROVIDER AI CHAT · API GATEWAY · API MARKETPLACE
                </span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight">
                Intelligence,<br />
                <span className="font-serif italic font-normal text-[#F5F5F2]">
                  Routed Seamlessly.
                </span>
              </h1>

              <p className="text-base text-[#98A0A8] max-w-lg leading-relaxed">
                Access 200+ LLMs through a single unified API. Intelligent fallback, cost-optimized routing, zero-downtime execution.
              </p>

              <div className="flex items-center gap-4 pt-3">
                <Link
                  to="/models"
                  className="px-6 py-3 rounded-full bg-[#F5F5F2] hover:bg-white text-[#060808] font-medium text-xs tracking-wide flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  Explore Models →
                </Link>
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="px-6 py-3 rounded-full border border-[#22272B] hover:border-[#333A40] text-[#F5F5F2] font-medium text-xs tracking-wide flex items-center gap-2 transition-all hover:bg-[#0A0C0E] active:scale-95"
                >
                  <Play className="w-3 h-3 fill-[#F5F5F2]" /> Watch Demo
                </button>
              </div>
            </div>

            {/* Right Column: Exact Live Routing Diagram */}
            <div className="lg:col-span-6 rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-6 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#22272B]/60 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#00E599]">
                  <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
                  <span>LIVE ROUTING TRACE</span>
                </div>
                <span className="text-[#98A0A8]">SAMPLE</span>
              </div>

              {/* Diagram Flow */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                {/* Input & Policy Box */}
                <div className="md:col-span-4 flex flex-col gap-3">
                  <div className="p-3 rounded-xl border border-[#22272B] bg-[#0E1215]">
                    <span className="font-mono text-[10px] text-[#98A0A8] uppercase block mb-1">INPUT</span>
                    <span className="font-medium text-[#F5F5F2]">User Request</span>
                  </div>

                  <div className="p-3 rounded-xl border border-[#22272B] bg-[#0E1215]">
                    <span className="font-mono text-[10px] text-[#98A0A8] uppercase block mb-1">POLICY</span>
                    <span className="font-medium text-[#F5F5F2] block">SWIMORE Router</span>
                    <span className="text-[11px] text-[#98A0A8]">latency · price</span>
                  </div>
                </div>

                {/* Path A & Path B */}
                <div className="md:col-span-8 flex flex-col gap-3">
                  {/* Path A */}
                  <div className="p-3.5 rounded-xl border border-[#22272B] bg-[#0E1215]/80 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#00E599]">
                      <span>PATH A · DIRECT PROVIDERS</span>
                      <span className="text-[#98A0A8]">Response 200 OK</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                      <div className="p-1.5 rounded bg-[#121619] border border-[#22272B] flex justify-between">
                        <span className="text-[#98A0A8]">OpenAI</span>
                        <span className="text-[#F5F5F2]">32ms</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#121619] border border-[#22272B] flex justify-between">
                        <span className="text-[#98A0A8]">Anthropic</span>
                        <span className="text-[#F5F5F2]">31ms</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#121619] border border-[#00E599]/40 flex justify-between text-[#00E599]">
                        <span>DeepSeek</span>
                        <span>28ms</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#121619] border border-[#22272B] flex justify-between">
                        <span className="text-[#98A0A8]">ZAI</span>
                        <span className="text-[#F5F5F2]">34ms</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#121619] border border-[#22272B] flex justify-between">
                        <span className="text-[#98A0A8]">GLM</span>
                        <span className="text-[#F5F5F2]">36ms</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#121619] border border-[#22272B] flex justify-between text-[#98A0A8]">
                        <span>Other...</span>
                        <span>-</span>
                      </div>
                    </div>
                  </div>

                  {/* Path B */}
                  <div className="p-3.5 rounded-xl border border-[#22272B] bg-[#0E1215]/80 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#E0A458]">
                      <span>PATH B · PARTNERS · UNIQUE PRICE</span>
                      <span className="text-[#98A0A8]">Response 200 OK</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-[#121619] border border-[#22272B] flex flex-col gap-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-[#E0A458]">Partner A</span>
                          <span className="text-[#98A0A8]">$0.38/M</span>
                        </div>
                        <span className="font-medium text-[#F5F5F2]">Llama 3.3 70B</span>
                      </div>

                      <div className="p-2 rounded bg-[#121619] border border-[#22272B] flex flex-col gap-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-[#E0A458]">Partner B</span>
                          <span className="text-[#98A0A8]">$0.52/M</span>
                        </div>
                        <span className="font-medium text-[#F5F5F2]">Qwen 2.5 72B</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Demo Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl bg-[#0A0C0E] border border-[#22272B] p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#22272B]">
              <span className="font-mono text-sm font-semibold text-[#F5F5F2]">
                SWIMORE AI · ARCHITECTURE OVERVIEW
              </span>
              <button
                onClick={() => setDemoModalOpen(false)}
                className="text-[#98A0A8] hover:text-[#F5F5F2] text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#98A0A8] leading-relaxed">
              Swimore routes incoming AI inference requests dynamically across direct upstream LLMs (Path A) and verified partner endpoints (Path B) with automatic failover, SeaBank settlement, and strict zero-log metadata audit logging.
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setDemoModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#22272B] text-xs text-[#98A0A8] hover:text-[#F5F5F2]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDemoModalOpen(false)
                  navigate('/chat')
                }}
                className="px-4 py-2 rounded-full bg-[#F5F5F2] text-[#060808] text-xs font-medium hover:bg-white"
              >
                Launch Chat Workspace →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
