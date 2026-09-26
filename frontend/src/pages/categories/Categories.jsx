import { useState } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import Modal from '../../components/Modal'

const initialCategories = [
  { id: 1, name: 'Raw Materials', description: 'Unprocessed inputs used in production', productCount: 342, color: '#6366f1' },
  { id: 2, name: 'Furniture', description: 'Finished furniture items and parts', productCount: 218, color: '#818cf8' },
  { id: 3, name: 'Packaging', description: 'Boxes, wraps, and shipping materials', productCount: 156, color: '#a5b4fc' },
  { id: 4, name: 'Electronics', description: 'Electronic components and devices', productCount: 431, color: '#c7d2fe' },
]

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })

  const openAddModal = () => {
    setEditingId(null)
    setForm({ name: '', description: '' })
    setModalOpen(true)
  }

  const openEditModal = (cat) => {
    setEditingId(cat.id)
    setForm({ name: cat.name, description: cat.description })
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form } : c))
      )
    } else {
      const newCat = {
        id: Date.now(),
        name: form.name,
        description: form.description,
        productCount: 0,
        color: '#a5b4fc',
      }
      setCategories((prev) => [newCat, ...prev])
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">{categories.length} categories organizing your products</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* Grid of category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <Tag size={16} style={{ color: cat.color }} />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 hover:bg-gray-100 rounded"
                >
                  <Pencil size={13} className="text-gray-400" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 hover:bg-gray-100 rounded"
                >
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mt-3">{cat.name}</h3>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description}</p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
              <span className="text-xs text-gray-400">Products</span>
              <span className="text-sm font-semibold text-gray-900">{cat.productCount}</span>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
            No categories yet. Click "Add Category" to create one.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Raw Materials"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description of this category"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
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
              {editingId ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}