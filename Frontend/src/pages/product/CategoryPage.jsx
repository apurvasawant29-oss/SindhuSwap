import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiX,
  FiSearch,
  FiMapPin,
  FiTag,
  FiAward,
  FiCheckCircle,
  FiCpu,
  FiSmartphone,
  FiBookOpen,
  FiHome,
  FiHeart,
  FiRefreshCw,
} from "react-icons/fi";
import { FaLaptop, FaTshirt, FaBicycle, FaFootballBall } from "react-icons/fa";
import { GiSofa, GiToyMallet, GiWaterBottle } from "react-icons/gi";
import { IoLeafOutline } from "react-icons/io5";
import PageShell from "../../components/common/PageShell";
import ProductCard from "../../components/cards/ProductCard";
import { productApi } from "../../api/productApi";

// Sindhudurg Talukas list
const TALUKAS = [
  "All",
  "Sawantwadi",
  "Kudal",
  "Kankavli",
  "Malvan",
  "Vengurla",
  "Dodamarg",
  "Devgad",
  "Vaibhavwadi",
];

// Rich metadata for category page display
const CATEGORIES_METADATA = {
  electronics: {
    name: "Electronics",
    desc: "Laptops, Cameras, Accessories, Headphones and smart gadgets.",
    icon: FiCpu,
    color: "from-purple-600 to-indigo-600",
    banner: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80",
    tags: ["Laptops", "Electronics"],
  },
  mobiles: {
    name: "Mobiles",
    desc: "Smartphones, Tablets, Chargers, and mobile accessories.",
    icon: FiSmartphone,
    color: "from-blue-600 to-teal-500",
    banner: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80",
    tags: ["Mobiles"],
  },
  furniture: {
    name: "Furniture",
    desc: "Beds, Sofas, Study Tables, Office Chairs, and wooden decors.",
    icon: GiSofa,
    color: "from-emerald-600 to-teal-600",
    banner: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
    tags: ["Furniture"],
  },
  books: {
    name: "Books",
    desc: "Textbooks, Novels, Comics, competitive exam books to buy or swap.",
    icon: FiBookOpen,
    color: "from-amber-500 to-orange-600",
    banner: "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=1200&q=80",
    tags: ["Books"],
  },
  fashion: {
    name: "Fashion",
    desc: "Premium clothes, activewear, jackets, footwear and accessories.",
    icon: FaTshirt,
    color: "from-rose-500 to-pink-500",
    banner: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
    tags: ["Fashion"],
  },
  sports: {
    name: "Sports & Fitness",
    desc: "Cricket bats, soccer balls, home gyms, dumbbells and active gear.",
    icon: FaFootballBall,
    color: "from-orange-500 to-red-500",
    banner: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80",
    tags: ["Sports"],
  },
  "home-kitchen": {
    name: "Home & Kitchen",
    desc: "Kitchen appliances, cooking sets, home decor, cookware and organizers.",
    icon: FiHome,
    color: "from-teal-600 to-cyan-500",
    banner: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80",
    tags: ["Home & Kitchen"],
  },
  "home-&-kitchen": {
    name: "Home & Kitchen",
    desc: "Kitchen appliances, cooking sets, home decor, cookware and organizers.",
    icon: FiHome,
    color: "from-teal-600 to-cyan-500",
    banner: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80",
    tags: ["Home & Kitchen"],
  },
  vehicles: {
    name: "Vehicles",
    desc: "Scooters, bicycles, helmets, and vehicle utilities.",
    icon: FaBicycle,
    color: "from-indigo-600 to-sky-500",
    banner: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=80",
    tags: ["Vehicles"],
  },
  "toys-games": {
    name: "Toys & Games",
    desc: "Board games, educational toys, puzzle blocks, and action figures.",
    icon: GiToyMallet,
    color: "from-pink-500 to-amber-500",
    banner: "https://images.unsplash.com/photo-1539627831859-a911cf04d3cd?w=1200&q=80",
    tags: ["Toys & Games"],
  },
  "toys-&-games": {
    name: "Toys & Games",
    desc: "Board games, educational toys, puzzle blocks, and action figures.",
    icon: GiToyMallet,
    color: "from-pink-500 to-amber-500",
    banner: "https://images.unsplash.com/photo-1539627831859-a911cf04d3cd?w=1200&q=80",
    tags: ["Toys & Games"],
  },
  "beauty-health": {
    name: "Beauty & Health",
    desc: "Skincare sets, organic wellness, beauty kits, and self-care accessories.",
    icon: GiWaterBottle,
    color: "from-teal-500 to-emerald-400",
    banner: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80",
    tags: ["Beauty & Health"],
  },
  "beauty-&-health": {
    name: "Beauty & Health",
    desc: "Skincare sets, organic wellness, beauty kits, and self-care accessories.",
    icon: GiWaterBottle,
    color: "from-teal-500 to-emerald-400",
    banner: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80",
    tags: ["Beauty & Health"],
  },
  "plants-garden": {
    name: "Plants & Garden",
    desc: "Organic planters, garden pots, seeds, flower bouquets and garden spades.",
    icon: IoLeafOutline,
    color: "from-emerald-500 to-lime-600",
    banner: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80",
    tags: ["Plants & Garden"],
  },
  "plants-&-garden": {
    name: "Plants & Garden",
    desc: "Organic planters, garden pots, seeds, flower bouquets and garden spades.",
    icon: IoLeafOutline,
    color: "from-emerald-500 to-lime-600",
    banner: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80",
    tags: ["Plants & Garden"],
  },
  others: {
    name: "Others",
    desc: "Miscellaneous items, trade offerings, and unique marketplace listings.",
    icon: FiTag,
    color: "from-slate-600 to-slate-800",
    banner: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80",
    tags: ["Others"],
  },
};

