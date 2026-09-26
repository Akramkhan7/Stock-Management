import { useState } from 'react'
import { Plus, Pencil, Trash2, Warehouse as WarehouseIcon, MapPin, Package } from 'lucide-react'
import Modal from '../../components/Modal'

const initialWarehouses = [
  { id: 1, name: 'Main Warehouse', code: 'WH-MAIN', address: '14 Industrial Ave, Lagos', manager: 'Amara Okafor', productCount: 612, active: true },
  { id: 2, name: 'Production Floor', code: 'WH-PROD', address: 'Plant 2, Ikeja', manager: 'Tunde Bello', productCount: 348, active: true },
  { id: 3, name: 'Warehouse 2', code: 'WH-002', address: '9 Coastal Road, Lekki', manager: 'Chioma Eze', productCount: 324, active: true },
]

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState(initialWarehouses)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', address: '', manager: '' })

  const openAddModal = () => {
    setEditingId(null)
    setForm({ name: '', code: '', address: '', manager: '' })
    setModalOpen(true)
  }

  const openEditModal = (wh) => {
    setEditingId(wh.id)
    setForm({ name: wh.name, code: wh.code, address: wh.address, manager: wh.manager })
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    setWarehouses((prev) => prev.filter((w) => w.id !== id))
  }

  const toggleActive = (id) => {
    setWarehouses((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setWarehouses((prev) =>
        prev.map((w) => (w.id === editingId ? { ...w, ...form } : w))
      )
    } else {
      const newWarehouse = {
        id: Date.now(),
        ...form,
        productCount: 0,
        active: true,
      }
      setWarehouses((prev) => [newWarehouse, ...prev])
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Warehouses</h2>
          <p className="text-sm text-gray-500">{warehouses.length} locations across your operations</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={14} /> Add Warehouse
        </button>
      </div>

      {/* Grid of warehouse cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map((wh) => (
          <div key={wh.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <WarehouseIcon size={16} className="text-indigo-600" />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEditModal(wh)} className="p-1.5 hover:bg-gray-100 rounded">
                  <Pencil size={13} className="text-gray-400" />
                </button>
                <button onClick={() => handleDelete(wh.id)} className="p-1.5 hover:bg-gray-100 rounded">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{wh.name}</h3>
              <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-500">
                {wh.code}
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-2 flex items-start gap-1.5">
              <MapPin size={12} className="mt-0.5 shrink-0" />
              {wh.address}
            </p>
            <p className="text-xs text-gray-400 mt-1">Managed by {wh.manager}</p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Package size={12} /> {wh.productCount} products
              </span>
              <button
                onClick={() => toggleActive(wh.id)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                  wh.active ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition"
                  style={{ transform: wh.active ? 'translateX(18px)' : 'translateX(3px)' }}
                />
              </button>
            </div>
          </div>
        ))}

        {warehouses.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
            No warehouses yet. Click "Add Warehouse" to create one.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Warehouse' : 'Add Warehouse'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Main Warehouse"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                placeholder="WH-MAIN"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Street, city"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
            <input
              type="text"
              value={form.manager}
              onChange={(e) => setForm((f) => ({ ...f, manager: e.target.value }))}
              placeholder="Assigned warehouse manager"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              {editingId ? 'Save Changes' : 'Add Warehouse'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}