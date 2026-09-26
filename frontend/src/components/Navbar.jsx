import { Search, Bell, RefreshCw } from 'lucide-react'

export default function Navbar({ title = 'Dashboard', breadcrumb = 'Home / Overview' }) {
  return (
    <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6 shrink-0">
      <div>
        <p className="text-xs text-gray-400">{breadcrumb}</p>
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or SKU"
            className="w-72 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500">
          <RefreshCw size={16} />
        </button>

        <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold">
            AO
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-gray-900">Amara Okafor</p>
            <p className="text-xs text-gray-400">Inventory Manager</p>
          </div>
        </div>
      </div>
    </header>
  )
}