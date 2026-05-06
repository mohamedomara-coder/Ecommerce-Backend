import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-primary font-heading font-bold text-sm">S</span>
              </div>
              <span className="font-heading font-bold text-xl">ShopLux</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">Premium shopping experience with curated products from the world's best brands.</p>
            <div className="flex items-center gap-3">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-accent/20 hover:text-accent transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[['Electronics', '/category/electronics'], ['Clothing', '/category/clothing'], ['Home & Kitchen', '/category/home-kitchen'], ['Books', '/category/books'], ['Sports', '/category/sports']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 text-sm hover:text-accent transition-colors relative group">
                    {label}
                    <span className="absolute -bottom-0.5 left-0 h-px bg-accent w-0 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[['My Orders', '/account/orders'], ['Wishlist', '/account/wishlist'], ['Profile', '/account/profile'], ['Sign In', '/login'], ['Register', '/register']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 text-sm hover:text-accent transition-colors relative group">
                    {label}
                    <span className="absolute -bottom-0.5 left-0 h-px bg-accent w-0 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Get the latest deals and new arrivals directly to your inbox.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
              <button type="submit" className="px-4 py-2.5 bg-accent text-primary font-semibold text-sm rounded-xl hover:bg-amber-400 active:scale-[0.98] transition-all duration-200">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ShopLux. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Free Shipping Over $50</span>
            <span>·</span>
            <span>30-Day Returns</span>
            <span>·</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
