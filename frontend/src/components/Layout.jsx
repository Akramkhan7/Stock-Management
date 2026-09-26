import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const titleMap = {
  '/dashboard': { title: 'Dashboard', breadcrumb: 'Home / Overview / Dashboard' },
  '/products': { title: 'Products', breadcrumb: 'Home / Inventory / Products' },
  '/categories': { title: 'Categories', breadcrumb: 'Home / Inventory / Categories' },
  '/stock': { title: 'Stock Availability', breadcrumb: 'Home / Inventory / Stock Availability' },
  '/reordering-rules': { title: 'Reordering Rules', breadcrumb: 'Home / Inventory / Reordering Rules' },
  '/receipts': { title: 'Receipts', breadcrumb: 'Home / Operations / Receipts' },
  '/deliveries': { title: 'Delivery Orders', breadcrumb: 'Home / Operations / Delivery Orders' },
  '/transfers': { title: 'Internal Transfers', breadcrumb: 'Home / Operations / Internal Transfers' },
  '/adjustments': { title: 'Inventory Adjustments', breadcrumb: 'Home / Operations / Inventory Adjustments' },
  '/ledger': { title: 'Move History', breadcrumb: 'Home / Operations / Move History' },
  '/warehouses': { title: 'Warehouses', breadcrumb: 'Home / Management / Warehouses' },
  '/settings': { title: 'Settings', breadcrumb: 'Home / Management / Settings' },
  '/profile': { title: 'My Profile', breadcrumb: 'Home / My Profile' },
}

export default function Layout() {
  const { pathname } = useLocation()
  const meta = titleMap[pathname] || { title: 'StockSense', breadcrumb: 'Home' }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={meta.title} breadcrumb={meta.breadcrumb} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}