import { Link } from 'react-router-dom'
import { MapPin, Calendar, Weight, Phone, User } from 'lucide-react'

const FISH_EMOJI = {
  'Карп': '🐟', 'Судак': '🐠', 'Сазан': '🐡', 'Щука': '🦈',
  'Сом': '🐟', 'Лещ': '🐠', 'Окунь': '🐡', 'Форель': '🐟',
  'Осётр': '🐟', 'Белуга': '🐟',
}

const statusConfig = {
  available: { label: 'Доступен', className: 'bg-tide-100 text-tide-700' },
  sold:      { label: 'Продан',   className: 'bg-slate-100 text-slate-500' },
}

export default function CatchCard({ catch: c }) {
  const emoji = FISH_EMOJI[c.fish_type] || '🐟'
  const st = statusConfig[c.status] || statusConfig.available

  return (
    <Link to={`/catch/${c.id}`} className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-ocean-600 to-ocean-800 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h3 className="font-display font-bold text-white text-lg leading-tight">{c.fish_type}</h3>
            <span className={`badge mt-0.5 ${st.className}`}>{st.label}</span>
          </div>
        </div>
        {c.price_per_kg && (
          <div className="text-right">
            <p className="text-white/70 text-xs">за кг</p>
            <p className="text-white font-bold text-lg">{c.price_per_kg} ₸</p>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 space-y-2.5">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Weight size={14} className="text-ocean-500 shrink-0" />
          <span><span className="font-semibold text-slate-800">{c.weight_kg} кг</span></span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin size={14} className="text-ocean-500 shrink-0" />
          <span className="truncate">{c.location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={14} className="text-ocean-500 shrink-0" />
          <span>{c.catch_date}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <User size={14} className="text-ocean-500 shrink-0" />
          <span className="truncate">{c.owner?.full_name}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 text-ocean-600 text-sm font-medium border-t border-slate-100 pt-3">
          <Phone size={14} />
          {c.phone}
        </div>
      </div>
    </Link>
  )
}
