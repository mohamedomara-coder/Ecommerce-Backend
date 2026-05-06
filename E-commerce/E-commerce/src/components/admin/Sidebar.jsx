import { NavLink, useNavigate } from 'react-router-dom';
import { LuLayoutDashboard, LuShoppingBag, LuClipboardList, LuUsers, LuChartBar, LuSettings, LuLogOut, LuX } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin/dashboard', icon: LuLayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: LuShoppingBag, label: 'Products' },
  { to: '/admin/orders', icon: LuClipboardList, label: 'Orders' },
  { to: '/admin/customers', icon: LuUsers, label: 'Customers' },
  { to: '/admin/analytics', icon: LuChartBar, label: 'Analytics' },
  { to: '/admin/settings', icon: LuSettings, label: 'Settings' },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      
      <aside className={`w-64 bg-[#0F172A] text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-[#0F172A] font-heading font-bold text-sm">S</span>
            </div>
            <div>
              <span className="font-heading font-bold text-lg">ShopLux</span>
              <p className="text-[10px] text-amber-500 uppercase tracking-wider font-semibold">Admin</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <LuX className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-[#0F172A] font-semibold shadow-lg shadow-amber-500/25' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-[#0F172A] flex items-center justify-center text-xs font-bold">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-white">{currentUser?.name || 'Admin'}</p>
              <p className="text-[11px] text-slate-400 truncate">{currentUser?.email || 'admin@store.com'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all">
            <LuLogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
