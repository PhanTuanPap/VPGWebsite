'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function CarDetailPage() {
  const params = useParams()
  const [car, setCar] = useState<any>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [showPriceQuoteModal, setShowPriceQuoteModal] = useState(false)
  const [showTestDriveModal, setShowTestDriveModal] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/cars/slug/${params.slug}`)
        .then(res => res.json())
        .then(data => setCar(data))
        .catch(err => console.error(err))
    }
  }, [params.slug])

  const handlePriceQuote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      carId: car.id,
      carName: car.name,
      paymentType: formData.get('paymentType')
    }

    try {
      const res = await fetch('/api/price-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.')
        setShowPriceQuoteModal(false)
      }
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại.')
    }
  }

  const handleTestDrive = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      carId: car.id,
      carName: car.name,
      testDate: formData.get('testDate')
    }

    try {
      const res = await fetch('/api/test-drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.')
        setShowTestDriveModal(false)
      }
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại.')
    }
  }

  if (!car) {
    return (
      <div className="container-custom py-16">
        <p>Đang tải...</p>
      </div>
    )
  }

  const galleryImages = car.images?.filter((img: any) => img.imageType === 'gallery') || []
  const mainImage = car.images?.find((img: any) => img.imageType === 'main')?.imageUrl || car.mainImage
  const images = galleryImages.length > 0 ? galleryImages : (mainImage ? [{imageUrl: mainImage}] : [])

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Slider */}
          <div>
            {images.length > 0 && (
              <>
                <div className="relative h-96 mb-4">
                  <Image
                    src={images[currentImage].imageUrl}
                    alt={car.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`relative h-20 rounded ${index === currentImage ? 'ring-2 ring-luxury-gold' : ''}`}
                      >
                        <Image
                          src={img.imageUrl}
                          alt={`${car.name} ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Car Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{car.name}</h1>
            {car.versions && car.versions.length > 0 && (
              <p className="text-3xl text-luxury-gold font-bold mb-6">
                Từ {Number(car.versions[0].price).toLocaleString('vi-VN')} VNĐ
              </p>
            )}
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setShowPriceQuoteModal(true)}
                className="btn-primary flex-1"
              >
                Nhận báo giá
              </button>
              <button 
                onClick={() => setShowTestDriveModal(true)}
                className="btn-outline flex-1"
              >
                Đăng ký lái thử
              </button>
            </div>

            {car.description && (
              <div className="mb-6">
                <p className="text-gray-700">{car.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Versions Table */}
        {car.versions && car.versions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Bảng giá các phiên bản</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-luxury-charcoal text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Phiên bản</th>
                    <th className="px-6 py-4 text-right">Giá (VNĐ)</th>
                  </tr>
                </thead>
                <tbody>
                  {car.versions.map((version: any, index: number) => (
                    <tr key={version.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4">{version.name}</td>
                      <td className="px-6 py-4 text-right font-semibold text-luxury-gold">
                        {Number(version.price).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Article */}
        {car.article && (
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold mb-6">Giới thiệu</h2>
            <div dangerouslySetInnerHTML={{ __html: car.article }} />
          </div>
        )}
      </div>

      {/* Price Quote Modal */}
      {showPriceQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Nhận báo giá {car.name}</h3>
            <form onSubmit={handlePriceQuote}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Họ tên</label>
                <input type="text" name="fullName" required className="input-custom" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Số điện thoại</label>
                <input type="tel" name="phone" required className="input-custom" />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-medium">Hình thức thanh toán</label>
                <select name="paymentType" required className="input-custom">
                  <option value="full">Trả hết</option>
                  <option value="installment">Trả góp</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPriceQuoteModal(false)} className="btn-secondary flex-1">
                  Hủy
                </button>
                <button type="submit" className="btn-primary flex-1">Gửi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Drive Modal */}
      {showTestDriveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Đăng ký lái thử {car.name}</h3>
            <form onSubmit={handleTestDrive}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Họ tên</label>
                <input type="text" name="fullName" required className="input-custom" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Số điện thoại</label>
                <input type="tel" name="phone" required className="input-custom" />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-medium">Ngày lái thử</label>
                <input type="date" name="testDate" required className="input-custom" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowTestDriveModal(false)} className="btn-secondary flex-1">
                  Hủy
                </button>
                <button type="submit" className="btn-primary flex-1">Đăng ký</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
