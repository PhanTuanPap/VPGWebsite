'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin', label: 'Dashboard', key: 'dashboard' },
    { href: '/admin/cars', label: 'Quản lý xe', key: 'cars' },
    { href: '/admin/test-drives', label: 'Lái thử', key: 'test-drives' },
    { href: '/admin/price-quotes', label: 'Báo giá', key: 'price-quotes' },
    { href: '/admin/customers', label: 'Khách hàng', key: 'customers' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-luxury-charcoal text-white z-50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">VPG <span className="text-luxury-gold">Admin</span></h1>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white" aria-label="Toggle menu">
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)} />}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-16 left-0 bottom-0 w-56 bg-luxury-charcoal text-white z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="py-6">
          {menuItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors ${isActive(item.href) ? 'bg-white/5 border-l-4 border-luxury-gold' : ''}`}>
              <span className="w-5 h-5 text-gray-300">
                {item.key === 'dashboard' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                )}
                {item.key === 'cars' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path d="M3 13l1.5-4.5h15L21 13" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="7.5" cy="17.5" r="1.5" />
                    <circle cx="18.5" cy="17.5" r="1.5" />
                  </svg>
                )}
                {item.key === 'test-drives' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path d="M5 12h14" strokeLinecap="round" />
                    <path d="M12 5v14" strokeLinecap="round" />
                  </svg>
                )}
                {item.key === 'price-quotes' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path d="M12 1v22" strokeLinecap="round" />
                    <path d="M17 5H7v14h10V5z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {item.key === 'customers' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                    <path d="M3 21a9 9 0 0118 0" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-sm">{item.label}</span>
            </a>
          ))}

          <div className="border-t border-white/10 mt-4 pt-4 px-5">
            <a href="/" className="flex items-center gap-3 py-2 hover:bg-white/5 transition-colors text-sm text-white">
              <svg className="w-5 h-5 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-6 9 6v8a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Về trang chủ
            </a>
          </div>
        </nav>
      </aside>

      <div className="lg:flex">
        {/* Desktop Sidebar - Fixed */}
        <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-56 bg-luxury-charcoal text-white border-r border-gray-800/20 overflow-y-auto">
          <div className="p-6 border-b border-gray-800/20">
            <h2 className="text-xl font-semibold text-white">VPG <span className="text-luxury-gold">Admin</span></h2>
            <p className="text-xs text-gray-300 mt-1">Quản trị hệ thống</p>
          </div>
          <nav className="py-4">
            {menuItems.map((item) => (
              <a key={item.href} href={item.href} className={`flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors ${isActive(item.href) ? 'bg-white/5 border-l-4 border-luxury-gold' : ''}`}>
                <span className="w-5 h-5 text-gray-300">
                  {item.key === 'dashboard' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  )}
                  {item.key === 'cars' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M3 13l1.5-4.5h15L21 13" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="7.5" cy="17.5" r="1.5" />
                      <circle cx="18.5" cy="17.5" r="1.5" />
                    </svg>
                  )}
                  {item.key === 'test-drives' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M5 12h14" strokeLinecap="round" />
                      <path d="M12 5v14" strokeLinecap="round" />
                    </svg>
                  )}
                  {item.key === 'price-quotes' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M12 1v22" strokeLinecap="round" />
                      <path d="M17 5H7v14h10V5z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {item.key === 'customers' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                      <path d="M3 21a9 9 0 0118 0" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-sm">{item.label}</span>
              </a>
            ))}

            <div className="border-t border-gray-800/20 mt-4 pt-4 px-5">
              <a href="/" className="flex items-center gap-3 py-2 hover:bg-white/5 transition-colors text-sm text-white">
                <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-6 9 6v8a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Về trang chủ
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-56">
          {/* Desktop Header - Fixed */}
          <header className="hidden lg:block fixed top-0 right-0 left-56 bg-white/60 backdrop-blur-sm border-b border-gray-200 z-30">
            <div className="px-8 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">
                {pathname === '/admin' && 'Dashboard'}
                {pathname.startsWith('/admin/cars') && 'Quản lý xe'}
                {pathname.startsWith('/admin/test-drives') && 'Danh sách lái thử'}
                {pathname.startsWith('/admin/price-quotes') && 'Danh sách báo giá'}
                {pathname.startsWith('/admin/customers') && 'Quản lý khách hàng'}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Admin Panel</span>
                <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center text-white font-semibold">A</div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="pt-16 lg:pt-20 p-4 lg:p-8 min-h-screen">{children}</div>
        </main>
      </div>
    </div>
  )
}
