import { useState, useEffect } from 'react';
import { HiViewGrid, HiViewList, HiAdjustments, HiCheck } from 'react-icons/hi';
import { useProducts } from '../../context/ProductContext';
import { filterProducts } from '../../utils/filterProducts';
import { sortProducts } from '../../utils/sortProducts';
import ProductCard from '../../components/common/ProductCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import Pagination from '../../components/common/Pagination';
import { categories } from '../../data/categories';
import { formatPrice } from '../../utils/formatPrice';

const PER_PAGE = 12;

const Products = () => {
  const { products } = useProducts();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: '', minPrice: 0, maxPrice: 2000, minRating: 0, inStock: false });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = sortProducts(filterProducts(products, filters), sort);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const updateFilter = (key, val) => { setFilters((f) => ({ ...f, [key]: val })); setPage(1); };

  const FilterPanel = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-6">
      <div>
        <h3 className="font-heading font-semibold text-sm uppercase tracking-wide text-gray-500 mb-4">Category</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0">
              <input type="radio" name="cat" checked={filters.category === ''} onChange={() => updateFilter('category', '')} className="sr-only" />
              <div className={`w-full h-full rounded-full border-2 transition-all duration-200 ${filters.category === '' ? 'border-amber-500 bg-amber-500' : 'border-gray-300 group-hover:border-amber-400'}`}></div>
              {filters.category === '' && <div className="absolute w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <span className="text-sm font-medium text-gray-700">All Categories</span>
          </label>
          {categories.map((c) => (
            <label key={c.slug} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0">
                <input type="radio" name="cat" checked={filters.category === c.slug} onChange={() => updateFilter('category', c.slug)} className="sr-only" />
                <div className={`w-full h-full rounded-full border-2 transition-all duration-200 ${filters.category === c.slug ? 'border-amber-500 bg-amber-500' : 'border-gray-300 group-hover:border-amber-400'}`}></div>
                {filters.category === c.slug && <div className="absolute w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <span className="text-sm font-medium text-gray-700">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="font-heading font-semibold text-sm uppercase tracking-wide text-gray-500 mb-3 flex items-center justify-between">
          Price Range <span className="text-amber-500 normal-case font-bold">Up to {formatPrice(filters.maxPrice)}</span>
        </h3>
        <input type="range" min={0} max={2000} step={1} value={filters.maxPrice} onInput={(e) => updateFilter('maxPrice', +e.target.value)}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-grab active:cursor-grabbing focus:outline-none focus:ring-0
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-none
          [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-none"
          style={{ touchAction: 'none', willChange: 'transform' }} />
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="font-heading font-semibold text-sm uppercase tracking-wide text-gray-500 mb-3">Min Rating</h3>
        <div className="grid grid-cols-4 gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => updateFilter('minRating', r)}
              className={`py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${filters.minRating === r ? 'bg-[#0A1628] text-white border-[#0A1628]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0A1628]'}`}>
              {r === 0 ? 'All' : `${r}★`}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0">
          <input type="checkbox" checked={filters.inStock} onChange={(e) => updateFilter('inStock', e.target.checked)} className="sr-only" />
          <div className={`w-full h-full rounded-md border-2 transition-all duration-200 ${filters.inStock ? 'border-amber-500 bg-amber-500' : 'border-gray-300 group-hover:border-amber-400'}`}></div>
          {filters.inStock && <HiCheck className="absolute w-3.5 h-3.5 text-white" />}
        </div>
        <span className="text-sm font-medium text-gray-700">In Stock Only</span>
      </label>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-primary mb-2 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>All Products</h1>
        <p className="text-gray-500 animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>Discover our curated collection</p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0 sticky top-24 self-start">
          <FilterPanel />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Topbar */}
          <div className="flex items-center justify-between gap-4 mb-6 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-1.5 text-sm font-medium border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50">
                <HiAdjustments className="w-4 h-4" /> Filters
              </button>
              <span className="text-sm text-gray-500">Showing <strong className="text-primary">{filtered.length}</strong> products</span>
            </div>
            <div className="flex items-center gap-3">
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/40">
                <option value="">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
              <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setView('grid')} className={`p-2 transition-colors ${view === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}>
                  <HiViewGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setView('list')} className={`p-2 transition-colors ${view === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}>
                  <HiViewList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : paged.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="font-heading text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
              {paged.filter(Boolean).map((p, i) => <ProductCard key={p.id} product={p} delay={i * 60} />)}
            </div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo(0, 0); }} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-2xl">&times;</button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
