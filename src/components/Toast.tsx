"use client"

import { useEffect } from 'react'

type ToastProps = {
  message: string
  visible: boolean
  onClose?: () => void
}

export default function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => onClose && onClose(), 3000)
    return () => clearTimeout(t)
  }, [visible, onClose])

  return (
    <div
      className={`fixed left-1/2 top-4 z-50 transform -translate-x-1/2 transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'
      }`}
    >
      <div className="min-w-[280px] bg-luxury-charcoal text-white rounded-md shadow-lg px-4 py-3">
        <div className="text-sm">{message}</div>
      </div>
    </div>
  )
}
