import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Package, Check, ArrowLeft } from 'lucide-react'

const STEPS = ['Enter email', 'Enter code', 'New password', 'Done']

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1-4
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [passwords, setPasswords] = useState({ password: '', confirm: '' })
  const [resendTimer, setResendTimer] = useState(92) // 1:32 like mockup
  const inputsRef = useRef([])

  const handleSendCode = (e) => {
    e.preventDefault()
    // TODO: call API to send OTP
    setStep(2)
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) inputsRef.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleVerifyCode = (e) => {
    e.preventDefault()
    // TODO: verify OTP with API
    setStep(3)
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    // TODO: call API to reset password
    setStep(4)
  }

  const passwordsMatch =
    passwords.confirm.length > 0 && passwords.password === passwords.confirm

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Package size={14} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900">StockSense</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">Password recovery</h2>
        <p className="text-gray-500 text-sm mt-1 mb-6">
          Recover access with an one-time code to reset your password.
        </p>

        {/* Step progress */}
        <div className="mb-8">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Step {step} of 4 — {STEPS[step - 1]}
          </p>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                We'll send a one-time code to reset your password.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              Send code
            </button>
            <Link
              to="/login"
              className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the 6-digit code
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Sent to {email || 'your email'}. The code expires in 15 minutes.
              </p>
              <div className="flex gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-full aspect-square text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Resend in {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, '0')}</span>
              <button
                type="button"
                onClick={() => setResendTimer(92)}
                className="text-indigo-600 font-medium hover:underline disabled:text-gray-300"
                disabled={resendTimer > 0}
              >
                Resend
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              Verify code
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700 w-full mt-2"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </form>
        )}

        {/* Step 3: New password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={passwords.password}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Use at least 12 characters with a mix of letters &amp; symbols.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, confirm: e.target.value }))
                  }
                  placeholder="••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              {passwordsMatch && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check size={12} /> Passwords match
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              Reset password
            </button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Password updated</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your password has been changed. Sign in with your new credentials.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
            >
              Back to sign in <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}