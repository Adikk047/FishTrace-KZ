import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import { Fish, MapPin, Weight, Calendar, Phone, DollarSign, FileText, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const FISH_TYPES = ['Карп', 'Судак', 'Сазан', 'Щука', 'Сом', 'Лещ', 'Окунь', 'Форель', 'Осётр', 'Белуга', 'Другое']

export default function AddCatch() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    fish_type: '',
    weight_kg: '',
    location: '',
    catch_date: today,
    price_per_kg: '',
    phone: user?.phone || '',
    description: '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        weight_kg: parseFloat(form.weight_kg),
        price_per_kg: form.price_per_kg ? parseFloat(form.price_per_kg) : null,
      }
      const { data } = await api.post('/catches/', payload)
      toast.success('Улов добавлен!')
      setCreated(data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  if (created) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="card p-8">
          <div className="w-16 h-16 bg-tide-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-tide-600" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-800 mb-2">Улов добавлен!</h2>
          <p className="text-slate-500 mb-6">Запись сохранена и QR-код сгенерирован</p>

          {/* QR */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-6 inline-block">
            <img
              src={`/qr_codes/catch_${created.id}.png`}
              alt="QR-код"
              className="w-40 h-40 mx-auto"
              onError={e => { e.target.style.display = 'none' }}
            />
            <p className="text-xs text-slate-500 mt-2">QR-код для покупателей</p>
          </div>

          <div className="bg-ocean-50 rounded-xl p-4 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Вид рыбы</span><span className="font-semibold">{created.fish_type}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Вес</span><span className="font-semibold">{created.weight_kg} кг</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Место</span><span className="font-semibold">{created.location}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Дата</span><span className="font-semibold">{created.catch_date}</span></div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setCreated(null)} className="btn-secondary flex-1">Добавить ещё</button>
            <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1">К моим уловам</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-slate-800">Добавить улов</h1>
        <p className="text-slate-500 mt-0.5">Заполните данные об улове</p>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Fish type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Вид рыбы *</label>
            <div className="relative">
              <Fish size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <select required value={form.fish_type} onChange={set('fish_type')}
                className="input-field pl-10 appearance-none">
                <option value="">Выберите вид рыбы</option>
                {FISH_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Вес (кг) *</label>
              <div className="relative">
                <Weight size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" step="0.1" min="0.1" required value={form.weight_kg}
                  onChange={set('weight_kg')} placeholder="10.5" className="input-field pl-10" />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Цена за кг (₸)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" step="50" min="0" value={form.price_per_kg}
                  onChange={set('price_per_kg')} placeholder="1500" className="input-field pl-10" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Место вылова *</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" required value={form.location} onChange={set('location')}
                placeholder="Балхаш, северный берег" className="input-field pl-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Дата вылова *</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="date" required value={form.catch_date} onChange={set('catch_date')}
                  max={today} className="input-field pl-10" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Телефон *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" required value={form.phone} onChange={set('phone')}
                  placeholder="+7 777 000 00 00" className="input-field pl-10" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Описание</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <textarea value={form.description} onChange={set('description')} rows={3}
                placeholder="Свежий, охлаждённый. Пойман сегодня утром..."
                className="input-field pl-10 resize-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Отмена</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Сохранение...' : 'Сохранить улов'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
