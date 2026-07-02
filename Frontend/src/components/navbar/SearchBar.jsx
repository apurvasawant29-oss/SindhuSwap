import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiX,
  FiClock,
  FiTrendingUp,
  FiBookOpen,
  FiUser,
  FiShoppingBag,
  FiTag,
} from "react-icons/fi";
import { productApi } from "../../api/productApi";
import { adminApi } from "../../api/adminApi";

const TRENDING_SEARCHES = ["iPhone 12", "Laptops", "Engineering Mathematics", "Study Table", "Sony Headphones"];

function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState({
    categories: [],
    users: [],
    books: [],
    products: [],
  });
  
  // For keyboard navigation
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ss_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading recent searches", e);
    }
  }, []);

  // Save a search term
  const saveSearch = useCallback((term) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 5);
      localStorage.setItem("ss_recent_searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Remove a recent search item
  const removeRecentSearch = (e, term) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      localStorage.setItem("ss_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  // Perform search / suggestion generation
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions({ categories: [], users: [], books: [], products: [] });
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    setActiveIndex(-1);

    // Fetch from API
    const delayDebounce = setTimeout(async () => {
      const searchTerm = query.trim();

      try {
        const response = await productApi.list({ search: searchTerm, limit: 6 });
        const results = response.data?.products || [];
        
        const matchedBooks = [];
        const matchedProducts = [];

        results.forEach((prod) => {
          if (prod.category === "Books" || prod.productType === "Swap") {
            matchedBooks.push(prod);
          } else {
            matchedProducts.push(prod);
          }
        });

        setSuggestions({
          categories: [], // Omit or fetch via adminApi.categories() if really needed
          users: [], // Omit or fetch users if needed
          books: matchedBooks,
          products: matchedProducts,
        });
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Flattened suggestions helper for keyboard navigation
  const getFlatSuggestions = useCallback(() => {
    const list = [];
    suggestions.categories.forEach((c) => list.push({ type: "category", label: c.name, target: `/category/${c.name.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}` }));
    suggestions.users.forEach((u) => list.push({ type: "user", label: u.name, target: `/profile` }));
    suggestions.books.forEach((b) => list.push({ type: "book", label: b.name, target: `/product/${b.id}` }));
    suggestions.products.forEach((p) => list.push({ type: "product", label: p.name, target: `/product/${p.id}` }));
    return list;
  }, [suggestions]);

  const flatSuggestions = getFlatSuggestions();
  const totalSuggestions = flatSuggestions.length;

  const handleSelect = (item) => {
    saveSearch(item.label);
    setIsOpen(false);
    setQuery("");
    navigate(item.target);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 >= totalSuggestions ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 < 0 ? totalSuggestions - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < totalSuggestions) {
        handleSelect(flatSuggestions[activeIndex]);
      } else if (query.trim()) {
        saveSearch(query);
        setIsOpen(false);
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const highlightMatch = (text, match) => {
    if (!match) return text;
    const parts = text.split(new RegExp(`(${match.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === match.toLowerCase() ? (
            <span key={index} className="text-teal-600 font-semibold bg-teal-50 px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-[440px] z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) {
            saveSearch(query);
            setIsOpen(false);
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setQuery("");
          }
        }}
        className="flex items-center h-11 w-full overflow-hidden bg-white border border-[#e5e7eb] rounded-lg shadow-[0_4px_12px_rgba(15,23,42,0.03)] focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 transition-all duration-200"
      >
        <div className="flex items-center flex-1 px-4 min-w-0">
          <FiSearch className="text-slate-400 mr-2.5 h-4.5 w-4.5 shrink-0" />
          <input
            aria-label="Search products, books, and categories"
            placeholder="Search for products, books, categories..."
            type="text"
            className="w-full h-full border-0 outline-0 text-slate-800 text-sm placeholder-slate-400 min-w-0 bg-transparent"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveIndex(-1);
              }}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Clear search"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          aria-label="Search"
          className="h-11 w-12 flex items-center justify-center text-white bg-gradient-to-br from-[#059669] to-[#0f766e] hover:brightness-105 active:brightness-95 transition-all duration-200"
        >
          <FiSearch className="h-5 w-5" />
        </button>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 max-h-[460px] overflow-y-auto bg-white rounded-xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.1)] py-3 px-1.5 z-[100]"
          >
            {/* Loading Spinner */}
            {loading && (
              <div className="flex items-center justify-center py-6 gap-2.5 text-slate-500 text-xs">
                <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                <span>Searching local marketplace...</span>
              </div>
            )}

            {/* Suggestions Render */}
            {!loading && query.trim() !== "" && (
              <>
                {/* Empty State */}
                {totalSuggestions === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    <FiSearch className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="font-medium text-slate-700">No matches found</p>
                    <p className="text-xs text-slate-400 mt-1">Try another keyword or category name</p>
                  </div>
                )}

                {totalSuggestions > 0 && (
                  <div className="space-y-3.5">
                    {/* Categories Suggestions */}
                    {suggestions.categories.length > 0 && (
                      <div>
                        <div className="flex items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2.5 mb-1.5">
                          <FiTag className="mr-1.5" /> Categories
                        </div>
                        <ul className="space-y-0.5">
                          {suggestions.categories.map((cat, idx) => {
                            const flatIdx = flatSuggestions.findIndex((x) => x.label === cat.name && x.type === "category");
                            return (
                              <li
                                key={cat.name}
                                onClick={() => handleSelect({ label: cat.name, target: `/category/${cat.name.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}` })}
                                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                  activeIndex === flatIdx
                                    ? "bg-slate-50 text-teal-700 font-medium"
                                    : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-800"
                                }`}
                              >
                                <FiTag className="text-slate-400 h-3.5 w-3.5" />
                                <span>{highlightMatch(cat.name, query)}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Users Suggestions */}
                    {suggestions.users.length > 0 && (
                      <div>
                        <div className="flex items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2.5 mb-1.5">
                          <FiUser className="mr-1.5" /> Sellers
                        </div>
                        <ul className="space-y-0.5">
                          {suggestions.users.map((usr, idx) => {
                            const flatIdx = flatSuggestions.findIndex((x) => x.label === usr.name && x.type === "user");
                            return (
                              <li
                                key={usr.name}
                                onClick={() => handleSelect({ label: usr.name, target: `/profile` })}
                                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                  activeIndex === flatIdx
                                    ? "bg-slate-50 text-teal-700 font-medium"
                                    : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-800"
                                }`}
                              >
                                <FiUser className="text-slate-400 h-3.5 w-3.5" />
                                <span>{highlightMatch(usr.name, query)}</span>
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.25 rounded-md ml-auto">
                                  {usr.taluka}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Books/Swaps Suggestions */}
                    {suggestions.books.length > 0 && (
                      <div>
                        <div className="flex items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2.5 mb-1.5">
                          <FiBookOpen className="mr-1.5" /> Books / Swap Items
                        </div>
                        <ul className="space-y-0.5">
                          {suggestions.books.map((book, idx) => {
                            const flatIdx = flatSuggestions.findIndex((x) => x.label === book.name && x.type === "book");
                            return (
                              <li
                                key={book.id}
                                onClick={() => handleSelect({ label: book.name, target: `/product/${book.id}` })}
                                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                  activeIndex === flatIdx
                                    ? "bg-slate-50 text-teal-700 font-medium"
                                    : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-800"
                                }`}
                              >
                                <FiBookOpen className="text-amber-500 h-3.5 w-3.5" />
                                <span className="truncate max-w-[240px]">
                                  {highlightMatch(book.name, query)}
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-600 ml-auto shrink-0">
                                  Swap Only
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Products Suggestions */}
                    {suggestions.products.length > 0 && (
                      <div>
                        <div className="flex items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2.5 mb-1.5">
                          <FiShoppingBag className="mr-1.5" /> Listings
                        </div>
                        <ul className="space-y-0.5">
                          {suggestions.products.map((prod, idx) => {
                            const flatIdx = flatSuggestions.findIndex((x) => x.label === prod.name && x.type === "product");
                            return (
                              <li
                                key={prod.id}
                                onClick={() => handleSelect({ label: prod.name, target: `/product/${prod.id}` })}
                                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                  activeIndex === flatIdx
                                    ? "bg-slate-50 text-teal-700 font-medium"
                                    : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-800"
                                }`}
                              >
                                <FiShoppingBag className="text-teal-600 h-3.5 w-3.5" />
                                <span className="truncate max-w-[240px]">
                                  {highlightMatch(prod.name, query)}
                                </span>
                                <span className="text-[10px] font-bold text-slate-700 ml-auto shrink-0">
                                  Rs. {prod.price}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Recents and Trending State (Empty Query) */}
            {!loading && query.trim() === "" && (
              <div className="space-y-4 px-1 py-1">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2 mb-1.5">
                      <FiClock className="mr-1.5" /> Recent Searches
                    </div>
                    <ul className="space-y-0.5">
                      {recentSearches.map((term, index) => (
                        <li
                          key={term}
                          onClick={() => {
                            setQuery(term);
                            setIsOpen(true);
                          }}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                          <FiClock className="text-slate-400 h-3.5 w-3.5" />
                          <span>{term}</span>
                          <button
                            type="button"
                            onClick={(e) => removeRecentSearch(e, term)}
                            className="ml-auto text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity"
                            aria-label={`Delete recent search ${term}`}
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <div className="flex items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2 mb-2">
                    <FiTrendingUp className="mr-1.5" /> Trending Searches
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {TRENDING_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          setIsOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-200 text-[11px] text-slate-600 hover:text-teal-700 rounded-full transition-all duration-200 font-medium"
                      >
                        <FiTrendingUp className="h-3 w-3 opacity-70" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
