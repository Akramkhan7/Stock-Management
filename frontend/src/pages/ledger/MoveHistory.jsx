import { useState } from 'react'
import { Search, ChevronDown, Inbox, Truck, ArrowLeftRight, ClipboardList, Download } from 'lucide-react'

const typeConfig = {
  Receipt: { icon: Inbox, color: 'bg-blue-50 text-blue-500' },
  Delivery: { icon: Truck, color: 'bg-purple-50 text-purple-500' },
  Transfer: { icon: ArrowLeftRight, color: 'bg-teal-50 text-teal-500' },
  Adjustment: { icon: ClipboardList, color: 'bg-orange-50 text-orange-500' },
}

// Simulated aggregated ledger — in the real app this comes from a backend
// query joining receipts, deliveries, transfers & adjustments once validated.
const ledgerEntries = [
  { id: 'REC-1024', type: 'Receipt', product: 'Steel Rods', warehouse: 'Main Warehouse', qty: 305, uom: 'kg', direction: 'in', date: '2026-09-26 09:12', ref: 'Northwind Metals Co.' },
  { id: 'DEL-880', type: 'Delivery', product: 'Corrugated Box L', warehouse: 'Main Warehouse', qty: -120, uom: 'pcs', direction: 'out', date: '2026-09-20 14:05', ref: 'BrightHome Retail' },
  { id: 'TRF-351', type: 'Transfer', product: 'Wireless Router X2', warehouse: 'Warehouse 2 → Main Warehouse', qty: 60, uom: 'pcs', direction: 'move', date: '2026-09-24 16:40', ref: 'Internal move' },
  { id: 'ADJ-128', type: 'Adjustment', product: 'Corrugated Box L', warehouse: 'Main Warehouse', qty: -5, uom: 'pcs', direction: 'out', date: '2026-09-22 15:58', ref: 'Physical count mismatch' },
  { id: 'ADJ-129', type: 'Adjustment', product: 'Steel Rods', warehouse: 'Production Floor', qty: -3, uom: 'kg', direction: 'out', date: '2026-09-25 10:20', ref: 'Damaged during handling' },
  { id: 'DEL-882', type: 'Delivery', product: 'Oak Table Leg', warehouse: 'Production Floor', qty: -20, uom: 'pcs', direction: 'out', date: '2026-09-26 11:05', ref: 'Acme Manufacturing' },
  { id: 'TRF-350', type: 'Transfer', product: 'Corrugated Box L', warehouse: 'Main Warehouse → Production Floor', qty: 40, uom: 'pcs', direction: 'move', date: '2026-09-20 13:15', ref: 'Internal move' },
  { id: 'REC-1023', type: 'Receipt', product: 'Wireless Router X2', warehouse: 'Warehouse 2', qty: 100, uom: 'pcs', direction: 'in', date: '2026-09-24 08:30', ref: 'ByteGear Electronics' },
]

const typeOptions = ['All Types', 'Receipt', 'Delivery', 'Transfer', 'Adjustment']
const warehouseOptions = ['All Warehouses', 'Main Warehouse', 'Production Floor', 'Warehouse 2']

export default function MoveHistory() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [warehouseFilter, setWarehouseFilter] = useState('All Warehouses')

  const filtered = ledgerEntries
    .filter((e) => {
      const matchesSearch =
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.product.toLowerCase().includes(search.toLowerCase()) ||
        e.ref.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === 'All Types' || e.type === typeFilter
      const matchesWarehouse = warehouseFilter === 'All Warehouses' || e.warehouse.includes(warehouseFilter)
      return matchesSearch && matchesType && matchesWarehouse
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const totals = filtered.reduce(
    (acc, e) => {
      if (e.direction === 'in') acc.in += e.qty
      if (e.direction === 'out') acc.out += Math.abs(e.qty)
      return acc
    },
    { in: 0, out: 0 }
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Move History</h2>
          <p className="text-sm text-gray-500">A complete, auditable log of every stock movement</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">Total Movements</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">Stock In</p>
          <p className="text-xl font-semibold text-green-600 mt-1">+{totals.in}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">Stock Out</p>
          <p className="text-xl font-semibold text-red-500 mt-1">-{totals.out}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">Net Change</p>
          <p className={`text-xl font-semibold mt-1 ${totals.in - totals.out >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {totals.in - totals.out >= 0 ? '+' : ''}{totals.in - totals.out}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, product, or reference"
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {typeOptions.map((t) => <option key={t}>{t}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {warehouseOptions.map((w) => <option key={w}>{w}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Ledger table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase text-gray-400 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Reference</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Quantity</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => {
              const config = typeConfig[e.type]
              return (
                <tr key={`${e.id}-${i}`} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-800">{e.id}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
                      <config.icon size={12} />
                      {e.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{e.product}</td>
                  <td className="px-5 py-3 text-gray-500">{e.warehouse}</td>
                  <td className={`px-5 py-3 font-medium ${
                    e.direction === 'in' ? 'text-green-600' : e.direction === 'out' ? 'text-red-500' : 'text-gray-600'
                  }`}>
                    {e.qty > 0 && e.direction !== 'move' ? '+' : ''}{e.qty} {e.uom}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{e.ref}</td>
                  <td className="px-5 py-3 text-gray-400">{e.date}</td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                  No movements match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-5 py-3 text-xs text-gray-400 border-t border-gray-50">
          Showing {filtered.length} of {ledgerEntries.length} logged movements
        </div>
      </div>
    </div>
  )
}