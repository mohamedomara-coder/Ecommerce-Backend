import { LuSearch, LuBell, LuMenu } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ title, onMenuClick }) => {
  const { currentUser } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-primary focus:outline-none">
          <LuMenu className="w-6 h-6" />
        </button>
        <h1 className="font-heading text-2xl font-bold text-primary">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative hidden md:block">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all w-64 outline-none"
          />
        </div>
        
        <button className="relative text-gray-400 hover:text-primary transition-colors">
          <LuBell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-100 pl-4 sm:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-primary leading-tight">{currentUser?.name || 'Admin'}</p>
            <p className="text-[11px] text-gray-500">Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-amber-500 text-[#0F172A] flex items-center justify-center font-bold shadow-sm">
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
