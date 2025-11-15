'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/cars', label: 'Quản lý xe', icon: '🚗' },
    { href: '/admin/test-drives', label: 'Danh sách lái thử', icon: '🔑' },
    { href: '/admin/price-quotes', label: 'Danh sách báo giá', icon: '💰' },
    { href: '/admin/customers', label: 'Quản lý khách hàng', icon: '👥' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-luxury-charcoal text-white z-50 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-luxury-gold">VPG Admin</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-luxury-charcoal text-white z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="py-4">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-6 py-3 hover:bg-gray-800 transition-colors ${
                isActive(item.href) ? 'bg-gray-800 border-l-4 border-luxury-gold' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </a>
          ))}
          <div className="border-t border-gray-700 mt-4 pt-4">
            <a
              href="/"
              className="block px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              <span className="mr-3">🏠</span>
              Về trang chủ
            </a>
          </div>
        </nav>
      </aside>

      <div className="lg:flex">
        {/* Desktop Sidebar - Fixed */}
        <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 bg-luxury-charcoal text-white overflow-y-auto">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-luxury-gold">VPG Admin</h2>
          </div>
          <nav className="py-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`block px-6 py-3 hover:bg-gray-800 transition-colors ${
                  isActive(item.href) ? 'bg-gray-800 border-l-4 border-luxury-gold' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </a>
            ))}
            <div className="border-t border-gray-700 mt-4 pt-4">
              <a
                href="/"
                className="block px-6 py-3 hover:bg-gray-800 transition-colors"
              >
                <span className="mr-3">🏠</span>
                Về trang chủ
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Desktop Header - Fixed */}
          <header className="hidden lg:block fixed top-0 right-0 left-64 bg-white border-b border-gray-200 z-30 shadow-sm">
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
                <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="pt-16 lg:pt-20 p-4 lg:p-8 min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
