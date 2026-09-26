import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Package } from 'lucide-react'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const navigation = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigation('/dashboard');
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 text-white flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <Package size={18} />
          </div>
          <span className="font-semibold text-lg">StockSense</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-semibold leading-snug">
            Know your stock.<br />Control your operations.
          </h1>
          <p className="text-indigo-100 max-w-sm">
            One operations workspace for inventory teams, across every warehouse.
          </p>

          {/* mini chart card */}
          <div className="bg-white/10 rounded-xl p-5 max-w-sm">
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-indigo-100">Stock movement — 7 days</span>
              <span className="bg-white/15 px-2 py-0.5 rounded text-xs">↗ +8.4%</span>
            </div>
            <div className="flex items-end gap-2 h-20">
              {[40, 55, 35, 75, 50].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t ${i === 3 ? 'bg-white' : 'bg-white/40'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-indigo-100">
          <p>✓ Live stock levels across every location</p>
          <p>✓ Auditable movement ledger for every SKU</p>
          <p>✓ Low-stock alerts before they hurt fulfillment</p>
          <p className="text-indigo-200/70 pt-4 text-xs">
            © 2026 StockSense · Inventory operations platform
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 mt-1 mb-8 text-sm">
            Sign in to your StockSense workspace.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-indigo-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            Protected by two-factor authentication
          </p>
        </div>
      </div>
    </div>
  )
}