import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { Search, Filter, Fish, MapPin, Calendar, Phone, User, Eye, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'

const FISH_TYPES = ['', 'Карп', 'Судак', 'Сазан', 'Щука', 'Сом', 'Лещ', 'Окунь', 'Форель', 'Осётр', 'Белуга']
const statusConfig = {
  available: { label: 'Доступен', className: 'bg-tide-100 text-tide-700' },
  sold:      { label: 'Продан',   className: 'bg-slate-100 text-slate-500' },
}

export default function Admin() {
  const [catches, setCatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ fish_type: '', date_from: '', date_to: '', status: '' })

  const setF = (k) => (e) => setFilters({ ...filters, [k]: e.target.value })

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.fish_type) params.append('fish_type', filters.fish_type)
      if (filters.date_from) params.append('date_from', filters.date_from)
      if (filters.date_to)   params.append('date_to', filters.date_to)
      if (filters.status)    params.append('status', filters.status)
      const { data } = await api.get(`/catches/?${params}`)
      setCatches(data)
    } catch {
      toast.error('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filters])

  const totalWeight = catches.reduce((s, c) => s + c.weight_kg, 0).toFixed(1)
  const available   = catches.filter(c => c.status === 'available').length
  const sold        = catches.filter(c => c.status === 'sold').length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-slate-800">Панель инспектора</h1>
        <p className="text-slate-500 mt-0.5">Все зарегистрированные уловы</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Всего записей', value: catches.length, color: 'text-ocean-600 bg-ocean-100' },
          { label: 'Общий вес', value: `${totalWeight} кг`, color: 'text-purple-600 bg-purple-100' },
          { label: 'Доступных', value: available, color: 'text-tide-600 bg-tide-100' },
          { label: 'Продано', value: sold, color: 'text-amber-600 bg-amber-100' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color} mb-2`}>
              <BarChart3 size={18} />
            </div>
            <p className="font-display font-bold text-xl text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm mb-3">
          <Filter size={16} /> Фильтры
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Fish size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <select value={filters.fish_type} onChange={setF('fish_type')}
              className="input-field pl-9 text-sm appearance-none">
              <option value="">Все виды</option>
              {FISH_TYPES.filter(Boolean).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="relative">
            <select value={filters.status} onChange={setF('status')}
              className="input-field text-sm appearance-none">
              <option value="">Все статусы</option>
              <option value="available">Доступен</option>
              <option value="sold">Продан</option>
            </select>
          </div>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="date" value={filters.date_from} onChange={setF('date_from')}
              placeholder="Дата от" className="input-field pl-9 text-sm" />
          </div>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="date" value={filters.date_to} onChange={setF('date_to')}
              placeholder="Дата до" className="input-field pl-9 text-sm" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Загрузка...</div>
        ) : catches.length === 0 ? (
          <div className="p-12 text-center">
            <Fish size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">Записи не найдены</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['ID', 'Вид рыбы', 'Вес', 'Место', 'Дата', 'Рыбак', 'Телефон', 'Статус', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {catches.map(c => {
                const st = statusConfig[c.status] || statusConfig.available
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">#{c.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{c.fish_type}</td>
                    <td className="px-4 py-3 text-slate-600">{c.weight_kg} кг</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{c.location}</td>
                    <td className="px-4 py-3 text-slate-600">{c.catch_date}</td>
                    <td className="px-4 py-3 text-slate-600">{c.owner?.full_name}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{c.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${st.className}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/catch/${c.id}`}
                        className="p-1.5 text-slate-400 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors inline-flex"
                        title="Просмотр">
                        <Eye size={15} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