const DEFAULT_METADATA = {
  name: "Category Directory",
  desc: "Browse premium verified items listed across local talukas.",
  icon: FiTag,
  color: "from-teal-600 to-teal-800",
  banner: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80",
  tags: [],
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function CategoryPage() {
  const { categoryName } = useParams();
  const meta = CATEGORIES_METADATA[categoryName?.toLowerCase()] || DEFAULT_METADATA;

  // Filter States
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxRange, setMaxRange] = useState(50000);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedTaluka, setSelectedTaluka] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [selectedSellerType, setSelectedSellerType] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const response = await productApi.list({
          category: meta.tags[0] || meta.name,
          limit: 48,
          sort: "-createdAt",
        });
        setProducts(response.data.products || []);
      } catch (error) {
        setLoadError(error.message || "Unable to load category products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [meta.name, meta.tags]);

  // Toggle checklist filters
  const toggleCondition = (cond) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const handleClearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setMaxRange(50000);
    setSelectedConditions([]);
    setSelectedTaluka("All");
    setSortBy("newest");
    setSelectedAvailability("All");
    setSelectedSellerType("All");
  };

  // 1. Filter Logic
  const filteredProducts = useMemo(() => {
    // Get target products matching this category tags
    const catProducts = products.filter((prod) => {
      if (meta.tags.length === 0) return true;
      return meta.tags.some((t) => t.toLowerCase() === prod.category.toLowerCase());
    });

    return catProducts
      .filter((prod) => {
        // Search filter
        const query = search.trim().toLowerCase();
        if (query) {
          const matchTitle = prod.name.toLowerCase().includes(query);
          const matchLoc = (prod.location || "").toLowerCase().includes(query);
          const matchSeller = (prod.seller || "").toLowerCase().includes(query);
          if (!matchTitle && !matchLoc && !matchSeller) return false;
        }

        // Price manual min-max
        const price = prod.price || 0;
        if (minPrice && price < parseFloat(minPrice)) return false;
        if (maxPrice && price > parseFloat(maxPrice)) return false;

        // Price range slider
        if (price > maxRange) return false;

        // Conditions filter
        if (selectedConditions.length > 0) {
          if (!selectedConditions.some((c) => c.toLowerCase() === prod.condition?.toLowerCase())) {
            return false;
          }
        }

        // Taluka location filter
        if (selectedTaluka !== "All") {
          if (prod.location?.toLowerCase() !== selectedTaluka.toLowerCase()) {
            return false;
          }
        }

        // Availability filter
        if (selectedAvailability !== "All") {
          const isSwap = prod.status === "Swap" || prod.price === undefined;
          if (selectedAvailability === "available" && prod.status !== "Available" && !isSwap) return false;
          if (selectedAvailability === "swap" && !isSwap) return false;
          if (selectedAvailability === "sold" && prod.status === "Available") return false; // mockup
        }

        // Seller type filter (mock: Shweta, Appu are Verified)
        if (selectedSellerType !== "All") {
          const isVerified = ["appu", "shweta"].includes(prod.seller?.toLowerCase());
          if (selectedSellerType === "verified" && !isVerified) return false;
          if (selectedSellerType === "individual" && isVerified) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sorting logic
        if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
        if (sortBy === "newest") return b.id - a.id;
        if (sortBy === "oldest") return a.id - b.id;
        if (sortBy === "popular") return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [
    search,
    minPrice,
    maxPrice,
    maxRange,
    selectedConditions,
    selectedTaluka,
    sortBy,
    selectedAvailability,
    selectedSellerType,
    meta.tags,
  ]);

  const CategoryIcon = meta.icon;

  const filterSidebar = (
    <div className="space-y-6">
      {/* Price Filters */}
      <div className="border-b border-slate-150 pb-5">
        <h3 className="text-xs.5 font-extrabold text-slate-800 uppercase tracking-wider mb-3">Price (Rs.)</h3>
        <div className="space-y-4">
          {/* Min Max text boxes */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full text-xs h-9 bg-slate-50 border border-slate-200 rounded-lg px-2 text-slate-700 outline-0 focus:border-teal-500 focus:bg-white transition-colors"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full text-xs h-9 bg-slate-50 border border-slate-200 rounded-lg px-2 text-slate-700 outline-0 focus:border-teal-500 focus:bg-white transition-colors"
            />
          </div>
          {/* Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
              <span>Up to:</span>
              <span className="text-teal-700">Rs. {maxRange.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={maxRange}
              onChange={(e) => setMaxRange(parseInt(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-100 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="border-b border-slate-150 pb-5">
        <h3 className="text-xs.5 font-extrabold text-slate-800 uppercase tracking-wider mb-3">Condition</h3>
        <div className="space-y-2">
          {["Excellent", "Like New", "Good", "Used"].map((cond) => {
            const isChecked = selectedConditions.includes(cond);
            return (
              <label key={cond} className="flex items-center gap-2.5 text-xs text-slate-650 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCondition(cond)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-3.75 w-3.75"
                />
                <span className="group-hover:text-slate-900 transition-colors font-medium">{cond}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Location (Taluka) */}
      <div className="border-b border-slate-150 pb-5">
        <h3 className="text-xs.5 font-extrabold text-slate-800 uppercase tracking-wider mb-3">Location (Taluka)</h3>
        <div className="relative">
          <select
            value={selectedTaluka}
            onChange={(e) => setSelectedTaluka(e.target.value)}
            className="w-full text-xs h-9.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-slate-700 outline-0 focus:border-teal-500 focus:bg-white transition-all appearance-none font-medium cursor-pointer"
          >
            {TALUKAS.map((tal) => (
              <option key={tal} value={tal}>
                {tal === "All" ? "All Talukas" : tal}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <FiMapPin className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="border-b border-slate-150 pb-5">
        <h3 className="text-xs.5 font-extrabold text-slate-800 uppercase tracking-wider mb-3">Availability</h3>
        <div className="flex flex-col gap-2">
          {[
            { id: "All", label: "All Items" },
            { id: "available", label: "Available Now" },
            { id: "swap", label: "Book Swaps" },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-2.5 text-xs text-slate-650 cursor-pointer group">
              <input
                type="radio"
                name="availability"
                checked={selectedAvailability === item.id}
                onChange={() => setSelectedAvailability(item.id)}
                className="border-slate-300 text-teal-600 focus:ring-teal-500 h-3.75 w-3.75"
              />
              <span className="group-hover:text-slate-900 transition-colors font-medium">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Seller Type */}
      <div className="border-b border-slate-150 pb-5">
        <h3 className="text-xs.5 font-extrabold text-slate-800 uppercase tracking-wider mb-3">Seller Type</h3>
        <div className="flex flex-col gap-2">
          {[
            { id: "All", label: "All Sellers" },
            { id: "verified", label: "Verified (Appu, Shweta)" },
            { id: "individual", label: "Individual Sellers" },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-2.5 text-xs text-slate-650 cursor-pointer group">
              <input
                type="radio"
                name="sellertype"
                checked={selectedSellerType === item.id}
                onChange={() => setSelectedSellerType(item.id)}
                className="border-slate-300 text-teal-600 focus:ring-teal-500 h-3.75 w-3.75"
              />
              <span className="group-hover:text-slate-900 transition-colors font-medium">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleClearFilters}
        className="w-full py-2 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 rounded-xl text-xs font-bold bg-slate-50 hover:bg-rose-50/50 transition-all duration-200"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <PageShell>
      <div className="min-h-screen bg-slate-50/40 pb-12">
        {/* Banner Hero */}
        <div className="relative h-64 sm:h-76 md:h-84 overflow-hidden z-10 shrink-0">
          <img
            src={meta.banner}
            alt={meta.name}
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/10" />

          {/* Banner content */}
          <div className="absolute inset-x-0 bottom-0 py-8 md:py-10 z-20">
            <div className="container max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2 md:space-y-3"
              >
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-teal-200/90 text-xs font-bold tracking-wide">
                  <Link to="/" className="hover:underline">Home</Link>
                  <span>&rarr;</span>
                  <Link to="/categories" className="hover:underline">Categories</Link>
                  <span>&rarr;</span>
                  <span className="text-white">{meta.name}</span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.color} text-white shadow-lg`}>
                    <CategoryIcon className="h-6.5 w-6.5" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {meta.name}
                  </h1>
                </div>
                <p className="text-xs.5 sm:text-sm text-slate-200/90 max-w-xl font-medium leading-relaxed">
                  {meta.desc}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="shrink-0 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-4 text-white shadow-sm"
              >
                <div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Listed Items</div>
                  <div className="text-2xl font-black mt-0.5">{filteredProducts.length}</div>
                </div>
                <div className="border-l border-white/10" />
                <div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Active Swaps</div>
                  <div className="text-2xl font-black mt-0.5">
                    {filteredProducts.filter((p) => p.status === "Swap" || p.price === undefined).length}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="container max-w-7xl mt-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* LEFT FILTER BAR - Desktop */}
            <aside className="w-full lg:w-68 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.01)] hidden lg:block shrink-0 sticky top-24">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                <span className="text-xs uppercase font-extrabold text-slate-800 tracking-wider flex items-center gap-1.5">
                  <FiFilter className="text-teal-600" /> Filters
                </span>
                {filteredProducts.length !== products.length && (
                  <button
                    onClick={handleClearFilters}
                    className="text-[11px] font-bold text-teal-650 hover:text-teal-800"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {filterSidebar}
            </aside>

            {/* RIGHT SIDE - Results List */}
            <main className="flex-1 w-full space-y-6">
              
              {/* Header Sort & Mobile Trigger */}
              <div className="bg-white border border-slate-200/70 rounded-2xl p-3.5 shadow-[0_2px_6px_rgba(15,23,42,0.01)] flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Search query inside category */}
                <div className="relative flex items-center h-10 w-full sm:max-w-xs bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all duration-200">
                  <FiSearch className="text-slate-400 mr-2 h-4 w-4 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search inside category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-full border-0 outline-0 text-xs text-slate-700 bg-transparent min-w-0"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                      <FiX className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {/* Mobile filter button trigger */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center justify-center gap-2 h-10 px-4 bg-teal-50 border border-teal-150 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl transition-colors w-full sm:w-auto shrink-0"
                  >
                    <FiFilter className="h-4 w-4" />
                    Filters
                  </button>

                  {/* Sort By Dropdown */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-xs h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-slate-750 font-bold outline-0 focus:border-teal-500 cursor-pointer w-full sm:w-auto"
                    >
                      <option value="newest">Newest Listed</option>
                      <option value="oldest">Oldest Listed</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Product grid with stagger animation */}
              {loading ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl py-16 text-center shadow-[0_2px_8px_rgba(15,23,42,0.01)] px-4">
                  <p className="text-sm text-slate-500 font-semibold">Loading products...</p>
                </div>
              ) : loadError ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl py-16 text-center shadow-[0_2px_8px_rgba(15,23,42,0.01)] px-4">
                  <h3 className="text-lg font-bold text-slate-700">Unable to load products</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">{loadError}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl py-16 text-center shadow-[0_2px_8px_rgba(15,23,42,0.01)] px-4">
                  <FiSearch className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <h3 className="text-lg font-bold text-slate-700">No products found</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                    Try adjusting your filter settings or search terms to find listings inside this category.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  viewport={{ once: true }}
                >
                  {filteredProducts.map((item) => (
                    <motion.div key={item.id} variants={itemVariants} className="h-full">
                      <ProductCard item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

            </main>
          </div>
        </div>

        {/* MOBILE SLIDE OUT FILTER DRAWER */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 bg-black z-[100]"
              />

              {/* Slider Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                className="fixed top-0 bottom-0 right-0 w-80 bg-white border-l border-slate-200 z-[110] flex flex-col shadow-2xl"
              >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <span className="text-xs uppercase font-extrabold text-slate-800 tracking-wider flex items-center gap-1.5">
                    <FiFilter className="text-teal-600" /> Filters ({filteredProducts.length})
                  </span>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-550 transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {/* Filter Controls Scroll */}
                <div className="flex-1 overflow-y-auto p-5">
                  {filterSidebar}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </PageShell>
  );
}

export default CategoryPage;
