import { useLocation, Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      {/* Animated checkmark */}
      <div className="w-24 h-24 mx-auto mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="6" className="animate-fadeIn opacity-0" style={{ animationFillMode: 'forwards' }} />
          <polyline points="25,50 43,68 75,35" fill="none" stroke="#10B981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="100" strokeDashoffset="100" className="animate-drawCheck" style={{ animationFillMode: 'forwards', animationDelay: '300ms' }} />
        </svg>
      </div>

      <h1 className="font-heading text-4xl font-bold text-primary mb-3 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>
        Order Placed! 🎉
      </h1>
      <p className="text-gray-500 mb-2 animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>
        Thank you for your purchase. We'll send a confirmation to your email.
      </p>

      {order && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 my-8 text-left animate-fadeInUp opacity-0 animate-delay-240" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Order Number</p>
              <p className="font-heading font-bold text-xl text-primary">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Estimated Delivery</p>
              <p className="font-semibold text-success">{formatDate(order.estimatedDelivery)}</p>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
            <span>Total Paid</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeInUp opacity-0 animate-delay-360" style={{ animationFillMode: 'forwards' }}>
        <Link to="/products" className="group inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-2xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-300">
          Continue Shopping
        </Link>
        <Link to="/account/orders" className="inline-flex items-center gap-2 border border-gray-200 text-primary font-medium px-6 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-200">
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
