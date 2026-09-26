import { useState } from 'react'
import { Plus, Search, ChevronDown, Eye, Trash2, ClipboardList, Check } from 'lucide-react'
import Modal from '../../components/Modal'
import StatusBadge from '../../components/StatusBadge'

const products = [
  { name: 'Steel Rods', sku: 'ST-1100', uom: 'kg' },
  { name: 'Hydraulic Pallet Jack', sku: 'HJ-002', uom: 'pcs' },
  { name: 'Corrugated Box L', sku: 'PK-556', uom: 'pcs' },
  { name: 'Wireless Router X2', sku: 'EL-330', uom: 'pcs' },
  { name: 'Oak Table Leg', sku: 'FN-112', uom: 'pcs' },
]
const warehouses = ['Main Warehouse', 'Production Floor', 'Warehouse 2']

// mock "recorded stock" lookup per product+warehouse
const recordedStockLookup = {
  'Steel Rods|Production Floor': 150,
  'Steel Rods|Main Warehouse': 12,
  'Hydraulic Pallet Jack|Production Floor': 9,
  'Corrugated Box L|Main Warehouse': 0,
  'Wireless Router X2|Warehouse 2': 180,
  'Oak Table Leg|Production Floor': 76,
}

const initialAdjustments = [
  {
    id: 'ADJ-129',
    product: 'Steel Rods',
    uom: 'kg',
    warehouse: 'Production Floor',
    recorded: 150,
    counted: 147,
    delta: -3,
    reason: 'Damaged during handling',
    date: '2026-09-25',
    status: 'Draft',
  },
  {
    id: 'ADJ-128',
    product: 'Corrugated Box L',
    uom: 'pcs',
    warehouse: 'Main Warehouse',
    recorded: 5,
    counted: 0,
    delta: -5,
    reason: 'Physical count mismatch',
    date: '2026-09-22',
    status: 'Done',
  },
]

