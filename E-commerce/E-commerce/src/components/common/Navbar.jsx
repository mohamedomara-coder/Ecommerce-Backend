import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineUser, HiOutlineSearch, HiOutlineMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useScrollY } from '../../hooks/useScrollY';
import { categories } from '../../data/categories';

const Navbar = () => {
  const { itemCount } = useCart();
  const { currentUser, logout, isAdmin } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const scrollY = useScrollY();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isScrolled = scrollY > 20;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { label: 'Categories', isDropdown: true },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-accent font-heading font-bold text-sm">S</span>
              </div>
              <span className="font-heading font-bold text-xl text-primary">ShopLux</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                link.isDropdown ? (
                  <div key={link.label} className="relative group">
                    <button className="relative text-sm font-medium transition-colors duration-200 text-primary hover:text-accent flex items-center gap-1 py-2">
                      {link.label}
                      <HiChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                      <span className="absolute bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 w-0 group-hover:w-full" />
                    </button>
                    <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 grid grid-cols-1 gap-1">
                        {categories.map((c) => (
                          <Link key={c.slug} to={`/category/${c.slug}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                            <img src={c.image} alt={c.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-primary">{c.name}</p>
                              <p className="text-xs text-gray-400">{c.productCount} products</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative text-sm font-medium transition-colors duration-200 group py-2 ${location.pathname === link.to ? 'text-accent' : 'text-primary hover:text-accent'}`}
                  >
                    {link.label}
                    <span className={`absolute bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                )
              ))}
            </nav>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-4 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200 focus:-translate-y-px"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors">
                  <HiOutlineSearch className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/account/wishlist" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors group">
                <HiOutlineHeart className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistItems.length}</span>
                )}
              </Link>

              <Link to="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors group">
                <HiOutlineShoppingCart className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounceBadge">{itemCount}</span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors group flex items-center gap-1"
                >
                  <HiOutlineUser className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                  {currentUser && <span className="hidden sm:block text-xs font-medium text-primary max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-scaleIn z-50">
                    {currentUser ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-50">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-semibold text-primary truncate">{currentUser.email}</p>
                        </div>
                        <Link to="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">My Orders</Link>
                        <Link to="/account/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">Wishlist</Link>
                        <Link to="/account/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">Profile</Link>
                        {isAdmin && <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-accent font-medium hover:bg-gray-50 transition-colors">Admin Panel</Link>}
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-gray-50 transition-colors border-t border-gray-50 mt-1">Sign Out</button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">Sign In</Link>
                        <Link to="/register" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent hover:bg-gray-50 transition-colors">Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <HiOutlineMenu className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50 animate-fadeIn" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-fadeInUp flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-heading font-bold text-lg text-primary">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-4 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><HiOutlineSearch className="w-4 h-4" /></button>
              </div>
            </form>
            <nav className="flex-1 px-4 space-y-1">
              {navLinks.map((link) => (
                link.isDropdown ? (
                  <div key={link.label} className="py-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{link.label}</p>
                    <div className="space-y-1 pl-4 border-l-2 border-gray-100 ml-4">
                      {categories.map((c) => (
                        <Link key={c.slug} to={`/category/${c.slug}`} onClick={() => setMobileOpen(false)}
                          className={`block px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === `/category/${c.slug}` ? 'bg-accent/10 text-accent' : 'hover:bg-gray-50 text-gray-600'}`}>
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={link.to || link.label} to={link.to || '#'} onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.to ? 'bg-accent/10 text-accent' : 'hover:bg-gray-50'}`}>
                    {link.label}
                  </Link>
                )
              ))}
              <hr className="my-2 border-gray-100" />
              {currentUser ? (
                <>
                  <Link to="/account/orders" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm hover:bg-gray-50">My Orders</Link>
                  <Link to="/account/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm hover:bg-gray-50">Profile</Link>
                  {isAdmin && <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-accent font-medium hover:bg-gray-50">Admin Panel</Link>}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-sm text-danger hover:bg-gray-50">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm hover:bg-gray-50">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-accent font-medium hover:bg-gray-50">Create Account</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;
