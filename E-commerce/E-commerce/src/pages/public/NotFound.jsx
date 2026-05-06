import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[80vh] flex items-center justify-center px-4 text-center">
    <div className="animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>
      <p className="text-9xl font-heading font-black text-gray-100 mb-4 select-none">404</p>
      <h1 className="font-heading text-4xl font-bold text-primary mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/" className="bg-primary text-white font-semibold px-8 py-4 rounded-2xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-300">
          Go Home
        </Link>
        <Link to="/products" className="border border-gray-200 text-primary font-medium px-6 py-4 rounded-2xl hover:bg-gray-50 transition-all">
          Browse Products
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