export default function InventoryAdjustments() {
  const [adjustments, setAdjustments] = useState(initialAdjustments)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [isModalOpen, setModalOpen] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [form, setForm] = useState({ product: '', warehouse: '', counted: '', reason: '', date: '' })

  const filtered = adjustments.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.product.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || a.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const openAddModal = () => {
    setForm({ product: '', warehouse: '', counted: '', reason: '', date: new Date().toISOString().slice(0, 10) })
    setModalOpen(true)
  }

  const selectedProduct = products.find((p) => p.name === form.product)
  const recordedStock =
    form.product && form.warehouse
      ? recordedStockLookup[`${form.product}|${form.warehouse}`] ?? 0
      : null
  const delta =
    recordedStock !== null && form.counted !== ''
      ? Number(form.counted) - recordedStock
      : null

  const handleSaveDraft = (e) => {
    e.preventDefault()
    const newAdjustment = {
      id: `ADJ-${130 + adjustments.length}`,
      product: form.product,
      uom: selectedProduct?.uom || '',
      warehouse: form.warehouse,
      recorded: recordedStock,
      counted: Number(form.counted),
      delta,
      reason: form.reason,
      date: form.date,
      status: 'Draft',
    }
    setAdjustments((prev) => [newAdjustment, ...prev])
    setModalOpen(false)
  }

  const updateStatus = (id, status) => {
    setAdjustments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    if (viewing?.id === id) setViewing((v) => ({ ...v, status }))
  }

  const handleDelete = (id) => {
    setAdjustments((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Inventory Adjustments</h2>
          <p className="text-sm text-gray-500">Fix mismatches between recorded stock and physical count</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={14} /> New Adjustment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID or product"
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {['All Status', 'Draft', 'Waiting', 'Ready', 'Done', 'Canceled'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase text-gray-400 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Adjustment ID</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Warehouse</th>
              <th className="px-5 py-3 font-medium">Recorded</th>
              <th className="px-5 py-3 font-medium">Counted</th>
              <th className="px-5 py-3 font-medium">Delta</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                      <ClipboardList size={14} className="text-orange-500" />
                    </div>
                    <span className="font-medium text-gray-800">{a.id}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{a.product}</td>
                <td className="px-5 py-3 text-gray-500">{a.warehouse}</td>
                <td className="px-5 py-3 text-gray-700">{a.recorded} {a.uom}</td>
                <td className="px-5 py-3 text-gray-700">{a.counted} {a.uom}</td>
                <td className={`px-5 py-3 font-medium ${a.delta < 0 ? 'text-red-500' : a.delta > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {a.delta > 0 ? '+' : ''}{a.delta} {a.uom}
                </td>
                <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setViewing(a)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Eye size={14} className="text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-gray-400">
                  No adjustments match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Adjustment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New Inventory Adjustment">
        <form onSubmit={handleSaveDraft} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                value={form.product}
                onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select product</option>
                {products.map((p) => <option key={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <select
                value={form.warehouse}
                onChange={(e) => setForm((f) => ({ ...f, warehouse: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select location</option>
                {warehouses.map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>
          </div>

          {/* Recorded stock display */}
          {form.product && form.warehouse && (
            <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between text-sm">
              <span className="text-gray-500">Recorded stock at this location</span>
              <span className="font-semibold text-gray-800">{recordedStock} {selectedProduct?.uom}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Counted quantity (physical count)</label>
            <input
              type="number"
              value={form.counted}
              onChange={(e) => setForm((f) => ({ ...f, counted: e.target.value }))}
              placeholder="Enter what you physically counted"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Live delta preview */}
          {delta !== null && (
            <div
              className={`rounded-lg px-4 py-3 flex items-center justify-between text-sm ${
                delta < 0 ? 'bg-red-50' : delta > 0 ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <span className={delta < 0 ? 'text-red-600' : delta > 0 ? 'text-green-700' : 'text-gray-500'}>
                Resulting adjustment
              </span>
              <span className={`font-semibold ${delta < 0 ? 'text-red-600' : delta > 0 ? 'text-green-700' : 'text-gray-500'}`}>
                {delta > 0 ? '+' : ''}{delta} {selectedProduct?.uom}
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="e.g. Damaged during handling, miscount, theft"
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </Modal>

      {/* View / Validate Modal */}
      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title={viewing?.id}>
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Product</p>
                <p className="font-medium text-gray-800">{viewing.product}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Warehouse</p>
                <p className="font-medium text-gray-800">{viewing.warehouse}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Recorded stock</p>
                <p className="font-medium text-gray-800">{viewing.recorded} {viewing.uom}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Counted stock</p>
                <p className="font-medium text-gray-800">{viewing.counted} {viewing.uom}</p>
              </div>
            </div>

            <div
              className={`rounded-lg px-4 py-3 flex items-center justify-between text-sm ${
                viewing.delta < 0 ? 'bg-red-50' : viewing.delta > 0 ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <span className={viewing.delta < 0 ? 'text-red-600' : viewing.delta > 0 ? 'text-green-700' : 'text-gray-500'}>
                Adjustment
              </span>
              <span className={`font-semibold ${viewing.delta < 0 ? 'text-red-600' : viewing.delta > 0 ? 'text-green-700' : 'text-gray-500'}`}>
                {viewing.delta > 0 ? '+' : ''}{viewing.delta} {viewing.uom}
              </span>
            </div>

            {viewing.reason && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Reason</p>
                <p className="text-sm text-gray-700">{viewing.reason}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-400">Status</p>
              <div className="mt-1"><StatusBadge status={viewing.status} /></div>
            </div>

            {/* Status actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
              {viewing.status === 'Draft' && (
                <button
                  onClick={() => updateStatus(viewing.id, 'Done')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                >
                  <Check size={14} /> Validate & Apply
                </button>
              )}
              {viewing.status !== 'Done' && viewing.status !== 'Canceled' && (
                <button
                  onClick={() => updateStatus(viewing.id, 'Canceled')}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}