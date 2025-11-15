'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateCustomerPage() {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data = {
      name: formData.get('name'),
      imageUrl: formData.get('imageUrl'),
      order: Number(formData.get('order'))
    }

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        alert('Thêm khách hàng thành công!')
        router.push('/admin/customers')
      } else {
        alert('Có lỗi xảy ra')
      }
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        const imageInput = document.querySelector<HTMLInputElement>('input[name="imageUrl"]')
        if (imageInput) {
          imageInput.value = data.url
        }
        setImageUrl(data.url)
        alert('Upload thành công!')
      }
    } catch (error) {
      alert('Upload thất bại')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Thêm khách hàng mới</h1>

      <div className="bg-white shadow rounded-lg p-8 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Tên khách hàng</label>
            <input
              type="text"
              name="name"
              required
              className="input-custom"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Hình ảnh</label>
            <input
              type="text"
              name="imageUrl"
              className="input-custom mb-2"
              placeholder="/uploads/customer.jpg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="input-custom"
            />
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="mt-4 w-32 h-32 rounded-full object-cover" />
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Thứ tự hiển thị</label>
            <input
              type="number"
              name="order"
              defaultValue={0}
              required
              className="input-custom"
              min="0"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/customers')}
              className="btn-secondary"
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              Thêm khách hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
