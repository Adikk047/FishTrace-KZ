import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import CatchCard from '../components/CatchCard'
import { PlusCircle, Fish, TrendingUp, Package, ShoppingBag, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuth()
  const [catches, setCatches] = useState([])
  const [loading, setLoading] = useState(true)

  const isFisher = user?.role === 'fisher'
  const isBuyer  = user?.role === 'buyer'

  const load = async () => {
    try {
      const endpoint = isFisher ? '/catches/my/list' : '/catches/?status=available'
      const { data } = await api.get(endpoint)
      setCatches(data)
    } catch {
      toast.error('Не удалось загрузить данные')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Удалить запись?')) return
    try {
      await api.delete(`/catches/${id}`)
      toast.success('Удалено')
      load()
    } catch {
      toast.error('Ошибка удаления')
    }
  }

  const stats = isFisher ? [
    { label: 'Всего уловов', value: catches.length, icon: Fish, color: 'text-ocean-600 bg-ocean-100' },
    { label: 'Доступных', value: catches.filter(c => c.status === 'available').length, icon: Package, color: 'text-tide-600 bg-tide-100' },
    { label: 'Продано', value: catches.filter(c => c.status === 'sold').length, icon: TrendingUp, color: 'text-amber-600 bg-amber-100' },
  ] : [
    { label: 'Уловов на рынке', value: catches.length, icon: ShoppingBag, color: 'text-ocean-600 bg-ocean-100' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-800">
            {isFisher ? 'Мои уловы' : isBuyer ? 'Доступная рыба' : 'Обзор'}
          </h1>
          <p className="text-slate-500 mt-0.5">
            {isFisher ? 'Управляйте своими записями' : 'Свежие уловы от рыбаков Казахстана'}
          </p>
        </div>
        {isFisher && (
          <Link to="/add-catch" className="btn-primary flex items-center gap-2 self-start">
            <PlusCircle size={18} /> Добавить улов
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-slate-800">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => (
            <div key={i} className="card h-56 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : catches.length === 0 ? (
        <div className="text-center py-20">
          <Fish size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium text-lg">
            {isFisher ? 'Ещё нет уловов' : 'Уловы не найдены'}
          </p>
          {isFisher && (
            <Link to="/add-catch" className="btn-primary inline-flex items-center gap-2 mt-4">
              <PlusCircle size={16} /> Добавить первый улов
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {catches.map(c => (
            <div key={c.id} className="relative group">
              <CatchCard catch={c} />
              {isFisher && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  title="Удалить">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
