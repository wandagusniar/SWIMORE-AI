import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'
import { Check, QrCode } from 'lucide-react'

export const PricingMatrix: React.FC = () => {
  const navigate = useNavigate()
  const [tokenVolumeM, setTokenVolumeM] = useState(50)
  const [qrisModalOpen, setQrisModalOpen] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Illustrative gross sales calculation ($4.24 per million average)
  const grossSales = Math.round(tokenVolumeM * 4.24)

  const handleSimulatePayment = async () => {
    try {
      const res = await fetch('/api/v1/billing/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: `SW-SUB-${Date.now()}`,
          gross_amount: 150000,
          payment_type: 'qris',
          transaction_status: 'settlement',
        }),
      })
      if (res.ok) {
        setPaymentSuccess(true)
        setTimeout(() => {
          setPaymentSuccess(false)
          setQrisModalOpen(false)
          navigate('/chat')
        }, 2000)
      }
    } catch {
      // fallback
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#060808] text-[#F5F5F2] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-[1240px] w-full mx-auto px-6 py-8 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-[#98A0A8]">
            04 · PRICING
          </span>
          <h1 className="text-4xl lg:text-5xl font-normal tracking-tight">
            Transparent <span className="font-serif italic font-normal">Pricing</span>
          </h1>
          <p className="text-xs text-[#98A0A8] max-w-lg">
            Start free. Upgrade for chat storage and shared models.
          </p>
        </div>

        {/* 3 Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Free */}
          <div className="rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-7 flex flex-col justify-between gap-8 shadow-xl">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[10px] uppercase text-[#00E599] tracking-wider">
                FOR USERS
              </span>
              <div>
                <h3 className="text-2xl font-bold text-[#F5F5F2]">Free</h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-4xl font-bold text-[#F5F5F2]">$0</span>
                  <span className="text-xs text-[#98A0A8]">/month</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs text-[#98A0A8] pt-4 border-t border-[#161B1E]">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>Default free-use models</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>One unified API key</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>Automatic failover</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>Community support</span>
                </div>
              </div>
            </div>

            <Link
              to="/chat"
              className="w-full py-3 rounded-full border border-[#22272B] hover:border-[#333A40] text-center text-xs font-semibold text-[#F5F5F2] hover:bg-[#121619] transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Card 2: Swimore Plus + Partner (Featured) */}
          <div className="rounded-2xl border border-[#00E599]/60 bg-[#0A0C0E] p-7 flex flex-col justify-between gap-8 shadow-[0_0_25px_rgba(0,229,153,0.12)] relative">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[10px] uppercase text-[#00E599] tracking-wider font-semibold">
                FOR USERS
              </span>
              <div>
                <h3 className="text-2xl font-bold text-[#F5F5F2]">Swimore Plus + Partner</h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-4xl font-bold text-[#F5F5F2]">$9</span>
                  <span className="text-xs text-[#98A0A8]">/month</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs text-[#98A0A8] pt-4 border-t border-[#161B1E]">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>Everything in Free</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>Chat storage in your account</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>Shared partner pool models</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>Per-chat Save / Private lock</span>
                </div>
              </div>

              {/* Exact Daily Quota Progress Meter */}
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#0E1215] border border-[#22272B] font-mono text-xs">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#98A0A8]">PARTNER POOL · 50 REQUESTS / DAY</span>
                  <span className="text-[#00E599] font-bold">32 / 50</span>
                </div>
                <div className="w-full bg-[#161B1E] h-2 rounded-full overflow-hidden">
                  <div style={{ width: '64%' }} className="h-full bg-[#00E599] rounded-full" />
                </div>
                <span className="text-[9px] text-[#5A626A] text-right">Resets daily at 00:00 WIB</span>
              </div>
            </div>

            <button
              onClick={() => setQrisModalOpen(true)}
              className="w-full py-3 rounded-full bg-[#F5F5F2] hover:bg-white text-center text-xs font-semibold text-[#060808] transition-all shadow-md active:scale-95"
            >
              Upgrade to Plus
            </button>
          </div>

          {/* Card 3: Partner */}
          <div className="rounded-2xl border border-[#22272B] bg-[#0A0C0E] p-7 flex flex-col justify-between gap-8 shadow-xl">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[10px] uppercase text-[#E0A458] tracking-wider">
                FOR PARTNERS
              </span>
              <div>
                <h3 className="text-2xl font-bold text-[#F5F5F2]">Partner</h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-3xl font-bold text-[#F5F5F2]">Own price</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs text-[#98A0A8] pt-4 border-t border-[#161B1E]">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>List your APIs at your own price</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>Verified partner profile</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>Analytics and buyer counts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00E599]" />
                  <span>Token management and payouts</span>
                </div>
              </div>

              {/* Exact Volume Slider */}
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#0E1215] border border-[#22272B] font-mono text-xs">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#98A0A8]">MONTHLY TOKEN VOLUME</span>
                  <span className="text-[#E0A458] font-bold">{tokenVolumeM}M / mo</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={tokenVolumeM}
                  onChange={(e) => setTokenVolumeM(Number(e.target.value))}
                  className="w-full accent-[#E0A458] cursor-pointer"
                />
                <span className="text-[10px] text-[#98A0A8] pt-1">
                  Illustrative gross sales: <strong className="text-[#F5F5F2]">${grossSales} / mo</strong>
                </span>
              </div>
            </div>

            <Link
              to="/marketplace"
              className="w-full py-3 rounded-full border border-[#22272B] hover:border-[#333A40] text-center text-xs font-semibold text-[#F5F5F2] hover:bg-[#121619] transition-all"
            >
              Open Marketplace →
            </Link>
          </div>
        </div>
      </main>

      {/* Midtrans / SeaBank QRIS Modal */}
      {qrisModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full rounded-2xl bg-[#0A0C0E] border border-[#22272B] p-6 flex flex-col items-center gap-5 shadow-2xl font-mono text-center">
            <div className="flex items-center justify-between w-full pb-3 border-b border-[#22272B]">
              <span className="text-xs font-semibold text-[#F5F5F2]">SEABANK QRIS PAYMENT</span>
              <button
                onClick={() => setQrisModalOpen(false)}
                className="text-[#98A0A8] hover:text-[#F5F5F2]"
              >
                ✕
              </button>
            </div>

            <div className="w-48 h-48 rounded-xl bg-white p-3 flex flex-col items-center justify-center">
              <QrCode className="w-40 h-40 text-black stroke-[1.5]" />
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <span className="text-[#98A0A8]">Swimore Plus Subscription:</span>
              <span className="text-lg font-bold text-[#F5F5F2]">IDR 150,000</span>
              <span className="text-[10px] text-[#00E599]">
                1.1% Platform Maintenance Fee deducted (IDR 1,650)
              </span>
            </div>

            {paymentSuccess ? (
              <div className="w-full py-2.5 rounded-xl bg-[#00E599]/20 text-[#00E599] text-xs font-semibold">
                ✓ Payment Verified! Plan Activated.
              </div>
            ) : (
              <button
                onClick={handleSimulatePayment}
                className="w-full py-2.5 rounded-full bg-[#00E599] hover:bg-[#00E599]/90 text-black font-semibold text-xs transition-all shadow-md"
              >
                Simulate QRIS Scan & Pay
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
