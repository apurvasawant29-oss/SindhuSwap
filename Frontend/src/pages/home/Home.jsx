import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiSmartphone,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { FaLaptop } from "react-icons/fa";
import { GiSofa } from "react-icons/gi";
import { 
  Users, 
  ShoppingBag, 
  Repeat, 
  Search, 
  MessageSquare, 
  Handshake, 
  Sparkles,
  Compass
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState, Fragment } from "react";
import PageShell from "../../components/common/PageShell";
import SectionHeader from "../../components/common/SectionHeader";
import ProductCard from "../../components/cards/ProductCard";
import ProductCarousel from "../../components/common/ProductCarousel";
import SkeletonCard from "../../components/common/SkeletonCard";
import fortImage from "../../assets/sindhu.jpg";
import productImage from "../../assets/sawantwadi.jpg";
import peopleImage from "../../assets/us.jpeg";
import { productApi } from "../../api/productApi";
import categories from "../../data/categories";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const stats = [
  { value: "1000+", label: "Happy Users", icon: Users, desc: "Connecting students, readers, and locals daily." },
  { value: "500+", label: "Items Listed", icon: ShoppingBag, desc: "Gently used goods and quality textbooks." },
  { value: "200+", label: "Book Swaps", icon: Repeat, desc: "Sharing knowledge across the community." },
];

const features = [
  { title: "Trusted Community", text: "Connect with verified people from nearby talukas.", icon: FiUsers },
  { title: "Secure Marketplace", text: "Safety-first flows for every product and swap.", icon: FiShield },
  { title: "Easy To Use", text: "A clean interface built for quick local decisions.", icon: FiCheckCircle },
  { title: "Affordable", text: "Find fair prices and reuse what already exists.", icon: FiHeart },
  { title: "Eco Friendly", text: "Reduce waste by giving items a second life.", icon: FiRefreshCw },
];

const updates = [
  { label: "Tips", title: "Best Tips to Buy Second-hand Items Safely", image: peopleImage },
  { label: "Books", title: "Why Book Swapping is a Smart Choice?", image: productImage },
  { label: "Community", title: "Building a Stronger Community Together", image: fortImage },
  { label: "Updates", title: "New Features Coming Soon to SindhuSwap", image: peopleImage },
];

const testimonials = [
  { name: "Riya Patil", role: "Student, Kudal", text: "I swapped two books and found a study table in the same week.", rating: 5 },
  { name: "Omkar Naik", role: "Seller, Malvan", text: "The taluka-first listings make every conversation feel local and useful.", rating: 5 },
  { name: "Sneha Sawant", role: "Buyer, Sawantwadi", text: "Clean design, simple search, and I did not have to scroll through unrelated cities.", rating: 5 },
];

