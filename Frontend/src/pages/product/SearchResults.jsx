import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import PageShell from "../../components/common/PageShell";
import ProductCard from "../../components/cards/ProductCard";
import products from "../../data/products";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("newest");

  const results = useMemo(() => {
    const term = initialQuery.trim().toLowerCase();
    const filtered = !term
      ? products
      : products.filter((product) => {
          return (
            product.name?.toLowerCase().includes(term) ||
            product.category?.toLowerCase().includes(term) ||
            product.location?.toLowerCase().includes(term) ||
            product.seller?.toLowerCase().includes(term) ||
            product.condition?.toLowerCase().includes(term)
          );
        });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "oldest") return a.id - b.id;
      return b.id - a.id;
    });
  }, [initialQuery, sortBy]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  return (
    <PageShell>
      <section className="container py-10">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="eyebrow"><FiSearch /> Marketplace Search</span>
              <h1 className="mt-4 mb-1 text-3xl font-black text-slate-900">Search Results</h1>
              <p className="text-sm text-slate-500 font-medium">
                {initialQuery ? `${results.length} matches for "${initialQuery}"` : "Browse all listed products and swap items."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative flex items-center h-11 w-full lg:w-80 bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-teal-500">
                <FiSearch className="text-slate-400 mr-2 h-4 w-4" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products, sellers, talukas..."
                  className="w-full bg-transparent border-0 outline-0 text-sm text-slate-800"
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-700">
                    <FiX />
                  </button>
                )}
              </div>
              <button className="btn btn--primary h-11" type="submit">Search</button>
            </form>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {["Books", "Electronics", "Furniture", "Fashion"].map((term) => (
                <Link key={term} to={`/search?q=${encodeURIComponent(term)}`} className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-700">
                  {term}
                </Link>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-700 outline-0"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-low">Price Low to High</option>
              <option value="price-high">Price High to Low</option>
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-8 bg-white border border-slate-200/80 rounded-2xl py-16 text-center">
            <FiSearch className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h2 className="text-lg font-black text-slate-800">No results found</h2>
            <p className="text-sm text-slate-500 mt-1">Try another keyword, category, seller, or taluka.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

export default SearchResults;
