import { useState } from 'react'
import { Plus, Search, ChevronDown, Eye, Trash2, ArrowLeftRight, X, Check } from 'lucide-react'
import Modal from '../../components/Modal'
import StatusBadge from '../../components/StatusBadge'

const products = ['Steel Rods', 'Hydraulic Pallet Jack', 'Corrugated Box L', 'Wireless Router X2', 'Oak Table Leg']
const warehouses = ['Main Warehouse', 'Production Floor', 'Warehouse 2']

const initialTransfers = [
  {
    id: 'TRF-352',
    from: 'Main Warehouse',
    to: 'Production Floor',
    date: '2026-09-25',
    status: 'Waiting',
    lines: [{ product: 'Steel Rods', qty: 300, uom: 'kg' }],
  },
  {
    id: 'TRF-351',
    from: 'Warehouse 2',
    to: 'Main Warehouse',
    date: '2026-09-24',
    status: 'Done',
    lines: [{ product: 'Wireless Router X2', qty: 60, uom: 'pcs' }],
  },
  {
    id: 'TRF-350',
    from: 'Main Warehouse',
    to: 'Production Floor',
    date: '2026-09-20',
    status: 'Ready',
    lines: [{ product: 'Corrugated Box L', qty: 40, uom: 'pcs' }],
  },
]

const emptyLine = { product: '', qty: '', uom: 'pcs' }

export default function InternalTransfers() {
  const [transfers, setTransfers] = useState(initialTransfers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [isModalOpen, setModalOpen] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [form, setForm] = useState({ from: '', to: '', date: '', lines: [{ ...emptyLine }] })
  const [fromToError, setFromToError] = useState('')

  const filtered = transfers.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.from.toLowerCase().includes(search.toLowerCase()) ||
      t.to.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const openAddModal = () => {
    setForm({ from: '', to: '', date: new Date().toISOString().slice(0, 10), lines: [{ ...emptyLine }] })
    setFromToError('')
    setModalOpen(true)
  }

  const updateLine = (index, field, value) => {
    setForm((f) => {
      const lines = [...f.lines]
      lines[index] = { ...lines[index], [field]: value }
      return { ...f, lines }
    })
  }

  const addLine = () => setForm((f) => ({ ...f, lines: [...f.lines, { ...emptyLine }] }))
  const removeLine = (index) =>
    setForm((f) => ({ ...f, lines: f.lines.filter((_, i) => i !== index) }))

  const handleSaveDraft = (e) => {
    e.preventDefault()
    if (form.from && form.to && form.from === form.to) {
      setFromToError('Source and destination must be different locations')
      return
    }
    const newTransfer = {
      id: `TRF-${353 + transfers.length}`,
      from: form.from,
      to: form.to,
      date: form.date,
      status: 'Draft',
      lines: form.lines.filter((l) => l.product && l.qty),
    }
    setTransfers((prev) => [newTransfer, ...prev])
    setModalOpen(false)
  }

  const updateStatus = (id, status) => {
    setTransfers((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    if (viewing?.id === id) setViewing((v) => ({ ...v, status }))
  }

  const handleDelete = (id) => {
    setTransfers((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Internal Transfers</h2>
          <p className="text-sm text-gray-500">Move stock between warehouses and locations</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={14} /> New Transfer
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
            placeholder="Search by ID or location"
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
              <th className="px-5 py-3 font-medium">Transfer ID</th>
              <th className="px-5 py-3 font-medium">Route</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <ArrowLeftRight size={14} className="text-teal-500" />
                    </div>
                    <span className="font-medium text-gray-800">{t.id}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  <span className="text-gray-700">{t.from}</span>
                  <span className="mx-1.5 text-gray-300">→</span>
                  <span className="text-gray-700">{t.to}</span>
                </td>
                <td className="px-5 py-3 text-gray-500">{t.date}</td>
                <td className="px-5 py-3 text-gray-500">{t.lines.length} product{t.lines.length !== 1 ? 's' : ''}</td>
                <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setViewing(t)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Eye size={14} className="text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                  No transfers match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Transfer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New Internal Transfer">
        <form onSubmit={handleSaveDraft} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From location</label>
              <select
                value={form.from}
                onChange={(e) => { setForm((f) => ({ ...f, from: e.target.value })); setFromToError('') }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select source</option>
                {warehouses.map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To location</label>
              <select
                value={form.to}
                onChange={(e) => { setForm((f) => ({ ...f, to: e.target.value })); setFromToError('') }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select destination</option>
                {warehouses.map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>
          </div>
          {fromToError && <p className="text-xs text-red-500">{fromToError}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transfer date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Products</label>
              <button
                type="button"
                onClick={addLine}
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                + Add line
              </button>
            </div>
            <div className="space-y-2">
              {form.lines.map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={line.product}
                    onChange={(e) => updateLine(i, 'product', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select product</option>
                    {products.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <input
                    type="number"
                    value={line.qty}
                    onChange={(e) => updateLine(i, 'qty', e.target.value)}
                    placeholder="Qty"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    value={line.uom}
                    onChange={(e) => updateLine(i, 'uom', e.target.value)}
                    placeholder="UoM"
                    className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {form.lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLine(i)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <X size={14} className="text-gray-400" />
                    </button>
                  )}
                </div>
              ))}
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
              Save as Draft
            </button>
          </div>
        </form>
      </Modal>

      {/* View / Validate Modal */}
      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title={viewing?.id}>
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg px-4 py-3">
              <span className="font-medium text-gray-800">{viewing.from}</span>
              <ArrowLeftRight size={14} className="text-gray-400" />
              <span className="font-medium text-gray-800">{viewing.to}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Date</p>
                <p className="font-medium text-gray-800">{viewing.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <StatusBadge status={viewing.status} />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Products</p>
              <div className="border border-gray-100 rounded-lg divide-y divide-gray-50">
                {viewing.lines.map((line, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-gray-700">{line.product}</span>
                    <span className="font-medium text-gray-800">{line.qty} {line.uom}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Total stock is unaffected — only the recorded location changes.
              </p>
            </div>

            {/* Status actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
              {viewing.status === 'Draft' && (
                <button
                  onClick={() => updateStatus(viewing.id, 'Waiting')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg"
                >
                  Mark as Waiting
                </button>
              )}
              {viewing.status === 'Waiting' && (
                <button
                  onClick={() => updateStatus(viewing.id, 'Ready')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                >
                  Mark as Ready
                </button>
              )}
              {viewing.status === 'Ready' && (
                <button
                  onClick={() => updateStatus(viewing.id, 'Done')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                >
                  <Check size={14} /> Validate Transfer
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