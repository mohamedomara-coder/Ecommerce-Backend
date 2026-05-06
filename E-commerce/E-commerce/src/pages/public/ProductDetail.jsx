import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { HiHeart, HiOutlineHeart, HiShoppingCart, HiStar, HiArrowLeft } from 'react-icons/hi';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToastCtx } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import StarRating from '../../components/common/StarRating';

const ProductDetail = () => {
  const { id } = useParams();
  const { getProduct, addReview } = useProducts();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const { show } = useToastCtx();

  const product = getProduct(id);
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [reviewScore, setReviewScore] = useState(0);
  const [reviewText, setReviewText] = useState('');

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">😕</p>
      <h2 className="font-heading text-2xl font-bold mb-4">Product not found</h2>
      <Link to="/products" className="text-accent font-semibold hover:underline">← Back to Products</Link>
    </div>
  );

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    show(`${product.name} added to cart!`, 'success');
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!reviewScore) { show('Please select a star rating.', 'error'); return; }
    addReview(product.id, { userId: currentUser.id, score: reviewScore, review: reviewText, date: new Date().toISOString().split('T')[0], name: currentUser.name });
    show('Review submitted!', 'success');
    setReviewScore(0); setReviewText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors mb-8">
        <HiArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square mb-3 group">
            <img src={product.images[mainImg]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            {discount > 0 && <span className="absolute top-4 left-4 bg-accent text-primary text-sm font-bold px-3 py-1 rounded-full">-{discount}%</span>}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setMainImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${mainImg === i ? 'border-accent' : 'border-transparent hover:border-gray-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-3 capitalize">
            {product.category.replace('-', ' ')}
          </span>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-4 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <StarRating value={Math.round(product.avgRating)} readonly />
            <span className="text-sm text-gray-500">{product.avgRating} ({product.reviewCount.toLocaleString()} reviews)</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl font-heading font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
            {discount > 0 && <span className="text-success text-sm font-semibold">Save {formatPrice(product.originalPrice - product.price)}</span>}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {/* Qty */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 hover:bg-gray-50 transition-colors active:scale-95 text-lg font-medium">−</button>
              <span className="px-5 py-2 text-sm font-semibold border-x border-gray-200">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="px-4 py-2 hover:bg-gray-50 transition-colors active:scale-95 text-lg font-medium">+</button>
            </div>
            <span className="text-xs text-gray-400">{product.stock} in stock</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="group flex-1 flex items-center justify-center gap-3 bg-primary text-white font-semibold px-8 py-4 rounded-2xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-300 disabled:opacity-50">
              <HiShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button onClick={() => { toggleWishlist(product); show(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', 'success'); }}
              className="p-4 rounded-2xl border border-gray-200 hover:border-red-300 transition-all duration-200 hover:bg-red-50">
              {wishlisted ? <HiHeart className="w-6 h-6 text-red-500" /> : <HiOutlineHeart className="w-6 h-6 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="animate-fadeInUp opacity-0 animate-delay-240" style={{ animationFillMode: 'forwards' }}>
        <div className="flex gap-1 border-b border-gray-100 mb-8">
          {['description', 'specs', 'reviews'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-all duration-200 relative ${tab === t ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
              {t} {t === 'reviews' && `(${product.ratings.length})`}
              {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
            </button>
          ))}
        </div>

        {tab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2 h-2 bg-accent rounded-full" /> Premium quality materials</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2 h-2 bg-accent rounded-full" /> 1-year manufacturer warranty</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2 h-2 bg-accent rounded-full" /> Free shipping on orders over $50</li>
            </ul>
          </div>
        )}

        {tab === 'specs' && (
          <div className="bg-gray-50 rounded-2xl p-6">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                {[['Category', product.category.replace('-', ' ')], ['Stock', `${product.stock} units`], ['Average Rating', `${product.avgRating} / 5`], ['Total Reviews', product.reviewCount], ['Price', formatPrice(product.price)]].map(([k, v]) => (
                  <tr key={k}>
                    <td className="py-3 pr-8 text-sm text-gray-500 font-medium w-40 capitalize">{k}</td>
                    <td className="py-3 text-sm text-primary capitalize">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'reviews' && (
          <div>
            <div className="space-y-4 mb-10">
              {product.ratings.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
              ) : product.ratings.map((r, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-primary">{r.name || 'Customer'}</p>
                      <StarRating value={r.score} readonly size="sm" />
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(r.date)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{r.review}</p>
                </div>
              ))}
            </div>

            {currentUser ? (
              <form onSubmit={handleReview} className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-lg mb-4">Write a Review</h3>
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Your Rating</label>
                  <StarRating value={reviewScore} onChange={setReviewScore} size="lg" />
                </div>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product…" rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all resize-none mb-4" />
                <button type="submit" className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-200">
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <p className="text-gray-600 mb-3">Please sign in to write a review.</p>
                <Link to="/login" className="text-accent font-semibold hover:underline">Sign In →</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
