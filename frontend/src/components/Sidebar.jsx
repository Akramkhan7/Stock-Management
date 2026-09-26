import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tag,
  Boxes,
  SlidersHorizontal,
  Inbox,
  Truck,
  ArrowLeftRight,
  ClipboardList,
  History,
  Warehouse,
  Settings,
  User,
  LogOut,
} from 'lucide-react'

const navGroups = [
  {
    label: null,
    items: [{ name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Inventory',
    items: [
      { name: 'Products', to: '/products', icon: Package },
      { name: 'Categories', to: '/categories', icon: Tag },
      { name: 'Stock Availability', to: '/stock', icon: Boxes },
      { name: 'Reordering Rules', to: '/reordering-rules', icon: SlidersHorizontal },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Receipts', to: '/receipts', icon: Inbox },
      { name: 'Delivery Orders', to: '/deliveries', icon: Truck },
      { name: 'Internal Transfers', to: '/transfers', icon: ArrowLeftRight },
      { name: 'Inventory Adjustments', to: '/adjustments', icon: ClipboardList },
      { name: 'Move History', to: '/ledger', icon: History },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Warehouses', to: '/warehouses', icon: Warehouse },
      { name: 'Settings', to: '/settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-100 flex flex-col shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Package size={14} className="text-white" />
        </div>
        <span className="font-semibold text-gray-900">StockSense</span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group, i) => (
          <div key={i}>
            {group.label && (
              <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon size={16} />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: profile / logout */}
      <div className="border-t border-gray-100 p-3 space-y-0.5">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <User size={16} />
          My Profile
        </NavLink>
        <button
          onClick={() => {
            // TODO: clear auth state + redirect
            console.log('logout')
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}