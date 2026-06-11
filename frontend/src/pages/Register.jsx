import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Fish, User, Mail, Phone, Lock, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'fisher', label: '🎣 Рыбак', desc: 'Добавляю и продаю улов' },
  { value: 'buyer', label: '🛒 Покупатель', desc: 'Ищу и покупаю рыбу' },
  { value: 'inspector', label: '🔍 Инспектор', desc: 'Контроль и учёт' },
]

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: 'fisher' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await register(form)
      toast.success('Аккаунт создан!')
      navigate(user.role === 'inspector' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-4">
            <Fish size={32} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-white text-3xl">FishTrace KZ</h1>
          <p className="text-ocean-300 mt-1 text-sm">Создайте аккаунт</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="font-display font-bold text-slate-800 text-2xl mb-6">Регистрация</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Роль</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => (
                  <button key={r.value} type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      form.role === r.value
                        ? 'border-ocean-500 bg-ocean-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                    <div className="text-lg">{r.label.split(' ')[0]}</div>
                    <div className="text-xs font-semibold text-slate-700 mt-0.5">{r.label.split(' ')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Полное имя</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" required value={form.full_name} onChange={set('full_name')}
                  placeholder="Алибек Джаксыбеков" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required value={form.email} onChange={set('email')}
                  placeholder="email@example.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Телефон</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" value={form.phone} onChange={set('phone')}
                  placeholder="+7 777 000 00 00" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Пароль</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" required value={form.password} onChange={set('password')}
                  placeholder="Минимум 6 символов" minLength={6} className="input-field pl-10" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Создание...' : 'Создать аккаунт'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Есть аккаунт?{' '}
            <Link to="/login" className="text-ocean-600 font-semibold hover:text-ocean-700">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
