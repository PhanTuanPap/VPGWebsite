'use client'

import { useEffect, useState } from 'react'

export default function ContactBubbles() {
  const [contact, setContact] = useState({ contactAdmin: '', zalo: '', facebook: '' })

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const contactA = data.find((s: any) => s.key === 'CONTACT_ADMIN')
          const zalo = data.find((s: any) => s.key === 'ZALO_ADMIN')
          const fb = data.find((s: any) => s.key === 'FACEBOOK_ADMIN')
          setContact({
            contactAdmin: contactA?.value || '',
            zalo: zalo?.value || '',
            facebook: fb?.value || ''
          })
        }
      })
      .catch(() => {})
  }, [])

  const items: { key: string; value: string; href?: string; bg: string; icon: React.ReactNode; target?: string }[] = []

  if (contact.contactAdmin) {
    const tel = contact.contactAdmin
    items.push({
      key: 'contact',
      value: contact.contactAdmin,
      href: `tel:${tel}`,
      bg: 'bg-luxury-gold',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.96.48 1.87 1.06 2.65a2 2 0 0 1-.45 2.54L9.91 11.09a14.05 14.05 0 0 0 4 4l1.18-1.18a2 2 0 0 1 2.54-.45c.78.58 1.69.94 2.65 1.06A2 2 0 0 1 22 16.92z" />
        </svg>
      )
    })
  }

  if (contact.zalo) {
    const digits = contact.zalo
    items.push({
      key: 'zalo',
      value: contact.zalo,
      href: digits ? digits : undefined,
      bg: 'bg-blue-500',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path d="M12 3C7 3 3 6.8 3 11c0 2.3 1.1 4.4 3 5.9V21l3.1-1.7c1 .3 2.1.5 3.3.5 5 0 9-3.8 9-8.5S17 3 12 3z" />
        </svg>
      ),
      target: '_blank'
    })
  }

  if (contact.facebook) {
    const raw = contact.facebook
    items.push({
      key: 'facebook',
      value: contact.facebook,
      href: raw,
      bg: 'bg-sky-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      target: '_blank'
    })
  }

  return (
    <div className="fixed left-4 bottom-4 z-40 flex flex-col gap-3">
      {items.map((it) => {
        if (!it.value) return null
        const props: any = { className: `${it.bg} text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform transition-all hover:scale-110`, 'aria-label': it.key }
        if (it.target) {
          props.target = it.target
          props.rel = 'noreferrer'
        }
        return (
          <a key={it.key} href={it.href} {...props}>
            {it.icon}
          </a>
        )
      })}
    </div>
  )
}
