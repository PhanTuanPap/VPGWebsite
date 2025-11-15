export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-luxury-charcoal text-white min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-luxury-gold">VPG Admin</h2>
          </div>
          <nav className="mt-6">
            <a href="/admin" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
              Dashboard
            </a>
            <a href="/admin/cars" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
              Quản lý xe
            </a>
            <a href="/admin/test-drives" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
              Danh sách lái thử
            </a>
            <a href="/admin/price-quotes" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
              Danh sách báo giá
            </a>
            <a href="/admin/customers" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
              Quản lý khách hàng
            </a>
            <a href="/" className="block px-6 py-3 hover:bg-gray-800 transition-colors mt-4 border-t border-gray-700">
              Về trang chủ
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
