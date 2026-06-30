import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCpu,
  FiHeart,
  FiHome,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiSmartphone,
  FiStar,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { FaBicycle, FaLaptop, FaTshirt } from "react-icons/fa";
import { GiSofa } from "react-icons/gi";
import PageShell from "../../components/common/PageShell";
import SectionHeader from "../../components/common/SectionHeader";
import ProductCard from "../../components/cards/ProductCard";
import fortImage from "../../assets/sindhu.jpg";
import productImage from "../../assets/sawantwadi.jpg";
import peopleImage from "../../assets/us.jpeg";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const categories = [
  { name: "Electronics", icon: FiCpu, tone: "mint" },
  { name: "Furniture", icon: GiSofa, tone: "amber" },
  { name: "Books", icon: FiBookOpen, tone: "violet" },
  { name: "Mobiles", icon: FiSmartphone, tone: "sky" },
  { name: "Bikes", icon: FaBicycle, tone: "rose" },
  { name: "Fashion", icon: FaTshirt, tone: "pink" },
  { name: "Sports", icon: FiTruck, tone: "orange" },
  { name: "Others", icon: FiHome, tone: "slate" },
];

const listings = [
  {
    name: "Dell Inspiron 15",
    price: "Rs. 22,000",
    location: "Kopargaon",
    seller: "Verified seller",
    condition: "Good",
    rating: "4.8",
    image: productImage,
  },
  {
    name: "Royal Enfield Classic 350",
    price: "Rs. 95,000",
    location: "Shrirampur",
    seller: "Local owner",
    condition: "Excellent",
    rating: "4.9",
    image: fortImage,
  },
  {
    name: "Study Table",
    price: "Rs. 2,500",
    location: "Nevasa",
    seller: "Student",
    condition: "Like new",
    rating: "4.7",
    image: peopleImage,
  },
  {
    name: "Let Us C Programming",
    price: "Swap Now",
    location: "Sangamner",
    seller: "Book swapper",
    condition: "Readable",
    rating: "4.6",
    image: productImage,
  },
  {
    name: "3 Seater Sofa",
    price: "Rs. 8,500",
    location: "Rahata",
    seller: "Verified seller",
    condition: "Good",
    rating: "4.8",
    image: fortImage,
  },
  {
    name: "Samsung Galaxy M31",
    price: "Rs. 7,000",
    location: "Kopargaon",
    seller: "Local owner",
    condition: "Fair",
    rating: "4.5",
    image: peopleImage,
  },
];

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

function Home() {
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
            <div className="hero__buttons">
              <a className="btn btn--primary" href="/categories">
                <FiShoppingBag /> Explore Items
              </a>
              <a className="btn btn--light" href="/bookswap">
                <FiRefreshCw /> Book Swap
              </a>
            </div>
            <div className="trust-row">
              <span><FiUsers /> Local Community</span>
              <span><FiShield /> Trusted Sellers</span>
              <span><FiCheckCircle /> Secure Marketplace</span>
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
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.a
              href="/categories"
              className={`category-card category-card--${category.tone}`}
              key={category.name}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Icon />
              <span>{category.name}</span>
            </motion.a>
          );
        })}
      </section>

      <section className="section container featured-home-section">
        <SectionHeader
          title="Featured Listings"
          action={
            <div className="pager">
              <button aria-label="Previous listing"><FiChevronLeft /></button>
              <button aria-label="Next listing"><FiChevronRight /></button>
            </div>
          }
        />
        <div className="product-grid">
          {listings.map((item) => (
            <ProductCard item={item} key={item.name} />
          ))}
        </div>
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
              <article className="stat-card" key={stat.label}>
                <Icon />
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            );
          })}
        </div>
        <div className="work-panel home-how-panel">
          <SectionHeader eyebrow="Simple local flow" title="How It Works?" />
          <div className="steps home-steps">
            {[
              { title: "Browse Items", text: "Explore verified products and swap books from nearby talukas.", icon: FiSearch },
              { title: "Connect", text: "Chat with sellers, ask questions, or send a book swap request.", icon: FiUsers },
              { title: "Buy or Swap", text: "Meet safely, complete the deal, and support your local community.", icon: FiCheckCircle },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
              <article className="step-card home-step-card" key={step.title}>
                <span>{index + 1}</span>
                <Icon />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            )})}
          </div>
        </div>
      </motion.section>

      <section className="section container">
        <SectionHeader title="Why Choose SindhuSwap?" />
        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article className="feature-card" key={feature.title} whileHover={{ y: -6 }}>
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
            <article className="update-card" key={update.title}>
              <img src={update.image} alt="" />
              <div>
                <span>{update.label}</span>
                <h3>{update.title}</h3>
                <a href="/">
                  Read More <FiArrowRight />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader eyebrow="Community voices" title="Loved by Local Users" />
          <div className="testimonial-grid">
            {testimonials.map((person) => (
              <article className="testimonial-card" key={person.name}>
                <div className="stars">
                  {Array.from({ length: person.rating }).map((_, index) => (
                    <FiStar key={index} />
                  ))}
                </div>
                <p>"{person.text}"</p>
                <div className="testimonial-card__user">
                  <span>{person.name.charAt(0)}</span>
                  <div>
                    <strong>{person.name}</strong>
                    <small>{person.role}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta container">
        <div>
          <span className="eyebrow">Ready to Buy or Swap?</span>
          <h2>Join SindhuSwap Today.</h2>
          <p>Start with your taluka, discover nearby listings, and keep useful items moving.</p>
        </div>
        <a className="btn btn--dark" href="/signup">
          Get Started <FiArrowRight />
        </a>
      </section>
    </PageShell>
  );
}

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

export default Home;
