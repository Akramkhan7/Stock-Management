import { useState } from 'react'
import {
  Plus, Search, ChevronDown, Eye, Pencil, Trash2, Package, X,
} from 'lucide-react'
import Modal from '../../components/Modal'

const initialProducts = [
  { id: 1, name: 'Steel Rods', sku: 'ST-1100', category: 'Raw Materials', uom: 'kg', warehouse: 'Main Warehouse', stock: 12, reorder: 51, status: 'Low Stock' },
  { id: 2, name: 'Hydraulic Pallet Jack', sku: 'HJ-002', category: 'Furniture', uom: 'pcs', warehouse: 'Production Floor', stock: 9, reorder: 11, status: 'Low Stock' },
  { id: 3, name: 'Corrugated Box L', sku: 'PK-556', category: 'Packaging', uom: 'pcs', warehouse: 'Main Warehouse', stock: 0, reorder: 201, status: 'Out of Stock' },
  { id: 4, name: 'Wireless Router X2', sku: 'EL-330', category: 'Electronics', uom: 'pcs', warehouse: 'Warehouse 2', stock: 248, reorder: 50, status: 'In Stock' },
  { id: 5, name: 'Oak Table Leg', sku: 'FN-112', category: 'Furniture', uom: 'pcs', warehouse: 'Production Floor', stock: 76, reorder: 30, status: 'In Stock' },
]

const categories = ['All Categories', 'Raw Materials', 'Furniture', 'Packaging', 'Electronics']
const warehouses = ['All Warehouses', 'Main Warehouse', 'Production Floor', 'Warehouse 2']

const statusStyles = {
  'In Stock': 'bg-green-50 text-green-700',
  'Low Stock': 'bg-amber-50 text-amber-600',
  'Out of Stock': 'bg-red-50 text-red-600',
}

export default function Products() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [warehouse, setWarehouse] = useState('All Warehouses')
  const [isModalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', sku: '', category: '', uom: '', stock: '' })

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All Categories' || p.category === category
    const matchesWarehouse = warehouse === 'All Warehouses' || p.warehouse === warehouse
    return matchesSearch && matchesCategory && matchesWarehouse
  })

  const handleAddProduct = (e) => {
    e.preventDefault()
    const newProduct = {
      id: products.length + 1,
      name: form.name,
      sku: form.sku,
      category: form.category,
      uom: form.uom,
      warehouse: 'Main Warehouse',
      stock: Number(form.stock) || 0,
      reorder: 20,
      status: Number(form.stock) > 20 ? 'In Stock' : Number(form.stock) > 0 ? 'Low Stock' : 'Out of Stock',
    }
    setProducts((prev) => [newProduct, ...prev])
    setForm({ name: '', sku: '', category: '', uom: '', stock: '' })
    setModalOpen(false)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{products.length} products across all warehouses</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={14} /> Add Product
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
            placeholder="Search by name or SKU"
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {warehouses.map((w) => <option key={w}>{w}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">UoM</th>
                <th className="px-5 py-3 font-medium">Warehouse</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
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
                  <td className="px-5 py-3 text-gray-500">{p.uom}</td>
                  <td className="px-5 py-3 text-gray-500">{p.warehouse}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium">{p.stock}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 hover:bg-gray-100 rounded"><Eye size={14} className="text-gray-400" /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded"><Pencil size={14} className="text-gray-400" /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded"><Trash2 size={14} className="text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400">
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-400 border-t border-gray-50">
          <span>Showing {filtered.length} of {products.length} products</span>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add Product">
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Steel Rods"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Code</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                placeholder="ST-1100"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
              <input
                type="text"
                value={form.uom}
                onChange={(e) => setForm((f) => ({ ...f, uom: e.target.value }))}
                placeholder="kg / pcs"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select category</option>
                {categories.slice(1).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial stock (optional)</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
              Save Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}