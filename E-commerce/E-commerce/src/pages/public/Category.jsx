import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { categories } from '../../data/categories';
import { filterProducts } from '../../utils/filterProducts';
import ProductCard from '../../components/common/ProductCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import Pagination from '../../components/common/Pagination';

const PER_PAGE = 12;

const Category = () => {
  const { slug } = useParams();
  const { products } = useProducts();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const cat = categories.find((c) => c.slug === slug);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [slug]);

  const filtered = filterProducts(products, { category: slug });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {cat && (
        <div className="relative rounded-3xl overflow-hidden mb-10 h-48">
          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center px-10">
            <div>
              <h1 className="font-heading text-4xl font-bold text-white mb-1 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>{cat.name}</h1>
              <p className="text-gray-300 text-sm animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>{cat.description}</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-6"><strong className="text-primary">{filtered.length}</strong> products found</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : paged.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">📦</p>
          <h3 className="font-heading text-xl font-semibold mb-2">No products in this category</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paged.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 60} />)}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo(0, 0); }} />
    </div>
  );
};

export default Category;