function FloatingCard({ className, title, value, icon }) {
  return (
    <motion.div
      className={`floating-card ${className}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <span>{icon}</span>
      <strong>{title}</strong>
      <small>{value}</small>
    </motion.div>
  );
}

function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [apiProducts, setApiProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productApi.list({ limit: 100 });
        setApiProducts(res.data?.products || []);
      } catch (err) {
        console.error("Failed to load products for homepage", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return apiProducts.filter((product) => {
      const query = search.trim().toLowerCase();

      const matchSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.location || product.taluka || "").toLowerCase().includes(query);

      const matchCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory, apiProducts]);

  const [[page, direction], setPage] = useState([0, 0]);
  const [visibleCards, setVisibleCards] = useState(4);

  // Monitor responsive columns based on viewport size (strict implementation specs)
  useEffect(() => {
    const updateVisibleCards = () => {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCards(4);
      else if (w >= 768) setVisibleCards(3);
      else setVisibleCards(1);
    };
    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  // Use all filtered products
  const carouselProducts = filteredProducts;

  const pageSize = visibleCards * 2;
  const maxPages = Math.ceil(carouselProducts.length / pageSize);

  // Reset index when filter changes
  useEffect(() => {
    setPage([0, 0]);
  }, [selectedCategory, search]);

  const handlePrev = () => {
    setPage(([prevPage]) => [Math.max(0, prevPage - 1), -1]);
  };

  const handleNext = () => {
    setPage(([prevPage]) => [Math.min(maxPages - 1, prevPage + 1), 1]);
  };

  const handleCategoryClick = (categoryName) => {
    setLoading(true);
    setSelectedCategory(categoryName);
    toast.success(`${categoryName} selected`);
    setTimeout(() => {
      setLoading(false);
    }, 350);
  };

  const handleClearFilters = () => {
    setLoading(true);
    setSearch("");
    setSelectedCategory("All");
    toast.info("Filters cleared");
    setTimeout(() => {
      setLoading(false);
    }, 350);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim().length >= 2) {
      toast.dismiss();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    toast.success("Search Completed");
  };

  return (
    <PageShell>
      <section className="hero">
        <img className="hero__bg" src={fortImage} alt="" aria-hidden="true" />
        <div className="hero__overlay" />
        <div className="hero__inner container">
          <motion.div
            className="hero__content"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.6 }}
          >
            <span className="welcome-badge">
              <FiUsers /> Welcome to SindhuSwap
            </span>
            <h1>
              Buy, Sell & Swap <br />
              in Your <span>Community</span>
            </h1>
            <p>
              Find great deals on second-hand items or swap books with students
              and neighbors across Sindhudurg.
            </p>

            <form className="hero__search" onSubmit={handleSearchSubmit}>
              <div className="hero__search-bar">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search products, books, categories, locations..."
                  value={search}
                  onChange={handleSearchChange}
                />
                {search && (
                  <button
                    type="button"
                    className="hero__search-clear"
                    onClick={() => {
                      setSearch("");
                      toast.info("Search cleared");
                    }}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
              <motion.button
                type="submit"
                className="hero__search-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Search
              </motion.button>
            </form>

            <div className="hero__buttons">
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                <Link className="btn btn--primary" to="/categories">
                  <FiShoppingBag /> Explore Items
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                <Link className="btn btn--light" to="/bookswap">
                  <FiRefreshCw /> Book Swap
                </Link>
              </motion.div>
            </div>

            <div className="trust-row">
              <span>
                <FiUsers /> Local Community
              </span>
              <span>
                <FiShield /> Trusted Sellers
              </span>
              <span>
                <FiCheckCircle /> Secure Marketplace
              </span>
            </div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <img src={peopleImage} alt="Local students holding books and a mobile" />
            <FloatingCard className="card-chair" title="Wooden Chair" value="Rs. 1,200" icon={<GiSofa />} />
            <FloatingCard className="card-laptop" title="Dell Laptop" value="Rs. 18,500" icon={<FaLaptop />} />
            <FloatingCard className="card-phone" title="iPhone 11" value="Rs. 15,000" icon={<FiSmartphone />} />
            <FloatingCard className="card-books" title="Engineering Books" value="Swap Now" icon={<FiBookOpen />} />
            <div className="hero__users">
              <FiUsers />
              <strong>Join 1000+</strong>
              <span>Happy Users</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="category-strip container" aria-label="Popular categories">
        <motion.button
          type="button"
          className={`category-card category-card--all ${selectedCategory === "All" ? "active" : ""}`}
          onClick={handleClearFilters}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
        >
          <FiShoppingBag />
          <span>All</span>
        </motion.button>

        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.name;

          return (
            <motion.button
              type="button"
              key={category.name}
              className={`category-card category-card--${category.tone} ${isActive ? "active" : ""}`}
              onClick={() => handleCategoryClick(category.name)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
            >
              <Icon />
              <span>{category.name}</span>
            </motion.button>
          );
        })}
      </section>

      <section className="section container featured-home-section">
        <SectionHeader
          title={selectedCategory === "All" ? "Featured Listings" : `${selectedCategory} Products`}
          action={
            maxPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous listing"
                  onClick={handlePrev}
                  disabled={page === 0}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed active:scale-95"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next listing"
                  onClick={handleNext}
                  disabled={page >= maxPages - 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed active:scale-95"
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </div>
            )
          }
        />

        {loading ? (
          <div className={`grid ${visibleCards === 4 ? "grid-cols-4" : visibleCards === 3 ? "grid-cols-3" : "grid-cols-1"} gap-x-8 gap-y-6 w-full mx-auto px-4 md:px-6 lg:px-8 max-w-7xl`}>
            {Array.from({ length: visibleCards * 2 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : carouselProducts.length === 0 ? (
          <div className="empty-state">
            <FiSearch size={48} />
            <h3>No products found</h3>
            <p>Try adjusting your search or selecting a different category.</p>
            <button type="button" className="btn btn--dark" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <ProductCarousel
            items={carouselProducts}
            page={page}
            setPage={setPage}
            visibleCards={visibleCards}
            maxPages={maxPages}
            direction={direction}
          />
        )}
      </section>

      <motion.section
        className="py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-16 lg:gap-24 items-start"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={reveal}
      >
        {/* Left Column: Statistics */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-6 w-full lg:w-auto shrink-0 justify-center lg:justify-start items-center">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                className="group relative flex flex-col justify-between items-start p-6 bg-white border border-slate-100/95 rounded-[22px] shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_45px_rgba(16,185,129,0.06)] hover:border-emerald-200/40 w-full sm:w-[200px] h-[155px] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
                key={stat.label}
                whileHover={{ y: -6 }}
              >
                {/* Subtle soft gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/[0.015] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="text-slate-400 group-hover:text-emerald-500 transition-all duration-300 group-hover:scale-105 transform origin-left">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                
                <div className="mt-auto space-y-1 z-10">
                  <span className="text-[28px] font-extrabold text-slate-800 tracking-tight leading-none">
                    {stat.value}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                    {stat.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-normal line-clamp-1">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: How It Works */}
        <div className="flex-1 w-full text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/50 mb-3.5 tracking-wide uppercase">
            <Sparkles className="w-3 h-3" />
            Simple Local Flow
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-slate-900 tracking-tight leading-none mb-4">
            How It Works?
          </h2>
          
          <p className="text-slate-500 text-base md:text-lg max-w-xl mb-12 font-medium leading-relaxed">
            SindhuSwap is designed specifically for Sindhudurg districts. Trade, buy, or swap books locally with verified users nearby.
          </p>

          <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-4 relative w-full">
            {[
              {
                title: "Browse Items",
                text: "Explore verified products and swap books from nearby talukas.",
                icon: Search,
              },
              {
                title: "Connect",
                text: "Chat with sellers, ask questions, or send a book swap request.",
                icon: MessageSquare,
              },
              {
                title: "Buy or Swap",
                text: "Meet safely, complete the deal, and support your local community.",
                icon: Handshake,
              },
            ].map((step, index, arr) => {
              const Icon = step.icon;
              return (
                <Fragment key={step.title}>
                  <motion.article
                    className="group relative flex flex-col justify-between p-8 bg-gradient-to-b from-white via-white to-emerald-50/[0.02] border border-slate-100/80 hover:border-emerald-200/50 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_24px_50px_-12px_rgba(15,23,42,0.08)] flex-1 w-full min-h-[220px] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                  >
                    {/* Top glow border */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex items-start justify-between z-10">
                      <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all duration-300 transform group-hover:scale-105">
                        <Icon className="w-6 h-6 stroke-[1.75]" />
                      </div>
                      <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-500/30 transition-colors duration-300">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="mt-8 space-y-2 z-10">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </motion.article>

                  {/* Connecting line */}
                  {index < arr.length - 1 && (
                    <div className="flex md:flex-row flex-col items-center justify-center my-2 md:my-0">
                      {/* Vertical line for mobile */}
                      <div className="w-[2px] h-6 bg-gradient-to-b from-slate-100 to-transparent md:hidden" />
                      {/* Horizontal line for desktop */}
                      <div className="hidden md:block w-6 lg:w-10 h-[2px] bg-gradient-to-r from-slate-100 to-emerald-100/50 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </motion.section>

      <section className="section container">
        <SectionHeader title="Why Choose SindhuSwap?" />
        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article
                className="feature-card"
                key={feature.title}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35 }}
              >
                <Icon />
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section container">
        <SectionHeader title="Latest Community Updates" />
        <div className="update-grid">
          {updates.map((update) => (
            <motion.article
              className="update-card"
              key={update.title}
              whileHover={{ y: -6 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35 }}
            >
              <img src={update.image} alt="" />
              <div>
                <span>{update.label}</span>
                <h3>{update.title}</h3>
                <Link to="/blog">
                  Read More <FiArrowRight />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader eyebrow="Community voices" title="Loved by Local Users" />
          <div className="testimonial-grid">
            {testimonials.map((person) => (
              <motion.article
                className="testimonial-card"
                key={person.name}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35 }}
              >
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FiStar
                      key={index}
                      className={index < person.rating ? "star--filled" : "star--empty"}
                    />
                  ))}
                </div>
                <p>&ldquo;{person.text}&rdquo;</p>
                <div className="testimonial-card__user">
                  <motion.span whileHover={{ scale: 1.08 }}>
                    {person.name.charAt(0)}
                  </motion.span>
                  <div>
                    <strong>{person.name}</strong>
                    <small>{person.role}</small>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        className="cta container"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <span className="eyebrow">Ready to Buy or Swap?</span>
          <h2>Join SindhuSwap Today.</h2>
          <p>Start with your taluka, discover nearby listings, and keep useful items moving.</p>
        </div>
        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
          <Link className="btn btn--dark" to="/signup">
            Get Started <FiArrowRight />
          </Link>
        </motion.div>
      </motion.section>
    </PageShell>
  );
}

export default Home;
