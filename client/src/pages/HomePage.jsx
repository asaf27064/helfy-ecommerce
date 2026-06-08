import { useEffect, useState } from 'react';
import PageTransition from '../components/layout/PageTransition';
import Container from '../components/layout/Container';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { productsApi, categoriesApi } from '../api';
import { SORT_OPTIONS, PAGE_SIZE } from '../lib/constants';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    categoriesApi.list().then((d) => setCategories(d.data)).catch(() => {});
  }, []);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    productsApi
      .list({ search: debounced || undefined, category: category || undefined, sort, page, limit: PAGE_SIZE })
      .then((d) => { setProducts(d.data); setTotal(d.total); })
      .catch(() => { setProducts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [debounced, category, sort, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <PageTransition>
      {/* Hero */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <Container className="py-16 text-center">
          <span className="inline-block rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-300">
            Premium Health &amp; Wellness
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Feel your best, every single day.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Curated supplements, fitness gear, and self-care essentials — backed by science.
          </p>
        </Container>
      </div>

      <Container className="py-10">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="input sm:max-w-xs"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input sm:max-w-xs" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <select className="input sm:max-w-xs" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <span className="ml-auto hidden text-sm text-slate-500 sm:block">{total} products</span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <EmptyState title="No products found" subtitle="Try adjusting your search or filters." />
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
            <button className="btn-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        )}
      </Container>
    </PageTransition>
  );
}
