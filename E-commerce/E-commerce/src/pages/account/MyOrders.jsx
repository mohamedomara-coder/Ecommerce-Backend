import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const statusColors = { pending: 'bg-amber-100 text-amber-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-success/10 text-success' };

const MyOrders = () => {
  const { currentUser } = useAuth();
  const { getOrdersByUser } = useOrders();
  const orders = getOrdersByUser(currentUser?.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-4xl font-bold text-primary mb-8 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📦</p>
          <h3 className="font-heading text-xl font-semibold mb-2">No orders yet</h3>
          <Link to="/products" className="text-accent font-semibold hover:underline">Start Shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fadeInUp opacity-0"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-heading font-bold text-lg text-primary">{order.id}</p>
                  <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>{order.status}</span>
                  <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                {order.items.slice(0, 3).map((item) => (
                  <img key={item.productId} src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50" />
                ))}
                {order.items.length > 3 && <span className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">+{order.items.length - 3}</span>}
              </div>
              <Link to={`/account/orders/${order.id}`} className="text-sm text-accent font-semibold hover:underline">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
