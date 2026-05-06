import { Link } from 'react-router-dom';
import { useState } from 'react';
import { HiHeart, HiOutlineHeart, HiStar, HiShoppingCart } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToastCtx } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product, delay = 0 }) => {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { show } = useToastCtx();
  const [imgLoaded, setImgLoaded] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    show(`${product.name} added to cart!`, 'success');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    show(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', wishlisted ? 'info' : 'success');
  };

  return (
    <div
      className="animate-fadeInUp opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-[400ms] cubic-bezier-custom hover:-translate-y-1.5 relative">
          {/* Image */}
          <div className="relative overflow-hidden aspect-square bg-gray-50">
            {!imgLoaded && (
              <div className="absolute inset-0 shimmer-bg animate-shimmer rounded-2xl" />
            )}
            <img
              src={product.images?.[0]}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => { setImgLoaded(true); e.target.src = 'https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image'; }}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-accent text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
            )}
            {product.stock === 0 && (
              <span className="absolute top-3 left-3 bg-gray-800 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">Out of Stock</span>
            )}
            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200"
            >
              {wishlisted ? <HiHeart className="w-4 h-4 text-red-500" /> : <HiOutlineHeart className="w-4 h-4 text-gray-500" />}
            </button>
            {/* Slide-up cart button */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-3 bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-accent hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-accent font-medium uppercase tracking-wide mb-1 capitalize">{product.category.replace('-', ' ')}</p>
            <h3 className="font-semibold text-sm text-primary line-clamp-2 mb-2 leading-snug">{product.name}</h3>
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[1,2,3,4,5].map((s) => (
                  <HiStar key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.avgRating) ? 'text-accent' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-xs text-gray-500">({(product.reviewCount || 0).toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
