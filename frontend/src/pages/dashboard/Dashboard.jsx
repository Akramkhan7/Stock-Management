import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  Package, AlertTriangle, XCircle, Inbox, Truck,
  ArrowLeftRight, Plus, ChevronDown, Eye, MoreHorizontal,
} from 'lucide-react'

const kpis = [
  { label: 'Total Products', value: '1,284', delta: '+12 this week', icon: Package, tone: 'indigo' },
  { label: 'Low Stock', value: '32', delta: '4 warehouses', icon: AlertTriangle, tone: 'amber' },
  { label: 'Out of Stock', value: '8', delta: '3 critical', icon: XCircle, tone: 'red' },
  { label: 'Pending Receipts', value: '14', delta: '5 arriving today', icon: Inbox, tone: 'blue' },
  { label: 'Pending Deliveries', value: '21', delta: '2 due today', icon: Truck, tone: 'purple' },
]

const toneMap = {
  indigo: 'bg-indigo-50 text-indigo-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
}

const stockChartData = [
  { day: 'Mon', incoming: 40, outgoing: 24, adjustments: 5 },
  { day: 'Tue', incoming: 55, outgoing: 30, adjustments: 3 },
  { day: 'Wed', incoming: 32, outgoing: 45, adjustments: 8 },
  { day: 'Thu', incoming: 70, outgoing: 38, adjustments: 4 },
  { day: 'Fri', incoming: 48, outgoing: 52, adjustments: 6 },
  { day: 'Sat', incoming: 20, outgoing: 15, adjustments: 2 },
]

const categoryData = [
  { name: 'Electronics', value: 34, color: '#6366f1' },
  { name: 'Raw Materials', value: 27, color: '#818cf8' },
  { name: 'Furniture', value: 20, color: '#a5b4fc' },
  { name: 'Packaging', value: 19, color: '#c7d2fe' },
]

const lowStockItems = [
  { name: 'Steel Rods', sku: 'ST-1100', category: 'Raw Materials', warehouse: 'Main Warehouse', current: 12, reorder: 51, status: 'Low Stock' },
  { name: 'Hydraulic Pallet Jack', sku: 'HJ-002', category: 'Furniture', warehouse: 'Production Floor', current: 9, reorder: 11, status: 'Low Stock' },
  { name: 'Corrugated Box L', sku: 'PK-556', category: 'Packaging', warehouse: 'Main Warehouse', current: 0, reorder: 201, status: 'Out of Stock' },
]

const recentOps = [
  { id: 'REC-1024', type: 'Receipt', warehouse: 'Main Warehouse', items: '2 products', qty: '+305 kg', time: 'Today, 09:12', status: 'Done' },
  { id: 'DEL-882', type: 'Delivery', warehouse: 'Production Floor', items: '8 products', qty: '-20 pcs', time: 'Today, 11:05', status: 'Ready' },
  { id: 'TRF-352', type: 'Transfer', warehouse: 'Main Warehouse → Production Floor', items: '1 product', qty: '300 kg', time: 'Yesterday, 16:40', status: 'Waiting' },
  { id: 'ADJ-129', type: 'Adjustment', warehouse: 'Production Floor', items: '1 product', qty: '-3 kg', time: 'Yesterday, 15:58', status: 'Draft' },
]

const statusStyles = {
  Done: 'bg-green-50 text-green-700',
  Ready: 'bg-blue-50 text-blue-700',
  Waiting: 'bg-amber-50 text-amber-700',
  Draft: 'bg-gray-100 text-gray-600',
  Canceled: 'bg-red-50 text-red-700',
}

