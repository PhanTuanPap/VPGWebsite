'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/default/vinfastlogo.png" 
              alt="VinFast Logo" 
              className="h-12 w-auto"
            />
            {/* <div className="flex flex-col">
              <span className="text-base font-bold text-luxury-charcoal leading-tight">VinFast VPG An Giang</span>
            </div> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className={`font-semibold transition-colors ${isActive('/') ? 'text-luxury-gold' : 'text-luxury-charcoal hover:text-luxury-gold'}`}>
              Trang chủ
            </Link>
            <Link href="/bang-gia" className={`font-semibold transition-colors ${isActive('/bang-gia') ? 'text-luxury-gold' : 'text-luxury-charcoal hover:text-luxury-gold'}`}>
              Bảng giá
            </Link>
            <Link href="/tinh-tien-tra-gop" className={`font-semibold transition-colors ${isActive('/tinh-tien-tra-gop') ? 'text-luxury-gold' : 'text-luxury-charcoal hover:text-luxury-gold'}`}>
              Tính tiền trả góp
            </Link>
            <Link href="/du-toan-chi-phi" className={`font-semibold transition-colors ${isActive('/du-toan-chi-phi') ? 'text-luxury-gold' : 'text-luxury-charcoal hover:text-luxury-gold'}`}>
              Dự toán chi phí
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-luxury-charcoal"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className={`block py-2 font-medium transition-colors ${isActive('/') ? 'text-luxury-gold' : 'text-luxury-charcoal hover:text-luxury-gold'}`}>
              Trang chủ
            </Link>
            <Link href="/bang-gia" onClick={() => setIsMenuOpen(false)} className={`block py-2 font-medium transition-colors ${isActive('/bang-gia') ? 'text-luxury-gold' : 'text-luxury-charcoal hover:text-luxury-gold'}`}>
              Bảng giá
            </Link>
            <Link href="/tinh-tien-tra-gop" onClick={() => setIsMenuOpen(false)} className={`block py-2 font-medium transition-colors ${isActive('/tinh-tien-tra-gop') ? 'text-luxury-gold' : 'text-luxury-charcoal hover:text-luxury-gold'}`}>
              Tính tiền trả góp
            </Link>
            <Link href="/du-toan-chi-phi" onClick={() => setIsMenuOpen(false)} className={`block py-2 font-medium transition-colors ${isActive('/du-toan-chi-phi') ? 'text-luxury-gold' : 'text-luxury-charcoal hover:text-luxury-gold'}`}>
              Dự toán chi phí
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
