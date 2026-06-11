import { useState, useEffect } from 'react'
import api from '../api/client'
import CatchCard from '../components/CatchCard'
import { Search, Fish, SlidersHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'

const FISH_TYPES = ['', 'Карп', 'Судак', 'Сазан', 'Щука', 'Сом', 'Лещ', 'Окунь', 'Форель', 'Осётр', 'Белуга']

export default function Market() {
  const [catches, setCatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [fishFilter, setFishFilter] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ status: 'available' })
      if (fishFilter) params.append('fish_type', fishFilter)
      const { data } = await api.get(`/catches/?${params}`)
      setCatches(data)
    } catch {
      toast.error('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [fishFilter])

  const filtered = catches.filter(c =>
    !search ||
    c.fish_type.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase()) ||
    c.owner?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-slate-800">Рынок рыбы</h1>
        <p className="text-slate-500 mt-0.5">Свежие уловы от рыбаков Казахстана</p>
      </div>

      {/* Search & filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по виду, месту, рыбаку..."
            className="input-field pl-10"
          />
        </div>
        <div className="relative sm:w-52">
          <Fish size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
          <select value={fishFilter} onChange={e => setFishFilter(e.target.value)}
            className="input-field pl-10 appearance-none">
            <option value="">Все виды рыбы</option>
            {FISH_TYPES.filter(Boolean).map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-slate-500 mb-4">
          Найдено: <span className="font-semibold text-slate-700">{filtered.length}</span> уловов
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card h-56 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Fish size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium text-lg">Уловы не найдены</p>
          <p className="text-slate-400 text-sm mt-1">Попробуйте изменить фильтры</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(c => <CatchCard key={c.id} catch={c} />)}
        </div>
      )}
    </div>
  )
}
