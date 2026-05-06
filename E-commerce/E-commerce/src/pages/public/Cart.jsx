import { Link } from 'react-router-dom';
import { HiTrash, HiShoppingBag } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';

const Cart = () => {
  const { items, removeItem, updateQty, total, clearCart } = useCart();

  if (items.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <HiShoppingBag className="w-12 h-12 text-gray-300" />
      </div>
      <h2 className="font-heading text-3xl font-bold text-primary mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
      <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-2xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-300">
        Start Shopping
      </Link>
    </div>
  );

  const shipping = total >= 50 ? 0 : 9.99;
  const grandTotal = total + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-4xl font-bold text-primary mb-8 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 animate-fadeInUp opacity-0" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}>
              <Link to={`/products/${item.id}`} className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-50">
                <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`} className="font-semibold text-primary text-sm hover:text-accent transition-colors line-clamp-2 leading-snug">{item.name}</Link>
                <p className="text-xs text-gray-400 capitalize mt-0.5">{item.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-3 py-1.5 hover:bg-gray-50 active:scale-95 transition-all text-sm font-medium">−</button>
                    <span className="px-4 py-1.5 text-sm font-semibold border-x border-gray-200">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-3 py-1.5 hover:bg-gray-50 active:scale-95 transition-all text-sm font-medium">+</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">{formatPrice(item.price * item.qty)}</span>
                    <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-all duration-200">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-gray-400 hover:text-danger transition-colors mt-2 flex items-center gap-1.5">
            <HiTrash className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        {/* Summary */}
        <div className="animate-fadeInUp opacity-0 animate-delay-240" style={{ animationFillMode: 'forwards' }}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-heading font-semibold text-xl mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span><span className="font-medium">{formatPrice(total)}</span></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? 'text-success font-medium' : 'font-medium'}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && <p className="text-xs text-gray-400">Add {formatPrice(50 - total)} more for free shipping</p>}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span><span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <Link to="/checkout" className="block w-full text-center bg-primary text-white font-semibold py-4 rounded-2xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-300">
              Proceed to Checkout
            </Link>
            <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-accent transition-colors mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
