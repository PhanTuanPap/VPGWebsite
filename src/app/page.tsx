'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [cars, setCars] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(err => console.error(err))

    fetch('/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(cars.length, 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [cars.length])

  return (
    <div>
      {/* Hero Banner Slider */}
      <section className="relative h-[60vh] md:h-[80vh] bg-gray-900 overflow-hidden">
        {cars.length > 0 && (
          <>
            {cars.map((car, index) => (
              <div
                key={car.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {car.mainImage && (
                  <Image
                    src={car.mainImage}
                    alt={car.name}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                  <div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{car.name}</h1>
                    <p className="text-xl md:text-2xl mb-8">
                      {car.versions && car.versions.length > 0 && 
                        `Từ ${Number(car.versions[0].price).toLocaleString('vi-VN')} VNĐ`
                      }
                    </p>
                    <Link href={`/cars/${car.slug}`} className="btn-primary inline-block">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Slider dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
              {cars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-luxury-gold w-8' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Cars List */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Dòng xe VinFast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <Link key={car.id} href={`/cars/${car.slug}`}>
                <div className="card-luxury overflow-hidden group">
                  {car.mainImage && (
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={car.mainImage}
                        alt={car.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{car.name}</h3>
                    {car.versions && car.versions.length > 0 && (
                      <p className="text-luxury-gold text-xl font-semibold">
                        Từ {Number(car.versions[0].price).toLocaleString('vi-VN')} VNĐ
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Customers Slider */}
      {customers.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Khách hàng của chúng tôi</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {customers.map((customer) => (
                <div key={customer.id} className="flex flex-col items-center">
                  {customer.imageUrl && (
                    <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden">
                      <Image
                        src={customer.imageUrl}
                        alt={customer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-center font-medium">{customer.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
