import { useState } from 'react';
import { LuDollarSign, LuShoppingCart, LuUsers, LuPackage } from 'react-icons/lu';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const statusColors = { pending: 'bg-amber-100 text-amber-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { products } = useProducts();
  const { orders } = useOrders();
  const { allUsers } = useAuth();

  const revenue = orders.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // Category revenue for chart
  const catRevenue = {};
  orders.forEach((o) => o.items.forEach((item) => {
    const p = products.find((pr) => pr.id === item.productId);
    if (p) catRevenue[p.category] = (catRevenue[p.category] || 0) + item.price * item.qty;
  }));
  const maxCatRev = Math.max(...Object.values(catRevenue), 1);

  // Monthly orders (simplified — last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const count = orders.filter((o) => new Date(o.createdAt).getMonth() === d.getMonth()).length;
    return { month, count };
  });
  const maxCount = Math.max(...monthlyData.map((m) => m.count), 1);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <AdminHeader title="Dashboard" onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <LuDollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-heading text-2xl font-bold text-primary">{formatPrice(revenue)}</h3>
                  <span className="text-xs font-semibold text-green-600">+12%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <LuShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-heading text-2xl font-bold text-primary">{orders.length}</h3>
                  <span className="text-xs font-semibold text-green-600">+8%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <LuUsers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Customers</p>
                <h3 className="font-heading text-2xl font-bold text-primary">{allUsers.length}</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <LuPackage className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Products</p>
                <h3 className="font-heading text-2xl font-bold text-primary">{products.length}</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart (Mocked with 7 amber bars) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-lg text-primary">Revenue Overview</h2>
                <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">Last 7 Days</span>
              </div>
              <div className="flex items-end justify-between h-48 gap-2 mt-4">
                {[40, 70, 45, 90, 65, 85, 100].map((val, idx) => (
                  <div key={idx} className="group relative flex-1 flex flex-col items-center justify-end h-full">
                    <div className="absolute -top-8 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      ${(val * 12).toFixed(0)}
                    </div>
                    <div 
                      className="w-full max-w-[40px] bg-amber-100 rounded-t-md hover:bg-amber-400 transition-colors cursor-pointer"
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[10px] text-gray-400 mt-2">
                      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Revenue */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-heading font-semibold text-lg text-primary mb-6">Revenue by Category</h2>
              <div className="space-y-4">
                {Object.entries(catRevenue).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([cat, rev]) => (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize text-gray-600">{cat.replace('-', ' ')}</span>
                      <span className="text-sm font-bold text-primary">{formatPrice(rev)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${(rev / maxCatRev) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-heading font-semibold text-lg text-primary">Recent Orders</h2>
              <button className="text-sm font-semibold text-amber-500 hover:text-amber-600">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    {['Order ID', 'Customer', 'Date', 'Amount', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-primary">{o.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">{o.shipping?.name}</p>
                        <p className="text-xs text-gray-500">{o.shipping?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(o.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{formatPrice(o.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
