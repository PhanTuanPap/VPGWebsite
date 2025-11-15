'use client'

import { useEffect, useState } from 'react'

export default function AdminPriceQuotesPage() {
  const [priceQuotes, setPriceQuotes] = useState<any[]>([])

  useEffect(() => {
    loadPriceQuotes()
  }, [])

  const loadPriceQuotes = () => {
    fetch('/api/price-quotes')
      .then(res => res.json())
      .then(data => setPriceQuotes(data))
      .catch(err => console.error(err))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return

    try {
      const res = await fetch(`/api/price-quotes/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        loadPriceQuotes()
      }
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Danh sách báo giá</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mẫu xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hình thức
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {priceQuotes.map((pq) => (
              <tr key={pq.id}>
                <td className="px-6 py-4">{pq.fullName}</td>
                <td className="px-6 py-4">{pq.phone}</td>
                <td className="px-6 py-4">{pq.carName}</td>
                <td className="px-6 py-4">
                  {pq.paymentType === 'full' ? 'Trả hết' : 'Trả góp'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(pq.id)}
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
