'use client'

import { useEffect, useState } from 'react'

export default function AdminTestDrivesPage() {
  const [testDrives, setTestDrives] = useState<any[]>([])

  useEffect(() => {
    loadTestDrives()
  }, [])

  const loadTestDrives = () => {
    fetch('/api/test-drives')
      .then(res => res.json())
      .then(data => setTestDrives(data))
      .catch(err => console.error(err))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return

    try {
      const res = await fetch(`/api/test-drives/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        loadTestDrives()
      }
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Danh sách đăng ký lái thử</h1>

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
                Ngày lái thử
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testDrives.map((td) => (
              <tr key={td.id}>
                <td className="px-6 py-4">{td.fullName}</td>
                <td className="px-6 py-4">{td.phone}</td>
                <td className="px-6 py-4">{td.carName}</td>
                <td className="px-6 py-4">{new Date(td.testDate).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(td.id)}
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
