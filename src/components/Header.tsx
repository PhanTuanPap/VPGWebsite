'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-luxury-gold">VPG</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium">
              Trang chủ
            </Link>
            <Link href="/bang-gia" className="text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium">
              Bảng giá
            </Link>
            <Link href="/tinh-tien-tra-gop" className="text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium">
              Tính tiền trả góp
            </Link>
            <Link href="/du-toan-chi-phi" className="text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium">
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
            <Link href="/" className="block py-2 text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium">
              Trang chủ
            </Link>
            <Link href="/bang-gia" className="block py-2 text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium">
              Bảng giá
            </Link>
            <Link href="/tinh-tien-tra-gop" className="block py-2 text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium">
              Tính tiền trả góp
            </Link>
            <Link href="/du-toan-chi-phi" className="block py-2 text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium">
              Dự toán chi phí
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
