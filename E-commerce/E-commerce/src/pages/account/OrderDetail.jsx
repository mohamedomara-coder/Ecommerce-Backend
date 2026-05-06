import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
const statusColors = { pending: 'bg-amber-100 text-amber-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-success/10 text-success' };

const OrderDetail = () => {
  const { id } = useParams();
  const { getOrder } = useOrders();
  const order = getOrder(id);

  if (!order) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <h2 className="font-heading text-2xl font-bold mb-4">Order not found</h2>
      <Link to="/account/orders" className="text-accent font-semibold hover:underline">← Back to Orders</Link>
    </div>
  );

  const stepIdx = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/account/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent transition-colors mb-8">
        ← Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">{order.id}</h1>
          <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusColors[order.status]}`}>{order.status}</span>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-heading font-semibold text-lg mb-6">Order Status</h2>
        <div className="flex items-center gap-0">
          {statusSteps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= stepIdx ? 'bg-success text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i <= stepIdx ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] capitalize font-medium ${i <= stepIdx ? 'text-success' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < stepIdx ? 'bg-success' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        {order.estimatedDelivery && <p className="text-sm text-gray-500 mt-4">Estimated delivery: <strong className="text-primary">{formatDate(order.estimatedDelivery)}</strong></p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-heading font-semibold text-lg mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-50" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty} × {formatPrice(item.price)}</p>
                </div>
                <span className="font-semibold text-sm">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between font-bold">
            <span>Total</span><span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-semibold mb-3">Shipping Address</h3>
            <p className="text-sm text-gray-600">{order.shipping?.name}</p>
            <p className="text-sm text-gray-600">{order.shipping?.address}</p>
            <p className="text-sm text-gray-600">{order.shipping?.city}</p>
            <p className="text-sm text-gray-600">{order.shipping?.phone}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-semibold mb-3">Payment</h3>
            <p className="text-sm text-gray-600">{order.payment?.method} ending in ••••{order.payment?.last4}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
