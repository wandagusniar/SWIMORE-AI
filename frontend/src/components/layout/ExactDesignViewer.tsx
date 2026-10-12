import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface ExactDesignViewerProps {
  svgSrc: string
  title: string
  width?: number | string
  height?: number | string
  maxWidth?: string
}

export const ExactDesignViewer: React.FC<ExactDesignViewerProps> = ({
  svgSrc,
  title,
  maxWidth = '1440px',
}) => {
  const location = useLocation()

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Chat', path: '/chat' },
    { label: 'Models', path: '/models' },
    { label: 'Model Details', path: '/models/claude-3-5-sonnet' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Docs', path: '/docs' },
    { label: 'API Keys', path: '/dashboard/keys' },
  ]

  return (
    <div className="min-h-screen w-full bg-[#060808] text-[#F5F5F2] flex flex-col items-center">
      {/* Floating Navigator Bar strictly for jumping between the user's exact UI screens */}
      <header className="sticky top-0 z-50 w-full bg-[#0A0C0E]/90 backdrop-blur-md border-b border-[#22272B] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono uppercase tracking-wider text-[#00E599] font-bold">
            SWIMORE.AI
          </span>
          <span className="text-[#98A0A8]">·</span>
          <span className="text-[#98A0A8] font-mono">EXACT UI: {title}</span>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1E2328] text-[#00E599] border border-[#00E599]/30'
                    : 'text-[#98A0A8] hover:text-[#F5F5F2] hover:bg-[#121619]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Main Container rendering the EXACT vector SVG with 0 alterations */}
      <main className="w-full flex justify-center overflow-x-auto p-0 m-0">
        <div style={{ maxWidth }} className="w-full">
          <img
            src={svgSrc}
            alt={title}
            className="w-full h-auto block select-none pointer-events-auto"
            style={{ imageRendering: 'auto' }}
          />
        </div>
      </main>
    </div>
  )
}

