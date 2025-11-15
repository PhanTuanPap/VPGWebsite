export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Tổng số xe</h3>
          <p className="text-3xl font-bold text-luxury-gold mt-2">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Lái thử</h3>
          <p className="text-3xl font-bold text-luxury-gold mt-2">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Báo giá</h3>
          <p className="text-3xl font-bold text-luxury-gold mt-2">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Khách hàng</h3>
          <p className="text-3xl font-bold text-luxury-gold mt-2">-</p>
        </div>
      </div>
    </div>
  )
}
