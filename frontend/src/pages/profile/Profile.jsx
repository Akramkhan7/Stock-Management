import { useState } from 'react'
import { Mail, Phone, Building2, Calendar, Camera, Check, Inbox, Truck, ArrowLeftRight, ClipboardList } from 'lucide-react'

const activitySummary = [
  { label: 'Receipts processed', value: 84, icon: Inbox, tone: 'bg-blue-50 text-blue-600' },
  { label: 'Deliveries shipped', value: 132, icon: Truck, tone: 'bg-purple-50 text-purple-600' },
  { label: 'Transfers logged', value: 47, icon: ArrowLeftRight, tone: 'bg-teal-50 text-teal-600' },
  { label: 'Adjustments made', value: 19, icon: ClipboardList, tone: 'bg-orange-50 text-orange-600' },
]

export default function Profile() {
  const [form, setForm] = useState({
    name: 'Amara Okafor',
    email: 'amara.okafor@stocksense.io',
    phone: '+234 801 234 5678',
    role: 'Inventory Manager',
    warehouse: 'Main Warehouse',
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const initials = form.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
        <p className="text-sm text-gray-500">Manage your personal information and account details</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-semibold">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <Camera size={12} className="text-gray-500" />
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{form.name}</h3>
            <p className="text-sm text-gray-500">{form.role}</p>
            <p className="text-xs text-gray-400 mt-0.5">{form.warehouse}</p>
          </div>
        </div>
      </div>

      {/* Activity summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {activitySummary.map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${item.tone}`}>
              <item.icon size={15} />
            </div>
            <p className="text-lg font-semibold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">Personal Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Inventory Manager</option>
                <option>Warehouse Staff</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary warehouse</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                name="warehouse"
                value={form.warehouse}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Main Warehouse</option>
                <option>Production Floor</option>
                <option>Warehouse 2</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
          >
            {saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}