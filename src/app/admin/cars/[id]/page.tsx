'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface PendingImage {
  file: File
  preview: string
  imageType: string
}

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

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
    setSaving(true)
    
    try {
      const formData = new FormData(e.currentTarget)

      const data = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        article: formData.get('article'),
        mainImage: formData.get('mainImage')
      }

      // Cập nhật thông tin xe
      const res = await fetch(`/api/cars/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        throw new Error('Failed to update car')
      }

      // Xóa các ảnh đã đánh dấu xóa
      for (const imageId of imagesToDelete) {
        await fetch(`/api/car-images/${imageId}`, {
          method: 'DELETE'
        })
      }

      // Upload và lưu các ảnh mới
      for (const pendingImage of pendingImages) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', pendingImage.file)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          
          await fetch('/api/car-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              carId: params.id,
              imageUrl: uploadData.url,
              imageType: pendingImage.imageType,
              order: car.images?.filter((img: any) => img.imageType === pendingImage.imageType).length || 0
            })
          })
        }
      }

      alert('Cập nhật thành công!')
      router.push('/admin/cars')
    } catch (error) {
      alert('Có lỗi xảy ra')
      setSaving(false)
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

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>, imageType: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const preview = URL.createObjectURL(file)
    setPendingImages([...pendingImages, { file, preview, imageType }])
    e.target.value = '' // Reset input
  }

  const handleRemovePendingImage = (index: number) => {
    const newPendingImages = [...pendingImages]
    URL.revokeObjectURL(newPendingImages[index].preview)
    newPendingImages.splice(index, 1)
    setPendingImages(newPendingImages)
  }

  const handleMarkImageForDelete = (imageId: string) => {
    setImagesToDelete([...imagesToDelete, imageId])
  }

  const handleUnmarkImageForDelete = (imageId: string) => {
    setImagesToDelete(imagesToDelete.filter(id => id !== imageId))
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
              disabled={saving}
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Cập nhật'}
            </button>
          </div>
        </form>

        {/* Images Section */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Quản lý hình ảnh</h2>
          
          {/* Banner Image */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Ảnh Banner</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {car.images?.filter((img: any) => img.imageType === 'banner' && !imagesToDelete.includes(img.id)).map((img: any) => (
                <div key={img.id} className="relative group">
                  <img src={img.imageUrl} alt="Banner" className="w-full h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleMarkImageForDelete(img.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Xóa
                  </button>
                </div>
              ))}
              {car.images?.filter((img: any) => img.imageType === 'banner' && imagesToDelete.includes(img.id)).map((img: any) => (
                <div key={img.id} className="relative group opacity-50">
                  <img src={img.imageUrl} alt="Banner" className="w-full h-32 object-cover rounded" />
                  <div className="absolute inset-0 bg-red-600 bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Sẽ xóa</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnmarkImageForDelete(img.id)}
                    className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Hủy
                  </button>
                </div>
              ))}
              {pendingImages.filter(img => img.imageType === 'banner').map((img, index) => {
                const actualIndex = pendingImages.indexOf(img)
                return (
                  <div key={`pending-${actualIndex}`} className="relative group">
                    <img src={img.preview} alt="New Banner" className="w-full h-32 object-cover rounded border-2 border-green-500" />
                    <div className="absolute top-0 left-0 bg-green-600 text-white px-2 py-0.5 text-xs rounded-br">
                      Mới
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePendingImage(actualIndex)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Xóa
                    </button>
                  </div>
                )
              })}
              <div className="border-2 border-dashed border-gray-300 rounded h-32 flex items-center justify-center hover:border-luxury-gold transition-colors">
                <label className="cursor-pointer text-center">
                  <span className="text-gray-500">+ Thêm banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAddImage(e, 'banner')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Ảnh Chính</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {car.images?.filter((img: any) => img.imageType === 'main' && !imagesToDelete.includes(img.id)).map((img: any) => (
                <div key={img.id} className="relative group">
                  <img src={img.imageUrl} alt="Main" className="w-full h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleMarkImageForDelete(img.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Xóa
                  </button>
                </div>
              ))}
              {car.images?.filter((img: any) => img.imageType === 'main' && imagesToDelete.includes(img.id)).map((img: any) => (
                <div key={img.id} className="relative group opacity-50">
                  <img src={img.imageUrl} alt="Main" className="w-full h-32 object-cover rounded" />
                  <div className="absolute inset-0 bg-red-600 bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Sẽ xóa</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnmarkImageForDelete(img.id)}
                    className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Hủy
                  </button>
                </div>
              ))}
              {pendingImages.filter(img => img.imageType === 'main').map((img, index) => {
                const actualIndex = pendingImages.indexOf(img)
                return (
                  <div key={`pending-${actualIndex}`} className="relative group">
                    <img src={img.preview} alt="New Main" className="w-full h-32 object-cover rounded border-2 border-green-500" />
                    <div className="absolute top-0 left-0 bg-green-600 text-white px-2 py-0.5 text-xs rounded-br">
                      Mới
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePendingImage(actualIndex)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Xóa
                    </button>
                  </div>
                )
              })}
              <div className="border-2 border-dashed border-gray-300 rounded h-32 flex items-center justify-center hover:border-luxury-gold transition-colors">
                <label className="cursor-pointer text-center">
                  <span className="text-gray-500">+ Thêm ảnh chính</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAddImage(e, 'main')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Thư viện ảnh</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {car.images?.filter((img: any) => img.imageType === 'gallery' && !imagesToDelete.includes(img.id)).map((img: any) => (
                <div key={img.id} className="relative group">
                  <img src={img.imageUrl} alt="Gallery" className="w-full h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleMarkImageForDelete(img.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Xóa
                  </button>
                </div>
              ))}
              {car.images?.filter((img: any) => img.imageType === 'gallery' && imagesToDelete.includes(img.id)).map((img: any) => (
                <div key={img.id} className="relative group opacity-50">
                  <img src={img.imageUrl} alt="Gallery" className="w-full h-32 object-cover rounded" />
                  <div className="absolute inset-0 bg-red-600 bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Sẽ xóa</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnmarkImageForDelete(img.id)}
                    className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Hủy
                  </button>
                </div>
              ))}
              {pendingImages.filter(img => img.imageType === 'gallery').map((img, index) => {
                const actualIndex = pendingImages.indexOf(img)
                return (
                  <div key={`pending-${actualIndex}`} className="relative group">
                    <img src={img.preview} alt="New Gallery" className="w-full h-32 object-cover rounded border-2 border-green-500" />
                    <div className="absolute top-0 left-0 bg-green-600 text-white px-2 py-0.5 text-xs rounded-br">
                      Mới
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePendingImage(actualIndex)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Xóa
                    </button>
                  </div>
                )
              })}
              <div className="border-2 border-dashed border-gray-300 rounded h-32 flex items-center justify-center hover:border-luxury-gold transition-colors">
                <label className="cursor-pointer text-center">
                  <span className="text-gray-500">+ Thêm ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAddImage(e, 'gallery')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

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
