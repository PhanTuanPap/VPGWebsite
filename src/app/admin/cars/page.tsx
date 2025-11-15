'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminCarsPage() {
  const router = useRouter()
  const [cars, setCars] = useState<any[]>([])

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = () => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(err => console.error(err))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa xe này?')) return

    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        loadCars()
      }
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý xe</h1>
        <a href="/admin/cars/create" className="btn-primary">
          Thêm xe mới
        </a>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số phiên bản
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-6 py-4 whitespace-nowrap">{car.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{car.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap">{car.versions?.length || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <a href={`/admin/cars/${car.id}`} className="text-luxury-gold hover:text-luxury-darkGold">
                    Sửa
                  </a>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
