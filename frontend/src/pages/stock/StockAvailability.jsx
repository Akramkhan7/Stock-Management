import { useState } from 'react'
import { Search, ChevronDown, ChevronRight, Package, MapPin } from 'lucide-react'

const stockData = [
  {
    id: 1,
    name: 'Steel Rods',
    sku: 'ST-1100',
    category: 'Raw Materials',
    uom: 'kg',
    totalStock: 187,
    reorder: 51,
    locations: [
      { warehouse: 'Main Warehouse', quantity: 12 },
      { warehouse: 'Production Floor', quantity: 150 },
      { warehouse: 'Warehouse 2', quantity: 25 },
    ],
  },
  {
    id: 2,
    name: 'Hydraulic Pallet Jack',
    sku: 'HJ-002',
    category: 'Furniture',
    uom: 'pcs',
    totalStock: 9,
    reorder: 11,
    locations: [
      { warehouse: 'Production Floor', quantity: 9 },
    ],
  },
  {
    id: 3,
    name: 'Corrugated Box L',
    sku: 'PK-556',
    category: 'Packaging',
    uom: 'pcs',
    totalStock: 0,
    reorder: 201,
    locations: [
      { warehouse: 'Main Warehouse', quantity: 0 },
    ],
  },
  {
    id: 4,
    name: 'Wireless Router X2',
    sku: 'EL-330',
    category: 'Electronics',
    uom: 'pcs',
    totalStock: 248,
    reorder: 50,
    locations: [
      { warehouse: 'Warehouse 2', quantity: 180 },
      { warehouse: 'Main Warehouse', quantity: 68 },
    ],
  },
]

const getStatus = (stock, reorder) => {
  if (stock === 0) return { label: 'Out of Stock', style: 'bg-red-50 text-red-600' }
  if (stock <= reorder) return { label: 'Low Stock', style: 'bg-amber-50 text-amber-600' }
  return { label: 'In Stock', style: 'bg-green-50 text-green-700' }
}

export default function StockAvailability() {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = stockData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Stock Availability</h2>
        <p className="text-sm text-gray-500">Live stock levels for every product, broken down by warehouse</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU"
          className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table with expandable rows */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase text-gray-400 border-b border-gray-100">
              <th className="px-5 py-3 font-medium w-8"></th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Locations</th>
              <th className="px-5 py-3 font-medium">Total Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const status = getStatus(p.totalStock, p.reorder)
              const isExpanded = expandedId === p.id
              return (
                <>
                  <tr
                    key={p.id}
                    onClick={() => toggleExpand(p.id)}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      {isExpanded ? (
                        <ChevronDown size={14} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={14} className="text-gray-400" />
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                          <Package size={14} className="text-indigo-500" />
                        </div>
                        <span className="font-medium text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{p.sku}</td>
                    <td className="px-5 py-3 text-gray-500">{p.category}</td>
                    <td className="px-5 py-3 text-gray-500">{p.locations.length} locations</td>
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {p.totalStock} <span className="text-gray-400 font-normal">{p.uom}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.style}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr key={`${p.id}-expanded`} className="bg-gray-50/50">
                      <td colSpan={7} className="px-5 py-3">
                        <div className="pl-11 space-y-2">
                          {p.locations.map((loc) => (
                            <div
                              key={loc.warehouse}
                              className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-2.5"
                            >
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin size={13} className="text-gray-400" />
                                {loc.warehouse}
                              </div>
                              <span className="text-sm font-medium text-gray-800">
                                {loc.quantity} {p.uom}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}