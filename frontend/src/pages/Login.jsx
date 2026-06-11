import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Fish, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Добро пожаловать, ${user.full_name}!`)
      navigate(user.role === 'inspector' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-950 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-4">
            <Fish size={32} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-white text-3xl">FishTrace KZ</h1>
          <p className="text-ocean-300 mt-1 text-sm">Цифровой учёт улова</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="font-display font-bold text-slate-800 text-2xl mb-6">Войти</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} required
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="fisher@example.com"
                  className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Пароль</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPwd ? 'text' : 'password'} value={form.password} required
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-ocean-600 font-semibold hover:text-ocean-700">
              Зарегистрироваться
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Демо-аккаунты</p>
            <div className="space-y-1 text-xs text-slate-600">
              <p>🎣 Рыбак: fisher@demo.kz / demo123</p>
              <p>🛒 Покупатель: buyer@demo.kz / demo123</p>
              <p>🔍 Инспектор: inspector@demo.kz / demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
