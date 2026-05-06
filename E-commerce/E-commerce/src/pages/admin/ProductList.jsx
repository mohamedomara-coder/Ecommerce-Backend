import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Modal from '../../components/common/Modal';
import { useProducts } from '../../context/ProductContext';
import { useToastCtx } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import { categories } from '../../data/categories';

const emptyForm = { name: '', price: '', originalPrice: '', category: 'electronics', description: '', stock: '', images: [''] };

const ProductList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { products, deleteProduct, addProduct, updateProduct } = useProducts();
  const { show } = useToastCtx();
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.includes(query.toLowerCase()));

  const openAdd = () => { setForm(emptyForm); setEditProduct(null); setShowAdd(true); };
  const openEdit = (p) => { setForm({ name: p.name, price: p.price, originalPrice: p.originalPrice || '', category: p.category, description: p.description, stock: p.stock, images: p.images }); setEditProduct(p); setShowAdd(true); };

  const handleSave = (e) => {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price), originalPrice: parseFloat(form.originalPrice) || null, stock: parseInt(form.stock) };
    if (editProduct) { updateProduct(editProduct.id, data); show('Product updated!', 'success'); }
    else { addProduct(data); show('Product added!', 'success'); }
    setShowAdd(false);
  };

  const handleDelete = () => { deleteProduct(deleteTarget.id); show('Product deleted.', 'info'); setDeleteTarget(null); };

  const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <AdminHeader title="Products" onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gray-500 text-sm mt-1">Manage your catalog of {products.length} products</p>
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 bg-amber-500 text-[#0F172A] font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/25">
              <HiPlus className="w-5 h-5" /> Add Product
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <input type="text" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-full max-w-xs px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50">
                {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                        <span className="text-sm font-medium text-primary line-clamp-1 max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">{p.category.replace('-', ' ')}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${p.stock === 0 ? 'text-danger' : p.stock < 10 ? 'text-amber-600' : 'text-success'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">⭐ {p.avgRating}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-danger hover:bg-red-50 rounded-lg transition-colors"><HiTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 text-xs font-semibold text-gray-500 bg-slate-50 text-right">
            Showing {filtered.length} of {products.length} products
          </div>
        </div>
      </main>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={editProduct ? 'Edit Product' : 'Add New Product'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="text-xs font-medium text-gray-600 mb-1 block">Product Name</label>
            <input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Price ($)</label>
              <input required type="number" step="0.01" className={inputCls} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Original Price ($)</label>
              <input type="number" step="0.01" className={inputCls} value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Category</label>
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Stock</label>
              <input required type="number" className={inputCls} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
          </div>
          <div><label className="text-xs font-medium text-gray-600 mb-1 block">Image URL</label>
            <input className={inputCls} placeholder="https://images.unsplash.com/..." value={form.images[0]}
              onChange={(e) => setForm({ ...form, images: [e.target.value] })} /></div>
          <div><label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
            <textarea rows={3} className={inputCls + ' resize-none'} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          {form.images[0] && <img src={form.images[0]} alt="preview" className="w-full h-40 object-cover rounded-xl" />}
          <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all">
            {editProduct ? 'Save Changes' : 'Add Product'}
          </button>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleDelete} className="flex-1 bg-danger text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 active:scale-[0.98] transition-all">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;