export default function Dashboard() {
  const [warehouse, setWarehouse] = useState('All warehouses')
  const [range, setRange] = useState('Last 7 days')

  return (
    <div className="space-y-6">
      {/* Greeting + filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Good morning, Amara</h2>
          <p className="text-sm text-gray-500">Here's what's happening with your inventory today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            {warehouse} <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            {range} <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
            <Plus size={14} /> New Operation
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${toneMap[kpi.tone]}`}>
              <kpi.icon size={16} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{kpi.label}</p>
            <p className="text-[11px] text-gray-400 mt-1">{kpi.delta}</p>
          </div>
        ))}
      </div>

      {/* Internal transfers banner */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 text-sm">
        <ArrowLeftRight size={16} className="text-indigo-600 shrink-0" />
        <span className="text-gray-500">Internal transfers</span>
        <span className="text-gray-300">·</span>
        <span className="text-gray-600">3 scheduled across 3 warehouses</span>
        <div className="flex items-center gap-2 ml-2 flex-wrap">
          <span className="px-2 py-0.5 bg-gray-50 rounded text-xs text-gray-500">Main Warehouse → Production Floor</span>
          <span className="px-2 py-0.5 bg-gray-50 rounded text-xs text-gray-500">Warehouse 2 → Main Warehouse</span>
        </div>
        <button className="ml-auto text-indigo-600 text-xs font-medium hover:underline shrink-0">View transfers</button>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">Stock Overview</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Incoming</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-200" /> Outgoing</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-300" /> Adjustments</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stockChartData} barGap={4}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="incoming" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outgoing" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
              <Bar dataKey="adjustments" fill="#fcd34d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory by category */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Inventory by Category</h3>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-semibold text-gray-900">1,284</span>
              <span className="text-[11px] text-gray-400">units</span>
            </div>
          </div>
          <div className="space-y-1.5 mt-2">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="text-gray-700 font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low stock items */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-5 pb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Low Stock Items</h3>
            <p className="text-xs text-gray-400 mt-0.5">12 products below reorder level across 3 warehouses</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline">
            <AlertTriangle size={13} /> View All Low Stock
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase text-gray-400 border-y border-gray-100">
                <th className="px-5 py-2.5 font-medium">Product</th>
                <th className="px-5 py-2.5 font-medium">SKU</th>
                <th className="px-5 py-2.5 font-medium">Category</th>
                <th className="px-5 py-2.5 font-medium">Warehouse</th>
                <th className="px-5 py-2.5 font-medium">Current</th>
                <th className="px-5 py-2.5 font-medium">Reorder Level</th>
                <th className="px-5 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item) => (
                <tr key={item.sku} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-800">{item.name}</td>
                  <td className="px-5 py-3 text-gray-500">{item.sku}</td>
                  <td className="px-5 py-3 text-gray-500">{item.category}</td>
                  <td className="px-5 py-3 text-gray-500">{item.warehouse}</td>
                  <td className="px-5 py-3 text-gray-700">{item.current}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.status === 'Out of Stock' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded"><Eye size={14} className="text-gray-400" /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded"><MoreHorizontal size={14} className="text-gray-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-400">
          <span>Showing 3 of 12 low stock items</span>
          <span>Page 1 of 4</span>
        </div>
      </div>

      {/* Recent operations */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="font-semibold text-gray-900 text-sm">Recent Operations</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500">
              All Types <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500">
              All Status <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500">
              All Warehouses <ChevronDown size={12} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase text-gray-400 border-y border-gray-100">
                <th className="px-5 py-2.5 font-medium">Operation ID</th>
                <th className="px-5 py-2.5 font-medium">Type</th>
                <th className="px-5 py-2.5 font-medium">Warehouse</th>
                <th className="px-5 py-2.5 font-medium">Items</th>
                <th className="px-5 py-2.5 font-medium">Quantity</th>
                <th className="px-5 py-2.5 font-medium">Time</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOps.map((op) => (
                <tr key={op.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-800">{op.id}</td>
                  <td className="px-5 py-3 text-gray-500">{op.type}</td>
                  <td className="px-5 py-3 text-gray-500">{op.warehouse}</td>
                  <td className="px-5 py-3 text-gray-500">{op.items}</td>
                  <td className={`px-5 py-3 font-medium ${op.qty.startsWith('-') ? 'text-red-500' : 'text-green-600'}`}>
                    {op.qty}
                  </td>
                  <td className="px-5 py-3 text-gray-400">{op.time}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyles[op.status]}`}>
                      {op.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-xs text-indigo-600 font-medium hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 text-xs text-gray-400">
          Showing 4 of 118 operations · <button className="text-indigo-600 font-medium hover:underline">Open Move History</button>
        </div>
      </div>
    </div>
  )
}