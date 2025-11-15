"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const CountUp = dynamic(() => import('@/components/CountUp'), { ssr: false })

export default function AdminPage() {
  const [summary, setSummary] = useState<{ cars?: number; testDrives?: number; priceQuotes?: number; customers?: number }>({})

  useEffect(() => {
    fetch('/api/admin/summary')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Tổng số xe</h3>
          <p className="text-3xl font-bold text-luxury-gold mt-2">{typeof summary.cars === 'number' ? <CountUp value={summary.cars} /> : '-'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Lái thử</h3>
          <p className="text-3xl font-bold text-luxury-gold mt-2">{typeof summary.testDrives === 'number' ? <CountUp value={summary.testDrives} /> : '-'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Báo giá</h3>
          <p className="text-3xl font-bold text-luxury-gold mt-2">{typeof summary.priceQuotes === 'number' ? <CountUp value={summary.priceQuotes} /> : '-'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Khách hàng</h3>
          <p className="text-3xl font-bold text-luxury-gold mt-2">{typeof summary.customers === 'number' ? <CountUp value={summary.customers} /> : '-'}</p>
        </div>
      </div>
    </div>
  )
}
