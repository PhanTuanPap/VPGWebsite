'use client'

import { useEffect, useState } from 'react'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = () => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error(err))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return

    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        loadCustomers()
      }
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý khách hàng</h1>
        <a href="/admin/customers/create" className="btn-primary">
          Thêm khách hàng
        </a>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thứ tự
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4">{customer.name}</td>
                <td className="px-6 py-4">
                  {customer.imageUrl && (
                    <img src={customer.imageUrl} alt={customer.name} className="w-12 h-12 rounded-full object-cover" />
                  )}
                </td>
                <td className="px-6 py-4">{customer.order}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <a 
                    href={`/admin/customers/${customer.id}`}
                    className="text-luxury-gold hover:text-luxury-darkGold"
                  >
                    Sửa
                  </a>
                  <button
                    onClick={() => handleDelete(customer.id)}
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
