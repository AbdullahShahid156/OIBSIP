import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../hooks';
import useDebounce from '../hooks/useDebounce';
import { cn, formatCurrency } from '../utils/helpers';
import { ROUTES } from '../utils/constants';
import { fetchPizzas, fetchCategories, setFilter, setPage, clearPizzaError } from '../store/slices/pizzaSlice';
import PizzaCard from '../components/pizza/PizzaCard';
import PizzaCardSkeleton from '../components/pizza/PizzaCardSkeleton';
import PizzaDetailModal from '../components/pizza/PizzaDetailModal';
import { StaggerContainer, StaggerItem } from '../components/ui/AnimationWrapper';

const sortOptions = [
  { value: '-rating', label: 'Top Rated' },
  { value: '-popular', label: 'Most Popular' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-newest', label: 'Newest' },
  { value: 'name', label: 'A to Z' },
];

export default function Menu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark } = useDarkMode();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { pizzas, pagination, categories, isLoading, error, filters } = useSelector((state) => state.pizza);

  const [searchInput, setSearchInput] = useState('');
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    dispatch(setFilter({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    const params = {
      sort: filters.sort,
      page: filters.page,
      limit: 12,
    };
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;

    dispatch(fetchPizzas(params));
  }, [filters, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearchChange = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);

  const handleCategoryClick = useCallback((categoryId) => {
    dispatch(setFilter({ category: filters.category === categoryId ? '' : categoryId }));
  }, [dispatch, filters.category]);

  const handleSortChange = useCallback((sortValue) => {
    dispatch(setFilter({ sort: sortValue }));
    setShowSortMenu(false);
  }, [dispatch]);

  const handlePageChange = useCallback((newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  const handleQuickView = useCallback((pizza) => {
    setSelectedPizza(pizza);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPizza(null);
  }, []);

  const handleCloseError = useCallback(() => {
    dispatch(clearPizzaError());
  }, [dispatch]);

  const featuredPizzas = useMemo(() =>
    pizzas.filter((p) => p.isFeatured).slice(0, 4),
    [pizzas]
  );

  const currentSortLabel = useMemo(() =>
    sortOptions.find((o) => o.value === filters.sort)?.label || 'Top Rated',
    [filters.sort]
  );

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className={cn(
          'absolute inset-0 transition-colors duration-300',
          isDark ? 'bg-gradient-to-b from-dark-925 to-dark-950' : 'bg-gradient-to-b from-surface-50 to-white'
        )} />
        <div className={cn(
          'absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[180px] transition-colors duration-300',
          isDark ? 'bg-brand-500/8' : 'bg-brand-500/10'
        )} />
        <div className={cn(
          'absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px] transition-colors duration-300',
          isDark ? 'bg-accent-500/5' : 'bg-accent-500/10'
        )} />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto"
          >
            {isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-4"
              >
                <span className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                  isDark
                    ? 'bg-white/5 text-white/50 border border-white/[0.06]'
                    : 'bg-surface-100 text-surface-500 border border-surface-200'
                )}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Welcome back, {user.name?.split(' ')[0]}
                </span>
              </motion.div>
            )}

            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="badge-brand mb-4 inline-flex"
            >
              Discover
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={cn(
                'text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight',
                isDark ? 'text-white' : 'text-surface-900'
              )}
            >
              Find Your Perfect{' '}
              <span className="text-gradient-brand">Pizza</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className={cn(
                'text-lg',
                isDark ? 'text-white/40' : 'text-surface-500'
              )}
            >
              Handcrafted with premium ingredients and baked to perfection
            </motion.p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="max-w-xl mx-auto mt-8"
          >
            <div className="relative">
              <svg
                className={cn(
                  'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none',
                  isDark ? 'text-white/30' : 'text-surface-400'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                placeholder="Search pizzas, ingredients, or styles..."
                value={searchInput}
                onChange={handleSearchChange}
                className={cn(
                  'w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium',
                  'transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50',
                  isDark
                    ? 'bg-dark-900/80 backdrop-blur-xl border border-white/[0.06] text-white placeholder-white/30 hover:border-white/[0.12]'
                    : 'bg-white border border-surface-200 text-surface-900 placeholder-surface-400 hover:border-surface-300 shadow-sm'
                )}
                aria-label="Search pizzas"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className={cn(
                    'absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors',
                    isDark ? 'text-white/30 hover:text-white/60' : 'text-surface-400 hover:text-surface-600'
                  )}
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      {!filters.search && !filters.category && featuredPizzas.length > 0 && (
        <section className="pb-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h2 className={cn(
                  'text-xl font-display font-bold',
                  isDark ? 'text-white' : 'text-surface-900'
                )}>
                  Featured Pizzas
                </h2>
                <p className={cn(
                  'text-sm mt-1',
                  isDark ? 'text-white/40' : 'text-surface-500'
                )}>
                  Chef's handpicked selection
                </p>
              </div>
            </motion.div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredPizzas.map((pizza, index) => (
                <StaggerItem key={pizza._id}>
                  <PizzaCard
                    pizza={pizza}
                    onQuickView={handleQuickView}
                    index={index}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="pb-20">
        <div className="container">
          {/* Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  onClick={() => handleCategoryClick('')}
                  className={cn(
                    'shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                    !filters.category
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
                      : isDark
                        ? 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/[0.06]'
                        : 'bg-surface-100 text-surface-500 hover:text-surface-900 hover:bg-surface-200 border border-surface-200'
                  )}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={cn(
                      'shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                      filters.category === cat.id
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
                        : isDark
                          ? 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/[0.06]'
                          : 'bg-surface-100 text-surface-500 hover:text-surface-900 hover:bg-surface-200 border border-surface-200'
                    )}
                  >
                    {cat.name}
                    <span className={cn(
                      'ml-1.5 text-xs',
                      filters.category === cat.id
                        ? 'text-white/70'
                        : isDark ? 'text-white/25' : 'text-surface-400'
                    )}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isDark
                      ? 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/[0.06]'
                      : 'bg-surface-100 text-surface-500 hover:text-surface-900 hover:bg-surface-200 border border-surface-200'
                  )}
                  aria-haspopup="listbox"
                  aria-expanded={showSortMenu}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h12M3 17h6" />
                  </svg>
                  {currentSortLabel}
                  <svg className={cn('w-4 h-4 transition-transform', showSortMenu && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        'absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl z-20 overflow-hidden',
                        isDark
                          ? 'bg-dark-900 border-white/[0.06]'
                          : 'bg-white border-surface-200'
                      )}
                      role="listbox"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={cn(
                            'w-full text-left px-4 py-2.5 text-sm font-medium transition-colors',
                            filters.sort === option.value
                              ? isDark
                                ? 'bg-brand-500/10 text-brand-400'
                                : 'bg-brand-50 text-brand-600'
                              : isDark
                                ? 'text-white/50 hover:text-white hover:bg-white/5'
                                : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                          )}
                          role="option"
                          aria-selected={filters.sort === option.value}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'mb-8 p-4 rounded-xl border flex items-center justify-between',
                  isDark
                    ? 'bg-danger-500/10 border-danger-500/20 text-danger-400'
                    : 'bg-danger-50 border-danger-200 text-danger-600'
                )}
                role="alert"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
                <button
                  onClick={handleCloseError}
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label="Dismiss error"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          {pagination && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <p className={cn(
                'text-sm',
                isDark ? 'text-white/30' : 'text-surface-400'
              )}>
                {filters.search && (
                  <>Showing results for <span className={cn('font-medium', isDark ? 'text-white/50' : 'text-surface-600')}>{filters.search}</span> — </>
                )}
                {pagination.total} pizza{pagination.total !== 1 ? 'es' : ''} found
              </p>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <PizzaCardSkeleton key={i} index={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && pizzas.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={cn(
                'py-20 text-center rounded-2xl border',
                isDark
                  ? 'bg-gradient-to-b from-dark-850 to-dark-900 border-white/[0.06]'
                  : 'bg-surface-50 border-surface-200'
              )}
            >
              <div className="relative inline-block mb-6">
                <div className={cn(
                  'absolute inset-0 rounded-full blur-2xl',
                  isDark ? 'bg-brand-500/10' : 'bg-brand-500/15'
                )} />
                <div className={cn(
                  'relative w-20 h-20 rounded-2xl flex items-center justify-center',
                  isDark ? 'bg-dark-850 border border-white/[0.06]' : 'bg-white border border-surface-200'
                )}>
                  <svg className={cn('w-10 h-10', isDark ? 'text-white/10' : 'text-surface-300')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </div>
              <h3 className={cn(
                'text-lg font-display font-semibold mb-2',
                isDark ? 'text-white' : 'text-surface-900'
              )}>
                No pizzas found
              </h3>
              <p className={cn(
                'text-sm max-w-sm mx-auto mb-6',
                isDark ? 'text-white/40' : 'text-surface-500'
              )}>
                {filters.search
                  ? `No pizzas match "${filters.search}". Try a different search term.`
                  : filters.category
                  ? 'No pizzas available in this category yet.'
                  : 'No pizzas available at the moment.'}
              </p>
              {(filters.search || filters.category) && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    dispatch(setFilter({ search: '', category: '', page: 1 }));
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}

          {/* Pizza Grid */}
          {!isLoading && pizzas.length > 0 && (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pizzas.map((pizza, index) => (
                <StaggerItem key={pizza._id}>
                  <PizzaCard
                    pizza={pizza}
                    onQuickView={handleQuickView}
                    index={index}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mt-12"
            >
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={cn(
                  'p-2.5 rounded-xl transition-all duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  pagination.page <= 1
                    ? 'opacity-40 cursor-not-allowed'
                    : isDark
                      ? 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/[0.06]'
                      : 'bg-surface-100 text-surface-500 hover:text-surface-900 hover:bg-surface-200 border border-surface-200'
                )}
                aria-label="Previous page"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {[...Array(pagination.pages)].map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === pagination.page;
                const isNear = Math.abs(pageNum - pagination.page) <= 1;
                const isEdge = pageNum === 1 || pageNum === pagination.pages;

                if (!isNear && !isEdge) {
                  if (pageNum === 2 || pageNum === pagination.pages - 1) {
                    return (
                      <span key={pageNum} className={cn('px-1', isDark ? 'text-white/20' : 'text-surface-400')}>...</span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      'w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                      isCurrent
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
                        : isDark
                          ? 'text-white/50 hover:text-white hover:bg-white/5'
                          : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
                    )}
                    aria-label={`Page ${pageNum}`}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className={cn(
                  'p-2.5 rounded-xl transition-all duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  pagination.page >= pagination.pages
                    ? 'opacity-40 cursor-not-allowed'
                    : isDark
                      ? 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/[0.06]'
                      : 'bg-surface-100 text-surface-500 hover:text-surface-900 hover:bg-surface-200 border border-surface-200'
                )}
                aria-label="Next page"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </motion.div>
          )}

          {/* Quick Start CTA */}
          {!filters.search && !filters.category && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                'mt-16 p-8 md:p-12 rounded-3xl text-center relative overflow-hidden',
                'bg-gradient-to-br from-brand-600 to-brand-700'
              )}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                  Ready to Create Your Perfect Pizza?
                </h3>
                <p className="text-white/70 max-w-md mx-auto mb-6">
                  Choose any pizza from our menu and customize it with your favorite toppings, size, and crust.
                </p>
                <motion.button
                  onClick={() => navigate('/builder')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600"
                >
                  Start Building
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pizza Detail Modal */}
      {selectedPizza && (
        <PizzaDetailModal pizza={selectedPizza} onClose={handleCloseModal} />
      )}
    </div>
  );
}
