'use client'
import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [smtpUser, setSmtpUser] = useState('')
  const [smtpPass, setSmtpPass] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const usr = data.find((s: any) => s.key === 'SMTP_USER')
          const pass = data.find((s: any) => s.key === 'SMTP_PASS')
          if (usr) setSmtpUser(usr.value)
          if (pass) setSmtpPass(pass.value)
        }
      })
      .catch(() => {})
  }, [])

  const saveSetting = async (key: string, value: string) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      })

      if (res.ok) {
        setMessage('Lưu thành công')
        setTimeout(() => setMessage(''), 2000)
      } else {
        setMessage('Lưu thất bại')
      }
    } catch (err) {
      setMessage('Có lỗi xảy ra')
    }
  }

  const handleSaveAll = async () => {
    await saveSetting('SMTP_USER', smtpUser)
    await saveSetting('SMTP_PASS', smtpPass)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Cấu hình</h1>

      <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản nhận email (SMTP_USER)</label>
          <input type="text" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} className="input-custom w-full" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu SMTP (SMTP_PASS)</label>
          <input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} className="input-custom w-full" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSaveAll} className="btn-primary">Lưu</button>
          {message && <div className="text-sm text-green-600">{message}</div>}
        </div>
      </div>
    </div>
  )
}
