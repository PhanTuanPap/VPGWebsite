'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/cars/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setCar(data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      article: formData.get('article'),
      mainImage: formData.get('mainImage')
    }

    try {
      const res = await fetch(`/api/cars/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        alert('Cập nhật thành công!')
        router.push('/admin/cars')
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
        const imageInput = document.querySelector<HTMLInputElement>('input[name="mainImage"]')
        if (imageInput) {
          imageInput.value = data.url
        }
        alert('Upload thành công!')
      }
    } catch (error) {
      alert('Upload thất bại')
    }
  }

  if (loading) {
    return <div className="p-8">Đang tải...</div>
  }

  if (!car) {
    return <div className="p-8">Không tìm thấy xe</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Chỉnh sửa xe: {car.name}</h1>

      <div className="bg-white shadow rounded-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-medium">Tên xe</label>
              <input
                type="text"
                name="name"
                defaultValue={car.name}
                required
                className="input-custom"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Slug</label>
              <input
                type="text"
                name="slug"
                defaultValue={car.slug}
                required
                className="input-custom"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Mô tả ngắn</label>
            <textarea
              name="description"
              defaultValue={car.description || ''}
              rows={3}
              className="input-custom"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Hình ảnh chính</label>
            <input
              type="text"
              name="mainImage"
              defaultValue={car.mainImage || ''}
              className="input-custom mb-2"
              placeholder="/uploads/car.jpg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="input-custom"
            />
            {car.mainImage && (
              <img src={car.mainImage} alt={car.name} className="mt-4 w-48 h-32 object-cover rounded" />
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Bài viết (HTML)</label>
            <textarea
              name="article"
              defaultValue={car.article || ''}
              rows={10}
              className="input-custom font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/cars')}
              className="btn-secondary"
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              Cập nhật
            </button>
          </div>
        </form>

        {/* Versions Section */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Các phiên bản</h2>
          <div className="space-y-4">
            {car.versions?.map((version: any) => (
              <div key={version.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-semibold">{version.name}</p>
                  <p className="text-luxury-gold">{Number(version.price).toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <button
                  onClick={async () => {
                    if (!confirm('Xóa phiên bản này?')) return
                    try {
                      const res = await fetch(`/api/car-versions/${version.id}`, {
                        method: 'DELETE'
                      })
                      if (res.ok) {
                        window.location.reload()
                      }
                    } catch (error) {
                      alert('Có lỗi xảy ra')
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
