import { useState } from 'react'
import { Bell, Globe, Shield, Palette, Check } from 'lucide-react'

export default function Settings() {
  const [notifications, setNotifications] = useState({
    lowStock: true,
    pendingReceipts: true,
    pendingDeliveries: false,
    weeklyDigest: true,
  })
  const [preferences, setPreferences] = useState({
    defaultUnit: 'kg',
    dateFormat: 'DD/MM/YYYY',
    lowStockThreshold: 20,
  })
  const [saved, setSaved] = useState(false)

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500">Manage your workspace preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
        >
          {saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Bell size={15} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
            <p className="text-xs text-gray-400">Choose what you get alerted about</p>
          </div>
        </div>

        <div className="space-y-3 pl-1">
          {[
            { key: 'lowStock', label: 'Low stock alerts', desc: 'Get notified when a product falls below reorder level' },
            { key: 'pendingReceipts', label: 'Pending receipts', desc: 'Alert when a receipt is waiting for validation' },
            { key: 'pendingDeliveries', label: 'Pending deliveries', desc: 'Alert when a delivery is ready to ship' },
            { key: 'weeklyDigest', label: 'Weekly summary', desc: 'A weekly email digest of stock movement' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition shrink-0 ${
                  notifications[item.key] ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition"
                  style={{ transform: notifications[item.key] ? 'translateX(18px)' : 'translateX(3px)' }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* General preferences */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Globe size={15} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">General Preferences</h3>
            <p className="text-xs text-gray-400">Default formats used across the workspace</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default unit of measure</label>
            <select
              value={preferences.defaultUnit}
              onChange={(e) => setPreferences((p) => ({ ...p, defaultUnit: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="pcs">Pieces (pcs)</option>
              <option value="l">Liters (l)</option>
              <option value="box">Box</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date format</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => setPreferences((p) => ({ ...p, dateFormat: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default low-stock threshold (%)
            </label>
            <input
              type="number"
              value={preferences.lowStockThreshold}
              onChange={(e) => setPreferences((p) => ({ ...p, lowStockThreshold: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Used as the default when creating new reordering rules, unless overridden per product.
            </p>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <Shield size={15} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Security</h3>
            <p className="text-xs text-gray-400">Manage how your account stays protected</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-gray-800">Two-factor authentication</p>
            <p className="text-xs text-gray-400">Adds an extra layer of protection to your login</p>
          </div>
          <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">Enabled</span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-800">Change password</p>
            <p className="text-xs text-gray-400">Update your account password</p>
          </div>
          <button className="text-sm text-indigo-600 font-medium hover:underline">Update</button>
        </div>
      </div>
    </div>
  )
}