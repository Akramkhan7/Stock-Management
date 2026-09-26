import { useState } from 'react'
import { Plus, Pencil, Trash2, SlidersHorizontal, Search } from 'lucide-react'
import Modal from '../../components/Modal'

const initialRules = [
  { id: 1, product: 'Steel Rods', sku: 'ST-1100', warehouse: 'Main Warehouse', minStock: 50, reorderQty: 200, active: true },
  { id: 2, product: 'Hydraulic Pallet Jack', sku: 'HJ-002', warehouse: 'Production Floor', minStock: 10, reorderQty: 15, active: true },
  { id: 3, product: 'Corrugated Box L', sku: 'PK-556', warehouse: 'Main Warehouse', minStock: 200, reorderQty: 500, active: true },
  { id: 4, product: 'Wireless Router X2', sku: 'EL-330', warehouse: 'Warehouse 2', minStock: 50, reorderQty: 100, active: false },
]

const products = ['Steel Rods', 'Hydraulic Pallet Jack', 'Corrugated Box L', 'Wireless Router X2', 'Oak Table Leg']
const warehouses = ['Main Warehouse', 'Production Floor', 'Warehouse 2']

export default function ReorderingRules() {
  const [rules, setRules] = useState(initialRules)
  const [search, setSearch] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ product: '', warehouse: '', minStock: '', reorderQty: '' })

  const filtered = rules.filter(
    (r) =>
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.sku.toLowerCase().includes(search.toLowerCase())
  )

  const openAddModal = () => {
    setEditingId(null)
    setForm({ product: '', warehouse: '', minStock: '', reorderQty: '' })
    setModalOpen(true)
  }

  const openEditModal = (rule) => {
    setEditingId(rule.id)
    setForm({
      product: rule.product,
      warehouse: rule.warehouse,
      minStock: rule.minStock,
      reorderQty: rule.reorderQty,
    })
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  const toggleActive = (id) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                product: form.product,
                warehouse: form.warehouse,
                minStock: Number(form.minStock),
                reorderQty: Number(form.reorderQty),
              }
            : r
        )
      )
    } else {
      const newRule = {
        id: Date.now(),
        product: form.product,
        sku: '—',
        warehouse: form.warehouse,
        minStock: Number(form.minStock),
        reorderQty: Number(form.reorderQty),
        active: true,
      }
      setRules((prev) => [newRule, ...prev])
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reordering Rules</h2>
          <p className="text-sm text-gray-500">
            Automatically trigger low-stock alerts when inventory drops below threshold
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={14} /> Add Rule
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product or SKU"
          className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase text-gray-400 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Warehouse</th>
              <th className="px-5 py-3 font-medium">Min Stock (Threshold)</th>
              <th className="px-5 py-3 font-medium">Reorder Quantity</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rule) => (
              <tr key={rule.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <SlidersHorizontal size={14} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{rule.product}</p>
                      <p className="text-xs text-gray-400">{rule.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{rule.warehouse}</td>
                <td className="px-5 py-3 text-gray-700 font-medium">{rule.minStock}</td>
                <td className="px-5 py-3 text-gray-700 font-medium">{rule.reorderQty}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleActive(rule.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                      rule.active ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                        rule.active ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                      style={{ transform: rule.active ? 'translateX(18px)' : 'translateX(3px)' }}
                    />
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEditModal(rule)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Pencil size={14} className="text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(rule.id)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                  No reordering rules match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Reordering Rule' : 'Add Reordering Rule'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select
              value={form.product}
              onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select product</option>
              {products.map((p) => <option key={p}>{p}</option>)}
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
              <option value="">Select warehouse</option>
              {warehouses.map((w) => <option key={w}>{w}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock (Threshold)</label>
              <input
                type="number"
                value={form.minStock}
                onChange={(e) => setForm((f) => ({ ...f, minStock: e.target.value }))}
                placeholder="e.g. 50"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Quantity</label>
              <input
                type="number"
                value={form.reorderQty}
                onChange={(e) => setForm((f) => ({ ...f, reorderQty: e.target.value }))}
                placeholder="e.g. 200"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <p className="text-xs text-gray-400">
            When stock at this warehouse falls to or below the threshold, StockSense will flag it as low stock and suggest reordering this quantity.
          </p>

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
              {editingId ? 'Save Changes' : 'Add Rule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}