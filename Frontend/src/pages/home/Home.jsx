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
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import PageShell from "../../components/common/PageShell";
import SectionHeader from "../../components/common/SectionHeader";
import ProductCard from "../../components/cards/ProductCard";
import fortImage from "../../assets/sindhu.jpg";
import productImage from "../../assets/sawantwadi.jpg";
import peopleImage from "../../assets/us.jpeg";
import products from "../../data/products";
import categories from "../../data/categories";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stats = [
  { value: "1000+", label: "Happy Users", icon: FiUsers },
  { value: "500+", label: "Items Listed", icon: FiShoppingBag },
  { value: "200+", label: "Book Swaps", icon: FiRefreshCw },
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = search.trim().toLowerCase();

      const matchSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.location || product.taluka || "").toLowerCase().includes(query);

      const matchCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    toast.success(`${categoryName} selected`);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    toast.info("Filters cleared");
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
            <div className="pager">
              <button type="button" aria-label="Previous listing">
                <FiChevronLeft />
              </button>
              <button type="button" aria-label="Next listing">
                <FiChevronRight />
              </button>
            </div>
          }
        />

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <FiSearch size={48} />
            <h3>No products found</h3>
            <p>Try adjusting your search or selecting a different category.</p>
            <button type="button" className="btn btn--dark" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35 }}
              >
                <ProductCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <motion.section
        className="stats-work container home-process-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={reveal}
      >
        <div className="stats-grid home-stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.article
                className="stat-card"
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45 }}
              >
                <Icon />
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </motion.article>
            );
          })}
        </div>

        <div className="work-panel home-how-panel">
          <SectionHeader eyebrow="Simple local flow" title="How It Works?" />
          <div className="steps home-steps">
            {[
              {
                title: "Browse Items",
                text: "Explore verified products and swap books from nearby talukas.",
                icon: FiSearch,
              },
              {
                title: "Connect",
                text: "Chat with sellers, ask questions, or send a book swap request.",
                icon: FiUsers,
              },
              {
                title: "Buy or Swap",
                text: "Meet safely, complete the deal, and support your local community.",
                icon: FiCheckCircle,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  className="step-card home-step-card"
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <span>{index + 1}</span>
                  <Icon />
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </motion.article>
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
