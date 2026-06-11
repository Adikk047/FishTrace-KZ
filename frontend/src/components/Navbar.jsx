import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Fish, LayoutDashboard, PlusCircle, ShoppingBag, Shield, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const roleLabels = { fisher: 'Рыбак', buyer: 'Покупатель', inspector: 'Инспектор' }
const roleBadgeColors = {
  fisher:    'bg-ocean-100 text-ocean-700',
  buyer:     'bg-tide-100 text-tide-700',
  inspector: 'bg-amber-100 text-amber-700',
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const links = [
    { to: '/dashboard', label: 'Главная', icon: LayoutDashboard, roles: ['fisher', 'buyer', 'inspector'] },
    { to: '/market', label: 'Рынок', icon: ShoppingBag, roles: ['fisher', 'buyer', 'inspector'] },
    { to: '/add-catch', label: 'Добавить улов', icon: PlusCircle, roles: ['fisher'] },
    { to: '/admin', label: 'Панель', icon: Shield, roles: ['inspector'] },
  ]

  const visibleLinks = links.filter(l => l.roles.includes(user?.role))

  const NavLink = ({ link }) => (
    <Link
      to={link.to}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        location.pathname === link.to
          ? 'bg-ocean-600 text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <link.icon size={16} />
      {link.label}
    </Link>
  )

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 font-display font-bold text-ocean-700 text-xl">
            <div className="w-8 h-8 bg-ocean-600 rounded-lg flex items-center justify-center">
              <Fish size={18} className="text-white" />
            </div>
            FishTrace KZ
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {visibleLinks.map(l => <NavLink key={l.to} link={l} />)}
            </div>
          )}

          {/* Right side */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{user.full_name}</p>
                <span className={`badge text-xs ${roleBadgeColors[user.role]}`}>
                  {roleLabels[user.role]}
                </span>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Выйти">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="btn-secondary text-sm py-2">Войти</Link>
              <Link to="/register" className="btn-primary text-sm py-2">Регистрация</Link>
            </div>
          )}

          {/* Mobile burger */}
          <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-9 h-9 bg-ocean-100 rounded-full flex items-center justify-center">
                  <span className="text-ocean-700 font-bold text-sm">{user.full_name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{user.full_name}</p>
                  <span className={`badge text-xs ${roleBadgeColors[user.role]}`}>{roleLabels[user.role]}</span>
                </div>
              </div>
              {visibleLinks.map(l => <NavLink key={l.to} link={l} />)}
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={16} /> Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">Войти</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-medium text-ocean-600 hover:bg-ocean-50 rounded-lg">Регистрация</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
