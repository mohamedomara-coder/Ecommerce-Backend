import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { filterProducts } from '../../utils/filterProducts';
import ProductCard from '../../components/common/ProductCard';

const Search = () => {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const { products } = useProducts();
  const results = filterProducts(products, { query });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-1 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>
          Search Results
        </h1>
        <p className="text-gray-500 animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>
          {results.length} result{results.length !== 1 ? 's' : ''} for "<strong className="text-primary">{query}</strong>"
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-7xl mb-4">🔍</p>
          <h3 className="font-heading text-xl font-semibold mb-2">No results found</h3>
          <p className="text-gray-500 text-sm">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 60} />)}
        </div>
      )}
    </div>
  );
};

export default Search;
