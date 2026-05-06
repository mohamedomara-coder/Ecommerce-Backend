import { useState, useMemo } from 'react';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { useOrders } from '../../context/OrderContext';
import { useToastCtx } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = { pending: 'bg-amber-100 text-amber-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

const OrderList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const { orders, updateOrderStatus } = useOrders();
  const { show } = useToastCtx();

  const filteredOrders = useMemo(() => {
    let result = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (filter !== 'all') {
      result = result.filter(o => o.status === filter);
    }
    return result;
  }, [orders, filter]);

  const handleStatusChange = (id, status) => {
    updateOrderStatus(id, status);
    show(`Order status updated to ${status}!`, 'success');
  };

  const tabs = ['all', ...statuses];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <AdminHeader title="Orders" onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-gray-500 text-sm mt-1">Manage and track your {orders.length} orders</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tabs.map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                    filter === t 
                      ? 'bg-amber-500 text-[#0F172A] shadow-md shadow-amber-500/20' 
                      : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-primary">{o.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">{o.shipping?.name}</p>
                        <p className="text-xs text-gray-500">{o.shipping?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{formatPrice(o.total)}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={o.status} 
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border-0 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer capitalize ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s} className="bg-white text-gray-800 font-medium capitalize">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                        No orders found for the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 text-xs font-semibold text-gray-500 bg-slate-50 text-right">
              Showing {filteredOrders.length} orders
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderList;
