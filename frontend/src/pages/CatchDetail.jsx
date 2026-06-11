import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { MapPin, Calendar, Weight, Phone, User, ArrowLeft, QrCode, Tag, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const statusConfig = {
  available: { label: 'Доступен', className: 'bg-tide-100 text-tide-700' },
  sold:      { label: 'Продан',   className: 'bg-slate-100 text-slate-500' },
}

export default function CatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [catch_, setCatch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/catches/${id}`)
      .then(({ data }) => setCatch(data))
      .catch(() => toast.error('Улов не найден'))
      .finally(() => setLoading(false))
  }, [id])

  const markSold = async () => {
    try {
      const { data } = await api.put(`/catches/${id}`, { status: 'sold' })
      setCatch(data)
      toast.success('Статус обновлён')
    } catch {
      toast.error('Ошибка')
    }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="card h-96 animate-pulse bg-slate-100" />
    </div>
  )

  if (!catch_) return (
    <div className="text-center py-20">
      <p className="text-slate-400 text-lg">Улов не найден</p>
      <button onClick={() => navigate(-1)} className="btn-secondary mt-4">Назад</button>
    </div>
  )

  const st = statusConfig[catch_.status] || statusConfig.available
  const isOwner = user?.id === catch_.owner_id

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft size={18} /> Назад
      </button>

      <div className="card overflow-visible">
        {/* Hero */}
        <div className="bg-gradient-to-br from-ocean-600 to-ocean-900 px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <span className={`badge mb-3 ${st.className}`}>{st.label}</span>
              <h1 className="font-display font-bold text-white text-3xl">{catch_.fish_type}</h1>
              <p className="text-ocean-300 mt-1">{catch_.location}</p>
            </div>
            <div className="text-right">
              {catch_.price_per_kg ? (
                <div>
                  <p className="text-ocean-300 text-sm">за кг</p>
                  <p className="text-white font-bold text-3xl">{catch_.price_per_kg} ₸</p>
                  <p className="text-ocean-200 text-sm mt-1">
                    Итого: {(catch_.price_per_kg * catch_.weight_kg).toLocaleString()} ₸
                  </p>
                </div>
              ) : (
                <span className="text-ocean-300 text-sm">Цена не указана</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Weight, label: 'Вес', value: `${catch_.weight_kg} кг` },
              { icon: Calendar, label: 'Дата вылова', value: catch_.catch_date },
              { icon: MapPin, label: 'Место', value: catch_.location },
              { icon: User, label: 'Рыбак', value: catch_.owner?.full_name },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-ocean-600 mb-1">
                  <item.icon size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</span>
                </div>
                <p className="font-semibold text-slate-800 text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {catch_.description && (
            <div className="bg-ocean-50 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Описание</p>
              <p className="text-slate-700 text-sm">{catch_.description}</p>
            </div>
          )}

          {/* QR */}
          <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center">
            <QrCode size={20} className="text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500 mb-3">QR-код для этого улова</p>
            <img
              src={`/qr_codes/catch_${catch_.id}.png`}
              alt="QR"
              className="w-32 h-32 mx-auto rounded-lg"
              onError={e => { e.target.parentElement.style.display = 'none' }}
            />
          </div>

          {/* Contact */}
          <a href={`tel:${catch_.phone}`}
            className="flex items-center justify-center gap-3 bg-tide-600 hover:bg-tide-700 text-white font-semibold py-3.5 rounded-xl transition-colors">
            <MessageCircle size={20} />
            Связаться: {catch_.phone}
          </a>

          {/* Owner actions */}
          {isOwner && catch_.status === 'available' && (
            <button onClick={markSold} className="w-full btn-secondary text-sm">
              Отметить как продано
            </button>
          )}

          <p className="text-center text-xs text-slate-400">
            ID улова: #{catch_.id} · Добавлено: {new Date(catch_.created_at).toLocaleDateString('ru-RU')}
          </p>
        </div>
      </div>
    </div>
  )
}
