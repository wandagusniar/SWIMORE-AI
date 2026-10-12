import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Plus,
  Search,
  Lock,
  Cloud,
  ArrowUp,
  Check,
  ChevronDown,
  Power,
  SlidersHorizontal,
  Copy,
  AlertTriangle,
} from 'lucide-react'
import { useChatStore } from '@/store/chat-store'
import { useSessionStore } from '@/store/session-store'

export const ChatWorkspace: React.FC = () => {
  const location = useLocation()
  const {
    isPrivateMode,
    setIsPrivateMode,
    activeModel,
    setActiveModel,
    currentMessages,
    savedThreads,
    sendMessage,
    createNewChat,
    selectSession,
    purgePrivateChat,
    isStreaming,
  } = useChatStore()

  const { user } = useSessionStore()

  const [privacyDropdownOpen, setPrivacyDropdownOpen] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [inputText, setInputText] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [incidentReported, setIncidentReported] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const modelsList = [
    'Claude 3.5 Sonnet',
    'Llama 3.3 70B',
    'DeepSeek R1',
    'GPT-4o',
    'Gemini 1.5 Pro',
    'Qwen 2.5 72B',
  ]

  useEffect(() => {
    if (location.state?.privateMode !== undefined) {
      setIsPrivateMode(location.state.privateMode)
    }
    if (location.state?.model) {
      setActiveModel(location.state.model)
    }
    if (location.state?.initialPrompt) {
      sendMessage(location.state.initialPrompt)
    }
  }, [location.state])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages])

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim() || isStreaming) return
    sendMessage(inputText)
    setInputText('')
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleReportIncident = async () => {
    try {
      const res = await fetch('/api/v1/incidents/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: activeModel,
          partner_handle: '@novacompute',
          issue_type: 'modeldown',
          description: 'Triggered from chat interface',
          source: 'UI_MANUAL',
        }),
      })
      if (res.ok) {
        setIncidentReported(true)
        setTimeout(() => setIncidentReported(false), 5000)
      }
    } catch {
      // fallback
    }
  }

  const filteredThreads = savedThreads.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen w-screen bg-[#060808] text-[#F5F5F2] overflow-hidden font-sans">
      {/* ======================================================== */}
      {/* EXACT FIGMA LEFT SIDEBAR                                 */}
      {/* ======================================================== */}
      <aside className="w-[260px] h-full bg-[#0A0C0E] border-r border-[#22272B] flex flex-col justify-between p-3.5 flex-shrink-0 z-20">
        <div className="flex flex-col gap-3">
          {/* Top Brand & Collapse */}
          <div className="flex items-center justify-between pb-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md border border-[#333A40] flex items-center justify-center bg-[#060808]">
                <div className="w-2.5 h-2.5 rounded-[1px] border border-[#F5F5F2]" />
              </div>
              <span className="font-mono text-xs tracking-widest font-semibold text-[#F5F5F2] uppercase">
                SWIMORE AI
              </span>
            </Link>
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#98A0A8] hover:text-[#F5F5F2] cursor-pointer" />
          </div>

          {/* + New Chat Button */}
          <button
            onClick={() => createNewChat(isPrivateMode)}
            className="w-full py-2 px-3 rounded-xl border border-[#22272B] bg-[#121619] hover:bg-[#1A1F24] hover:border-[#333A40] text-xs font-medium text-[#F5F5F2] flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#F5F5F2]" /> + New chat
          </button>

          {/* Nav Links */}
          <div className="flex flex-col gap-0.5 text-xs text-[#98A0A8]">
            <Link
              to="/models"
              className="px-3 py-1.5 rounded-lg hover:bg-[#121619] hover:text-[#F5F5F2] transition-colors"
            >
              Models
            </Link>
            <Link
              to="/dashboard/keys"
              className="px-3 py-1.5 rounded-lg hover:bg-[#121619] hover:text-[#F5F5F2] transition-colors"
            >
              API
            </Link>
            <Link
              to="/docs"
              className="px-3 py-1.5 rounded-lg hover:bg-[#121619] hover:text-[#F5F5F2] transition-colors"
            >
              Docs
            </Link>
          </div>

          {/* Search Chats Input */}
          <div className="relative mt-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#98A0A8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0E1215] border border-[#22272B] text-xs text-[#F5F5F2] placeholder-[#5A626A] focus:outline-none focus:border-[#333A40]"
            />
          </div>

          {/* Thread List */}
          <div className="flex flex-col gap-3 mt-1 overflow-y-auto max-h-[calc(100vh-340px)]">
            {isPrivateMode ? (
              <>
                {/* NOT SAVED section */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono tracking-wider text-[#E0A458] uppercase px-2 font-medium flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> NOT SAVED
                  </span>
                  <div className="px-3 py-2 rounded-lg bg-[#1F170D] border border-[#E0A458]/40 text-xs text-[#F5F5F2] flex items-center justify-between">
                    <span className="truncate flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-[#E0A458]" /> Private chat
                    </span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#E0A458]/20 text-[#E0A458]">
                      new
                    </span>
                  </div>
                </div>

                {/* SAVED section */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono tracking-wider text-[#5A626A] uppercase px-2 font-medium">
                    SAVED
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="px-3 py-1.5 rounded-lg hover:bg-[#121619] text-xs text-[#98A0A8] hover:text-[#F5F5F2] flex items-center justify-between cursor-pointer">
                      <span className="truncate">Fallback routing question</span>
                      <span className="text-[10px] text-[#5A626A]">2h</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg hover:bg-[#121619] text-xs text-[#98A0A8] hover:text-[#F5F5F2] flex items-center justify-between cursor-pointer">
                      <span className="truncate">Compare Claude vs DeepSeek</span>
                      <span className="text-[10px] text-[#5A626A]">1d</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg hover:bg-[#121619] text-xs text-[#98A0A8] hover:text-[#F5F5F2] flex items-center justify-between cursor-pointer">
                      <span className="truncate">cURL for chat endpoint</span>
                      <span className="text-[10px] text-[#5A626A]">2d</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono tracking-wider text-[#5A626A] uppercase px-2 font-medium">
                    RECENT
                  </span>
                  <div className="px-3 py-2 rounded-lg bg-[#121619] border border-[#22272B] text-xs text-[#F5F5F2] flex items-center justify-between">
                    <span className="truncate">New chat</span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#00E599]/20 text-[#00E599]">
                      new
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="px-3 py-1.5 rounded-lg hover:bg-[#121619] text-xs text-[#98A0A8] hover:text-[#F5F5F2] flex items-center justify-between cursor-pointer">
                      <span className="truncate">Fallback routing question</span>
                      <span className="text-[10px] text-[#5A626A]">2h</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg hover:bg-[#121619] text-xs text-[#98A0A8] hover:text-[#F5F5F2] flex items-center justify-between cursor-pointer">
                      <span className="truncate">Compare Claude vs DeepSeek</span>
                      <span className="text-[10px] text-[#5A626A]">1d</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg hover:bg-[#121619] text-xs text-[#98A0A8] hover:text-[#F5F5F2] flex items-center justify-between cursor-pointer">
                      <span className="truncate">cURL for chat endpoint</span>
                      <span className="text-[10px] text-[#5A626A]">2d</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Profile */}
        <div className="pt-3 border-t border-[#22272B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-bold shadow-sm">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#F5F5F2]">Alex Doe</span>
              <span className="text-[9px] font-mono text-[#00E599]">SWIMORE PLUS+</span>
            </div>
          </div>
          <button
            onClick={() => purgePrivateChat()}
            className="text-[#98A0A8] hover:text-[#EF4444] transition-colors p-1"
            title="Purge session"
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* EXACT FIGMA MAIN VIEWPORT                                */}
      {/* ======================================================== */}
      <main className="flex-1 h-full flex flex-col justify-between overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="h-14 px-6 border-b border-[#22272B]/60 flex items-center justify-between flex-shrink-0 bg-[#060808]/90 backdrop-blur z-20">
          <div className="flex items-center gap-2 text-sm">
            {isPrivateMode ? (
              <span className="font-medium text-[#F5F5F2] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#E0A458]" /> Private chat
              </span>
            ) : (
              <span className="font-medium text-[#F5F5F2]">New chat</span>
            )}
          </div>

          {/* Privacy Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setPrivacyDropdownOpen(!privacyDropdownOpen)}
              className={`py-1.5 px-3 rounded-full text-xs font-medium flex items-center gap-2 transition-all ${
                isPrivateMode
                  ? 'border border-[#E0A458]/40 bg-[#1F170D] text-[#E0A458]'
                  : 'border border-[#22272B] bg-[#0A0C0E] text-[#F5F5F2] hover:border-[#333A40]'
              }`}
            >
              {isPrivateMode ? (
                <>
                  <Lock className="w-3.5 h-3.5" /> Private - not saved
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-[#00E599]" /> Saved to account
                </>
              )}
              <ChevronDown className="w-3 h-3 text-[#98A0A8]" />
            </button>

            {/* EXACT FIGMA PRIVACY DROPDOWN */}
            {privacyDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-[#0E1215] border border-[#22272B] p-4 shadow-2xl z-30 flex flex-col gap-3">
                <span className="text-[10px] font-mono tracking-wider text-[#98A0A8] uppercase">
                  THIS CHAT
                </span>

                {/* Option 1: Save to account */}
                <div
                  onClick={() => {
                    setIsPrivateMode(false)
                    setPrivacyDropdownOpen(false)
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    !isPrivateMode
                      ? 'border-[#00E599]/40 bg-[#00E599]/5'
                      : 'border-[#22272B] bg-[#121619] hover:border-[#333A40]'
                  }`}
                >
                  <div className="flex gap-2.5">
                    <Cloud className="w-4 h-4 text-[#00E599] flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[#F5F5F2]">Save to account</span>
                      <span className="text-[11px] text-[#98A0A8] leading-snug">
                        History is stored in your account and syncs across devices.
                      </span>
                    </div>
                  </div>
                  {!isPrivateMode && <Check className="w-4 h-4 text-[#00E599] flex-shrink-0" />}
                </div>

                {/* Option 2: Private */}
                <div
                  onClick={() => {
                    setIsPrivateMode(true)
                    setPrivacyDropdownOpen(false)
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    isPrivateMode
                      ? 'border-[#E0A458]/40 bg-[#E0A458]/5'
                      : 'border-[#22272B] bg-[#121619] hover:border-[#333A40]'
                  }`}
                >
                  <div className="flex gap-2.5">
                    <Lock className="w-4 h-4 text-[#E0A458] flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[#F5F5F2]">Private</span>
                      <span className="text-[11px] text-[#98A0A8] leading-snug">
                        Not saved. Zero-log: messages are discarded when you leave the chat.
                      </span>
                    </div>
                  </div>
                  {isPrivateMode && <Check className="w-4 h-4 text-[#E0A458] flex-shrink-0" />}
                </div>

                <span className="text-[10px] text-[#5A626A] text-center pt-1 border-t border-[#1E2328]">
                  Applies to this chat only. Change anytime.
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Private Mode Warning Banner */}
        {isPrivateMode && (
          <div className="bg-[#2A1D0B]/80 border-b border-[#E0A458]/40 px-6 py-2 flex items-center justify-between text-xs text-[#E0A458] z-10 flex-shrink-0">
            <span className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Private chat. Not saved to your account and nothing is logged.
            </span>
            <button
              onClick={() => setIsPrivateMode(false)}
              className="underline hover:text-white transition-colors cursor-pointer text-xs font-medium"
            >
              Save this chat
            </button>
          </div>
        )}

        {/* Incident Alert Notification if reported */}
        {incidentReported && (
          <div className="bg-[#00E599]/10 border-b border-[#00E599]/30 px-6 py-2 text-xs text-[#00E599] flex items-center justify-between z-10 flex-shrink-0">
            <span>Incident dispatched to Discord server ticket channel, Telegram bot & n8n webhook! Traffic failed over to Pro Pool.</span>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-start">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center my-auto">
              <h2 className="text-4xl lg:text-5xl font-serif text-[#F5F5F2] font-normal mb-3">
                What should we route today?
              </h2>
              <p className="text-sm text-[#98A0A8] max-w-md">
                Start a conversation. Swimore picks the fastest healthy model.
              </p>
            </div>
          ) : (
            <div className="max-w-[860px] w-full mx-auto flex flex-col gap-6">
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] rounded-2xl bg-[#121619] border border-[#22272B] px-5 py-3 text-sm text-[#F5F5F2] leading-relaxed shadow-sm">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="max-w-full flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] tracking-widest text-[#98A0A8] uppercase">
                          SWIMORE
                        </span>
                      </div>

                      <div className="text-sm text-[#F5F5F2] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>

                      {/* Routing Tracer Pill */}
                      {msg.routingTrace && (
                        <div className="flex items-center gap-3 pt-1">
                          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full border border-[#22272B] bg-[#0A0C0E] text-[11px] font-mono text-[#98A0A8]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
                            <span>
                              {msg.routingTrace.path} · {msg.routingTrace.model} · {msg.routingTrace.latencyMs} ms
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="text-[#98A0A8] hover:text-[#F5F5F2] p-1 transition-colors"
                            title="Copy message"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-[#00E599]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* EXACT FIGMA INPUT COMPONENT                              */}
        {/* ======================================================== */}
        <div className="w-full max-w-[860px] mx-auto px-6 pb-6 pt-2 flex flex-col items-center flex-shrink-0">
          <form
            onSubmit={handleSend}
            className={`w-full rounded-2xl bg-[#0A0C0E] border p-4 flex flex-col justify-between shadow-2xl transition-all ${
              isPrivateMode
                ? 'border-[#E0A458] shadow-[0_0_20px_rgba(224,164,88,0.15)]'
                : 'border-[#323940] focus-within:border-[#5A626A]'
            }`}
          >
            {/* Top row with + button and textarea */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={handleReportIncident}
                className="w-7 h-7 rounded-full bg-[#121619] border border-[#22272B] hover:border-[#333A40] flex items-center justify-center text-[#98A0A8] hover:text-[#F5F5F2] transition-colors mt-1"
                title="Report Downtime / Test Triage"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask Swimore anything..."
                rows={2}
                className="flex-1 bg-transparent border-0 resize-none text-[#F5F5F2] placeholder-[#5A626A] text-sm leading-relaxed focus:outline-none py-1"
              />
            </div>

            {/* Bottom row inside input card */}
            <div className="flex items-center justify-between pt-3 border-t border-[#161B1E] mt-2">
              {/* Left pills: Model Picker, Effort, Search, Research */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                    className="py-1 px-3 rounded-full bg-[#121619] border border-[#22272B] hover:border-[#333A40] text-xs font-mono text-[#F5F5F2] flex items-center gap-1.5 transition-all"
                  >
                    <span>{activeModel}</span>
                    <ChevronDown className="w-3 h-3 text-[#98A0A8]" />
                  </button>

                  {modelDropdownOpen && (
                    <div className="absolute left-0 bottom-full mb-2 w-56 rounded-xl bg-[#0E1215] border border-[#22272B] p-1.5 shadow-2xl z-30 flex flex-col gap-1">
                      {modelsList.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setActiveModel(m)
                            setModelDropdownOpen(false)
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                            activeModel === m
                              ? 'bg-[#1E2328] text-[#00E599] font-medium'
                              : 'text-[#98A0A8] hover:text-[#F5F5F2] hover:bg-[#161B1E]'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="py-1 px-2.5 rounded-full bg-[#121619] border border-[#22272B] hover:border-[#333A40] text-[11px] text-[#98A0A8] hover:text-[#F5F5F2] transition-colors"
                >
                  Effort
                </button>
                <button
                  type="button"
                  className="py-1 px-2.5 rounded-full bg-[#121619] border border-[#22272B] hover:border-[#333A40] text-[11px] text-[#98A0A8] hover:text-[#F5F5F2] transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  className="py-1 px-2.5 rounded-full bg-[#121619] border border-[#22272B] hover:border-[#333A40] text-[11px] text-[#98A0A8] hover:text-[#F5F5F2] transition-colors"
                >
                  Research
                </button>
              </div>

              {/* Right: Toggle Switch & Up Arrow */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className={isPrivateMode ? 'text-[#E0A458]' : 'text-[#98A0A8]'}>
                    {isPrivateMode ? 'Private' : 'Saved'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPrivateMode(!isPrivateMode)}
                    className={`w-8 h-4.5 rounded-full transition-colors p-0.5 flex items-center ${
                      isPrivateMode ? 'bg-[#E0A458]' : 'bg-[#00E599]'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                        isPrivateMode ? 'translate-x-3.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim() || isStreaming}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    inputText.trim() && !isStreaming
                      ? 'bg-[#F5F5F2] text-[#060808] hover:scale-105 active:scale-95 shadow-md'
                      : 'bg-[#1A1F24] text-[#5A626A] border border-[#22272B]'
                  }`}
                  aria-label="Send message"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </form>

          {/* Subtext below input */}
          <span className="text-[11px] text-[#5A626A] mt-2">
            {isPrivateMode
              ? 'Private chats are zero-log: nothing is stored once you leave.'
              : 'Saved chats are stored in your account. Switch to Private to keep a chat off the record.'}
          </span>
        </div>
      </main>
    </div>
  )
}
