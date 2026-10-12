import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSessionStore } from '@/store/session-store'

interface NavbarProps {
  onSignInClick?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onSignInClick }) => {
  const location = useLocation()
  const currentPath = location.pathname
  const { user } = useSessionStore()

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Models', path: '/models' },
    { label: 'Marketplace Partner', path: '/marketplace' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Docs', path: '/docs' },
  ]

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true
    if (path !== '/' && currentPath.startsWith(path)) return true
    return false
  }

  return (
    <div className="w-full pt-6 pb-2 px-6 flex justify-center sticky top-0 z-50 pointer-events-none">
      <header className="w-[1240px] max-w-full px-6 py-2.5 rounded-full border border-[#22272B] bg-[#0A0C0E]/90 backdrop-blur-md flex items-center justify-between shadow-2xl pointer-events-auto transition-all">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-5 h-5 rounded-md border border-[#333A40] flex items-center justify-center bg-[#060808] group-hover:border-[#00E599] transition-colors">
            <div className="w-2.5 h-2.5 rounded-[1px] border border-[#F5F5F2] group-hover:border-[#00E599]" />
          </div>
          <span className="font-mono text-xs tracking-widest font-semibold text-[#F5F5F2] uppercase">
            SWIMORE AI
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-8 text-xs font-normal">
          {navLinks.map((link) => {
            const active = isActive(link.path)
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 tracking-wide transition-colors ${
                  active ? 'text-[#F5F5F2] font-medium' : 'text-[#98A0A8] hover:text-[#F5F5F2]'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F5F5F2]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: Auth & CTA */}
        <div className="flex items-center gap-4 text-xs">
          {user ? (
            <Link
              to="/dashboard/keys"
              className="text-[#98A0A8] hover:text-[#F5F5F2] transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
              {user.name}
            </Link>
          ) : (
            <button
              onClick={onSignInClick}
              className="text-[#98A0A8] hover:text-[#F5F5F2] transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          <Link
            to="/chat"
            className="px-5 py-2 rounded-full bg-[#F5F5F2] hover:bg-white text-[#060808] font-medium transition-all shadow-sm active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </header>
    </div>
  )
}
