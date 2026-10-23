import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { fetchProducts, fetchCategories } from '../services/products.js';
import {
  Filter,
  X,
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States from URL or defaults
  const currentCategory = searchParams.get('category') || 'all';
  const currentSubcategory = searchParams.get('subcategory') || 'all';
  const currentOccasion = searchParams.get('occasion') || 'all';
  const currentFabric = searchParams.get('fabric') || 'all';
  const currentColor = searchParams.get('color') || 'all';
  const currentSize = searchParams.get('size') || 'all';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentPriceUnder = searchParams.get('priceUnder') || '';

  const [searchInput, setSearchInput] = useState(currentSearch);

  // Static filter options
  const occasionOptions = [
    'Wedding Ceremonies',
    'Engagement & Reception',
    'Festivals & Family Celebrations',
    'Pooja & Traditional Occasions',
    'Casual',
    'Formal & Evening Events',
  ];

  const fabricOptions = [
    'Cotton',
    'Linen',
    'Silk',
    'Velvet',
    'Georgette',
    'Poly-Wool',
    'Jacquard',
    'Chanderi',
  ];

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL', '38 (S)', '40 (M)', '42 (L)', '44 (XL)'];

  const colorOptions = [
    'Ivory',
    'Navy',
    'Saffron',
    'Beige',
    'Gold',
    'Maroon',
    'Emerald',
    'Black',
    'Blue',
    'Sage',
  ];

  // Fetch Categories on Mount
  useEffect(() => {
    fetchCategories()
      .then((res) => {
        if (res.success && res.data) {
          setCategories(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Products whenever searchParams change
  useEffect(() => {
    setLoading(true);

    const params = {};
    if (currentCategory && currentCategory !== 'all') params.category = currentCategory;
    if (currentSubcategory && currentSubcategory !== 'all') params.subcategory = currentSubcategory;
    if (currentOccasion && currentOccasion !== 'all') params.occasion = currentOccasion;
    if (currentFabric && currentFabric !== 'all') params.fabric = currentFabric;
    if (currentColor && currentColor !== 'all') params.color = currentColor;
    if (currentSize && currentSize !== 'all') params.size = currentSize;
    if (currentMinPrice) params.minPrice = currentMinPrice;
    if (currentMaxPrice) params.maxPrice = currentMaxPrice;
    if (currentPriceUnder) params.maxPrice = currentPriceUnder;
    if (currentSearch) params.search = currentSearch;
    if (currentSort) params.sort = currentSort;
    params.limit = 40;

    fetchProducts(params)
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data.data || []);
          setTotalCount(res.data.total || 0);
        }
      })
      .catch((err) => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  // Update a single filter in searchParams
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput.trim());
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    currentCategory !== 'all' ||
    currentSubcategory !== 'all' ||
    currentOccasion !== 'all' ||
    currentFabric !== 'all' ||
    currentColor !== 'all' ||
    currentSize !== 'all' ||
    currentMinPrice !== '' ||
    currentMaxPrice !== '' ||
    currentPriceUnder !== '' ||
    currentSearch !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 border-b border-beige/40 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
              Royal Vastra Catalogue
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mt-1">
              {currentCategory !== 'all' ? currentCategory : 'Men’s Ethnic Wear'}
            </h1>
            <p className="text-xs text-charcoal/60 mt-1">
              Showing {totalCount} bespoke designs crafted for celebrations, weddings, and festivals.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search collection..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full sm:w-56 pl-8 pr-3 py-2 text-xs bg-white border border-beige/60 focus:outline-none focus:border-burgundy"
              />
              <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="appearance-none bg-white border border-beige/60 pl-3 pr-8 py-2 text-xs font-semibold text-charcoal focus:outline-none focus:border-burgundy cursor-pointer uppercase tracking-wider"
              >
                <option value="featured">Featured / Curated</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-charcoal text-white text-xs font-semibold uppercase tracking-wider"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-beige/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/60">
              Active Filters:
            </span>

            {currentCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-ivory text-burgundy text-xs font-semibold px-2.5 py-1 border border-beige/50">
                {currentCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('category', 'all')} />
              </span>
            )}

            {currentOccasion !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-ivory text-burgundy text-xs font-semibold px-2.5 py-1 border border-beige/50">
                Occasion: {currentOccasion}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('occasion', 'all')} />
              </span>
            )}

            {currentFabric !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-ivory text-burgundy text-xs font-semibold px-2.5 py-1 border border-beige/50">
                Fabric: {currentFabric}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('fabric', 'all')} />
              </span>
            )}

            {currentColor !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-ivory text-burgundy text-xs font-semibold px-2.5 py-1 border border-beige/50">
                Colour: {currentColor}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('color', 'all')} />
              </span>
            )}

            {currentSize !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-ivory text-burgundy text-xs font-semibold px-2.5 py-1 border border-beige/50">
                Size: {currentSize}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('size', 'all')} />
              </span>
            )}

            {(currentMinPrice || currentMaxPrice || currentPriceUnder) && (
              <span className="inline-flex items-center gap-1 bg-ivory text-burgundy text-xs font-semibold px-2.5 py-1 border border-beige/50">
                Price Range
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {
                    const n = new URLSearchParams(searchParams);
                    n.delete('minPrice');
                    n.delete('maxPrice');
                    n.delete('priceUnder');
                    setSearchParams(n);
                  }}
                />
              </span>
            )}

            {currentSearch && (
              <span className="inline-flex items-center gap-1 bg-ivory text-burgundy text-xs font-semibold px-2.5 py-1 border border-beige/50">
                Search: "{currentSearch}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('search', '')} />
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[11px] font-semibold text-burgundy underline uppercase tracking-wider ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 pr-4 border-r border-beige/40">
          <div className="flex items-center justify-between pb-3 border-b border-beige/40">
            <span className="text-xs font-bold uppercase tracking-widest text-charcoal">
              Refine Selection
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] text-burgundy hover:underline uppercase tracking-wider"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Category</h4>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => updateFilter('category', 'all')}
                className={`w-full text-left text-xs py-1 transition-colors ${
                  currentCategory === 'all'
                    ? 'font-bold text-burgundy'
                    : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.category}
                  type="button"
                  onClick={() => updateFilter('category', c.category)}
                  className={`w-full text-left text-xs py-1 transition-colors flex items-center justify-between ${
                    currentCategory === c.category
                      ? 'font-bold text-burgundy pl-2 border-l-2 border-burgundy'
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  <span>{c.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Occasion Filter */}
          <div className="space-y-2 pt-4 border-t border-beige/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Occasion</h4>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => updateFilter('occasion', 'all')}
                className={`w-full text-left text-xs py-1 transition-colors ${
                  currentOccasion === 'all'
                    ? 'font-bold text-burgundy'
                    : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                All Occasions
              </button>
              {occasionOptions.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => updateFilter('occasion', occ)}
                  className={`w-full text-left text-xs py-1 transition-colors ${
                    currentOccasion === occ
                      ? 'font-bold text-burgundy pl-2 border-l-2 border-burgundy'
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-beige/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Price Range</h4>
            <div className="space-y-1.5 text-xs text-charcoal/80">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceBracket"
                  checked={currentMaxPrice === '999' || currentPriceUnder === '999'}
                  onChange={() => {
                    const n = new URLSearchParams(searchParams);
                    n.delete('minPrice');
                    n.set('maxPrice', '999');
                    setSearchParams(n);
                  }}
                  className="accent-burgundy"
                />
                <span>Under ₹999</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceBracket"
                  checked={currentMinPrice === '999' && currentMaxPrice === '1999'}
                  onChange={() => {
                    const n = new URLSearchParams(searchParams);
                    n.set('minPrice', '999');
                    n.set('maxPrice', '1999');
                    setSearchParams(n);
                  }}
                  className="accent-burgundy"
                />
                <span>₹999 – ₹1,999</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceBracket"
                  checked={currentMinPrice === '2000' && currentMaxPrice === '3999'}
                  onChange={() => {
                    const n = new URLSearchParams(searchParams);
                    n.set('minPrice', '2000');
                    n.set('maxPrice', '3999');
                    setSearchParams(n);
                  }}
                  className="accent-burgundy"
                />
                <span>₹2,000 – ₹3,999</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceBracket"
                  checked={currentMinPrice === '4000'}
                  onChange={() => {
                    const n = new URLSearchParams(searchParams);
                    n.set('minPrice', '4000');
                    n.delete('maxPrice');
                    setSearchParams(n);
                  }}
                  className="accent-burgundy"
                />
                <span>Above ₹4,000</span>
              </label>
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-4 border-t border-beige/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Size</h4>
            <div className="flex flex-wrap gap-1.5">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateFilter('size', currentSize === s ? 'all' : s)}
                  className={`px-2.5 py-1 text-xs border transition-colors ${
                    currentSize === s
                      ? 'bg-burgundy text-white border-burgundy'
                      : 'bg-white border-beige/70 text-charcoal hover:border-charcoal'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Filter */}
          <div className="space-y-2 pt-4 border-t border-beige/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Fabric</h4>
            <div className="flex flex-wrap gap-1.5">
              {fabricOptions.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => updateFilter('fabric', currentFabric === f ? 'all' : f)}
                  className={`px-2 py-1 text-[11px] border transition-colors ${
                    currentFabric === f
                      ? 'bg-burgundy text-white border-burgundy'
                      : 'bg-white border-beige/70 text-charcoal/80 hover:border-charcoal'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Colour Filter */}
          <div className="space-y-2 pt-4 border-t border-beige/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Colour</h4>
            <div className="flex flex-wrap gap-1.5">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateFilter('color', currentColor === c ? 'all' : c)}
                  className={`px-2 py-1 text-[11px] border transition-colors ${
                    currentColor === c
                      ? 'bg-burgundy text-white border-burgundy'
                      : 'bg-white border-beige/70 text-charcoal/80 hover:border-charcoal'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area (Span 3) */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <div key={n} className="aspect-[3/4] bg-neutral-200 animate-pulse border border-beige/30" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-beige/50 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-beige/20 text-gold-dark flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-display font-semibold text-xl text-charcoal">
                No matching garments found
              </h3>
              <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                We couldn't find products matching your selected criteria. Try adjusting or clearing some filters to explore our full collection.
              </p>
              <button type="button" onClick={clearAllFilters} className="btn-primary py-2.5 px-6 text-xs">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-beige/40">
                <h3 className="font-display font-bold text-lg text-charcoal">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-charcoal/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Sections */}
              <div className="py-4 space-y-5">
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Category</h4>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        updateFilter('category', 'all');
                        setMobileFilterOpen(false);
                      }}
                      className="block text-xs py-1"
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.category}
                        type="button"
                        onClick={() => {
                          updateFilter('category', c.category);
                          setMobileFilterOpen(false);
                        }}
                        className={`block text-xs py-1 ${
                          currentCategory === c.category ? 'font-bold text-burgundy' : 'text-charcoal/80'
                        }`}
                      >
                        {c.category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occasion */}
                <div className="pt-3 border-t border-beige/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Occasion</h4>
                  <div className="space-y-1">
                    {occasionOptions.map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => {
                          updateFilter('occasion', occ);
                          setMobileFilterOpen(false);
                        }}
                        className={`block text-xs py-1 ${
                          currentOccasion === occ ? 'font-bold text-burgundy' : 'text-charcoal/80'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Brackets */}
                <div className="pt-3 border-t border-beige/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Price</h4>
                  <div className="space-y-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        updateFilter('maxPrice', '999');
                        setMobileFilterOpen(false);
                      }}
                      className="block text-xs py-1 text-charcoal/80"
                    >
                      Under ₹999
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const n = new URLSearchParams(searchParams);
                        n.set('minPrice', '999');
                        n.set('maxPrice', '1999');
                        setSearchParams(n);
                        setMobileFilterOpen(false);
                      }}
                      className="block text-xs py-1 text-charcoal/80"
                    >
                      ₹999 – ₹1,999
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const n = new URLSearchParams(searchParams);
                        n.set('minPrice', '2000');
                        n.set('maxPrice', '3999');
                        setSearchParams(n);
                        setMobileFilterOpen(false);
                      }}
                      className="block text-xs py-1 text-charcoal/80"
                    >
                      ₹2,000 – ₹3,999
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const n = new URLSearchParams(searchParams);
                        n.set('minPrice', '4000');
                        n.delete('maxPrice');
                        setSearchParams(n);
                        setMobileFilterOpen(false);
                      }}
                      className="block text-xs py-1 text-charcoal/80"
                    >
                      Above ₹4,000
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-beige/40 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 btn-secondary text-xs py-2.5"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 btn-primary text-xs py-2.5"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
