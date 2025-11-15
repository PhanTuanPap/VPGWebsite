'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PendingImage {
  file: File
  preview: string
  imageType: string
}

export default function CreateCarPage() {
  const router = useRouter()
  const [versions, setVersions] = useState<Array<{ name: string; price: string }>>([
    { name: '', price: '' }
  ])
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const [saving, setSaving] = useState(false)

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
        mainImage: formData.get('mainImage'),
        versions: versions.filter(v => v.name && v.price).map(v => ({
          name: v.name,
          price: parseFloat(v.price)
        }))
      }

      // Tạo xe mới
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create car')
      }

      const newCar = await res.json()

      // Upload và lưu các ảnh
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
              carId: newCar.id,
              imageUrl: uploadData.url,
              imageType: pendingImage.imageType,
              order: pendingImages.filter(img => img.imageType === pendingImage.imageType).indexOf(pendingImage)
            })
          })
        }
      }

      alert('Tạo xe thành công!')
      router.push('/admin/cars')
    } catch (error: any) {
      alert('Có lỗi xảy ra: ' + (error.message || 'Unknown error'))
      setSaving(false)
    }
  }

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>, imageType: string) => {
    const files = e.target.files
    if (!files) return

    const newImages: PendingImage[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const preview = URL.createObjectURL(file)
      newImages.push({ file, preview, imageType })
    }

    setPendingImages([...pendingImages, ...newImages])
    e.target.value = '' // Reset input
  }

  const handleRemovePendingImage = (index: number) => {
    const newPendingImages = [...pendingImages]
    URL.revokeObjectURL(newPendingImages[index].preview)
    newPendingImages.splice(index, 1)
    setPendingImages(newPendingImages)
  }

  const addVersion = () => {
    setVersions([...versions, { name: '', price: '' }])
  }

  const removeVersion = (index: number) => {
    setVersions(versions.filter((_, i) => i !== index))
  }

  const updateVersion = (index: number, field: 'name' | 'price', value: string) => {
    const newVersions = [...versions]
    newVersions[index][field] = value
    setVersions(newVersions)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Thêm xe mới</h1>

      <div className="bg-white shadow rounded-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-medium">Tên xe *</label>
              <input
                type="text"
                name="name"
                required
                className="input-custom"
                placeholder="VinFast VF 8"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Slug *</label>
              <input
                type="text"
                name="slug"
                required
                className="input-custom"
                placeholder="vinfast-vf-8"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Mô tả ngắn</label>
            <textarea
              name="description"
              rows={3}
              className="input-custom"
              placeholder="Mô tả ngắn gọn về xe..."
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Bài viết (HTML)</label>
            <textarea
              name="article"
              rows={10}
              className="input-custom font-mono text-sm"
              placeholder="<h2>Giới thiệu</h2><p>...</p>"
            />
          </div>

          {/* Images Section */}
          <div className="mb-6 pt-6 border-t">
            <h2 className="text-xl font-bold mb-6">Quản lý hình ảnh</h2>
            
            {/* Banner Image */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Ảnh Banner</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pendingImages.filter(img => img.imageType === 'banner').map((img, index) => {
                  const actualIndex = pendingImages.indexOf(img)
                  return (
                    <div key={`banner-${actualIndex}`} className="relative group">
                      <img src={img.preview} alt="Banner" className="w-full h-32 object-cover rounded border-2 border-green-500" />
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
                      multiple
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
                {pendingImages.filter(img => img.imageType === 'main').map((img, index) => {
                  const actualIndex = pendingImages.indexOf(img)
                  return (
                    <div key={`main-${actualIndex}`} className="relative group">
                      <img src={img.preview} alt="Main" className="w-full h-32 object-cover rounded border-2 border-green-500" />
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
                      multiple
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
                {pendingImages.filter(img => img.imageType === 'gallery').map((img, index) => {
                  const actualIndex = pendingImages.indexOf(img)
                  return (
                    <div key={`gallery-${actualIndex}`} className="relative group">
                      <img src={img.preview} alt="Gallery" className="w-full h-32 object-cover rounded border-2 border-green-500" />
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
                      multiple
                      onChange={(e) => handleAddImage(e, 'gallery')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Versions Section */}
          <div className="mb-6 pt-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Các phiên bản</h2>
              <button
                type="button"
                onClick={addVersion}
                className="btn-secondary text-sm"
              >
                + Thêm phiên bản
              </button>
            </div>
            
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Tên phiên bản</label>
                      <input
                        type="text"
                        value={version.name}
                        onChange={(e) => updateVersion(index, 'name', e.target.value)}
                        className="input-custom"
                        placeholder="Eco"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">Giá (VNĐ)</label>
                      <input
                        type="number"
                        value={version.price}
                        onChange={(e) => updateVersion(index, 'price', e.target.value)}
                        className="input-custom"
                        placeholder="1200000000"
                      />
                    </div>
                  </div>
                  {versions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVersion(index)}
                      className="text-red-600 hover:text-red-900 mt-8"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              {saving ? 'Đang tạo...' : 'Tạo xe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
