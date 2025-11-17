"use client"

import { useEffect, useState } from 'react'
import Toast from '@/components/Toast'
import { useRouter } from 'next/navigation'

export default function AdminGalleryPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [pending, setPending] = useState<any[]>([])
  const [uploads, setUploads] = useState<any[]>([])
  const [toast, setToast] = useState({ visible: false, message: '', variant: 'info' as 'info' | 'success' | 'error' | 'warning' })

  useEffect(() => { loadBanners() }, [])
  useEffect(() => { loadUploads() }, [])

  const loadBanners = () => {
    fetch('/api/car-images')
      .then(res => res.json())
      .then(data => {
        setBanners(data.filter((i: any) => i.imageType === 'banner'))
      })
      .catch(err => console.error(err))
  }

  const loadUploads = () => {
    fetch('/api/uploads')
      .then(res => res.json())
      .then(data => setUploads(data))
      .catch(err => console.error(err))
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const arr: any[] = []
    for (let i = 0; i < files.length; i++) {
      arr.push(files[i])
    }
    setPending(arr)
  }

  const uploadPending = async () => {
    try {
      for (const file of pending) {
        const fd = new FormData()
        fd.append('file', file)
        const up = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!up.ok) continue
        const data = await up.json()
        const imageUrl = data.url
        await fetch('/api/car-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ carId: '', imageUrl: data.url, imageType: 'banner', order: 0 })
        })
      }
      setPending([])
      setToast({ visible: true, message: 'Upload thành công', variant: 'success' })
      loadBanners()
      loadUploads()
    } catch (err) {
      setToast({ visible: true, message: 'Upload thất bại', variant: 'error' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) return
    try {
      const res = await fetch(`/api/car-images/${id}`, { method: 'DELETE' })
      if (res.ok) loadBanners()
    } catch (err) {
      setToast({ visible: true, message: 'Xóa thất bại', variant: 'error' })
    }
  }

  const handleDeleteUpload = async (name: string) => {
    if (!confirm('Xóa file upload này?')) return
    try {
      const res = await fetch('/api/uploads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
      const data = await res.json()
      if (res.ok) {
        setToast({ visible: true, message: 'Xóa thành công', variant: 'success' })
        loadUploads()
      } else {
        setToast({ visible: true, message: data.error || 'Không thể xóa', variant: 'error' })
      }
    } catch (err) {
      setToast({ visible: true, message: 'Xóa thất bại', variant: 'error' })
    }
  }

  return (
    <div>
      <Toast message={toast.message} visible={toast.visible} variant={toast.variant} onClose={() => setToast({ ...toast, visible: false })} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quản lý banner website</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Upload mới (các file này sẽ được thêm vào thư mục uploads)</h3>
          <input type="file" accept="image/*" multiple onChange={handleFile} />
          {pending.length > 0 && (
            <div className="mt-4">
              <button onClick={uploadPending} className="btn-primary">Upload {pending.length} file</button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Banner website (imageType = 'banner')</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {banners.map(b => (
              <div key={b.id} className="relative group">
                <img src={b.imageUrl} className="w-full h-40 object-cover rounded" />
                <button onClick={() => handleDelete(b.id)} className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100">Xóa</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Files trong thư mục uploads</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploads.map(f => (
              <div key={f.name} className={`group bg-white shadow rounded p-3 relative overflow-hidden border ${f.used ? 'border-gray-100' : 'border-yellow-300'}`}>
                <div className="w-full h-40 bg-gray-50 rounded overflow-hidden mb-3">
                  <img src={f.url} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="truncate pr-2">{f.name}</div>
                  <div className="text-xs text-gray-500">{(f.size/1024).toFixed(0)} KB</div>
                </div>
                {!f.used && (<div className="absolute top-3 left-3 bg-yellow-300 text-black px-2 py-0.5 text-xs rounded">Unused</div>)}
                {!f.used && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100">
                    <button onClick={() => handleDeleteUpload(f.name)} className="bg-red-600 text-white px-2 py-1 rounded text-sm">Xóa</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
