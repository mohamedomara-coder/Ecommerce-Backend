import { Link } from 'react-router-dom';
import { HiHeart, HiShoppingCart } from 'react-icons/hi';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToastCtx } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToastCtx();

  if (items.length === 0) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <HiHeart className="w-12 h-12 text-red-200" />
      </div>
      <h2 className="font-heading text-3xl font-bold text-primary mb-3">Your wishlist is empty</h2>
      <p className="text-gray-500 mb-8">Save items you love for later.</p>
      <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-2xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-300">
        Discover Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-4xl font-bold text-primary mb-8 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>
        My Wishlist <span className="text-gray-400 font-normal text-2xl">({items.length})</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-fadeInUp opacity-0 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}>
            <Link to={`/products/${item.id}`} className="block aspect-square overflow-hidden bg-gray-50">
              <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </Link>
            <div className="p-4">
              <Link to={`/products/${item.id}`} className="font-semibold text-sm text-primary hover:text-accent transition-colors line-clamp-2 leading-snug block mb-1">{item.name}</Link>
              <p className="font-bold text-primary mb-3">{formatPrice(item.price)}</p>
              <div className="flex gap-2">
                <button onClick={() => { addItem(item); show(`${item.name} added to cart!`, 'success'); }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-200">
                  <HiShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button onClick={() => removeFromWishlist(item.id)}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-danger hover:border-red-200 hover:bg-red-50 transition-all duration-200">
                  <HiHeart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
