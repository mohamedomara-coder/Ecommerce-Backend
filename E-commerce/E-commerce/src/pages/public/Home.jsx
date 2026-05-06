import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiShieldCheck, HiTruck, HiRefresh, HiStar } from 'react-icons/hi';
import { useProducts } from '../../context/ProductContext';
import { categories } from '../../data/categories';
import ProductCard from '../../components/common/ProductCard';

const marqueeText = 'Free Shipping Over $50 · 30-Day Returns · Secure Checkout · Top Brands · New Arrivals Daily · ';

const Home = () => {
  const { products } = useProducts();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const bestSellers = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[520px] overflow-hidden flex items-center">
        <div className="absolute inset-0 animate-kenBurns">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>
            New Season Arrivals
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white max-w-2xl leading-tight mb-6 animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>
            Discover Your Perfect Style
          </h1>
          <p className="text-gray-200 text-lg max-w-lg mb-8 leading-relaxed animate-fadeInUp opacity-0 animate-delay-240" style={{ animationFillMode: 'forwards' }}>
            Curated collection of premium products across electronics, fashion, home, and more.
          </p>
          <div className="flex items-center gap-4 animate-fadeInUp opacity-0 animate-delay-360" style={{ animationFillMode: 'forwards' }}>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 bg-accent text-primary font-semibold px-8 py-4 rounded-2xl hover:bg-amber-400 active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Shop Now
              <HiArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/category/electronics"
              className="inline-flex items-center gap-2 text-white font-medium px-6 py-4 rounded-2xl border border-white/30 hover:bg-white/10 transition-all duration-300"
            >
              Electronics
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-primary py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[marqueeText, marqueeText].map((text, i) => (
            <span key={i} className="text-sm text-gray-300 tracking-wide px-4">{text.repeat(4)}</span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="relative py-20 bg-slate-50 overflow-hidden transition-colors duration-700">
        {/* Dynamic Backgrounds */}
        {categories.map((cat) => (
          <img
            key={`bg-${cat.id}`}
            src={cat.sectionBg}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${hoveredCategory === cat.slug ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        {/* Dark Overlay */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-700 ${hoveredCategory ? 'opacity-100' : 'opacity-0'}`} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`font-heading text-4xl font-bold mb-3 transition-colors duration-700 animate-fadeInUp opacity-0 ${hoveredCategory ? 'text-white' : 'text-primary'}`} style={{ animationFillMode: 'forwards' }}>
              Shop by Category
            </h2>
            <p className={`transition-colors duration-700 animate-fadeInUp opacity-0 animate-delay-120 ${hoveredCategory ? 'text-gray-200' : 'text-gray-500'}`} style={{ animationFillMode: 'forwards' }}>
              Find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onMouseEnter={() => setHoveredCategory(cat.slug)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] animate-fadeInUp opacity-0"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                {/* Base Image */}
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                
                {/* Hover Image */}
                <img src={cat.hoverImage} alt={`${cat.name} lifestyle`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)' }} />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-heading font-bold text-white text-xl leading-tight mb-1">{cat.name}</h3>
                  <p className="text-amber-400 text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">{cat.productCount} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-4xl font-bold text-primary mb-2">Best Sellers</h2>
              <p className="text-gray-500">Our most loved products this season</p>
            </div>
            <Link to="/products" className="group hidden sm:flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all duration-300">
              View All <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-heading text-4xl font-bold text-primary text-center mb-12">Why Shop With Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: HiTruck, title: 'Free Shipping', desc: 'On all orders over $50. Fast and reliable delivery to your door.' },
            { icon: HiRefresh, title: '30-Day Returns', desc: 'Not happy? Return it free within 30 days, no questions asked.' },
            { icon: HiShieldCheck, title: 'Secure Checkout', desc: 'Your payment info is always encrypted and secure.' },
            { icon: HiStar, title: 'Top Quality', desc: 'Every product is vetted for quality and customer satisfaction.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-fadeInUp opacity-0"
              style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-primary mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
