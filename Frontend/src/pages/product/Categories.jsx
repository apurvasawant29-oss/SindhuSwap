import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBookOpen,
  FiCpu,
  FiHeart,
  FiHome,
  FiRefreshCw,
  FiShoppingBag,
  FiSmartphone,
  FiUsers,
} from "react-icons/fi";
import { FaBicycle, FaFootballBall, FaTshirt } from "react-icons/fa";
import { GiSofa, GiToyMallet, GiWaterBottle } from "react-icons/gi";
import { IoLeafOutline } from "react-icons/io5";
import PageShell from "../../components/common/PageShell";
import heroImage from "../../assets/images/community.jpg";
import bookImage from "../../assets/images/book-cover.jpg";
import productImage from "../../assets/images/sindhu-fort.jpg";

const categoryStats = [
  { value: "5000+", label: "Active Listings", icon: FiShoppingBag },
  { value: "1200+", label: "Happy Users", icon: FiUsers },
  { value: "200+", label: "Book Swaps", icon: FiRefreshCw },
  { value: "50+", label: "Categories", icon: FiCpu },
];

const categories = [
  { name: "Electronics", count: "1,245 items", text: "Laptops, Cameras, Accessories & more", icon: FiCpu, image: productImage },
  { name: "Mobiles", count: "2,312 items", text: "Smartphones, Tablets, Accessories & more", icon: FiSmartphone, image: heroImage },
  { name: "Furniture", count: "945 items", text: "Beds, Sofas, Tables, Chairs & more", icon: GiSofa, image: productImage },
  { name: "Books", count: "1,563 items", text: "Novels, Textbooks, Comics & more", icon: FiBookOpen, image: bookImage },
  { name: "Fashion", count: "1,872 items", text: "Men, Women, Kids Clothing & more", icon: FaTshirt, image: heroImage },
  { name: "Sports", count: "732 items", text: "Equipment, Fitness, Outdoor Games & more", icon: FaFootballBall, image: productImage },
  { name: "Home & Kitchen", count: "654 items", text: "Appliances, Decor, Cookware & more", icon: FiHome, image: heroImage },
  { name: "Vehicles", count: "321 items", text: "Bikes, Scooters, Accessories & more", icon: FaBicycle, image: productImage },
  { name: "Toys & Games", count: "412 items", text: "Toys, Board Games, Puzzles & more", icon: GiToyMallet, image: bookImage },
  { name: "Beauty & Health", count: "298 items", text: "Skincare, Makeup, Tools & more", icon: GiWaterBottle, image: heroImage },
  { name: "Plants & Garden", count: "189 items", text: "Indoor Plants, Pots, Gardening Tools & more", icon: IoLeafOutline, image: productImage },
  { name: "Others", count: "234 items", text: "Miscellaneous items & more", icon: FiHeart, image: bookImage },
];

function Categories() {
  return (
    <PageShell>
      <section className="categories-hero container">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow"><FiShoppingBag /> Browse Categories</span>
          <h1>Explore All <span>Categories</span></h1>
          <p>
            Find exactly what you need from a wide range of categories. Buy,
            sell, and swap with ease.
          </p>
        </motion.div>
        <motion.div className="category-basket" initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }}>
          <img src={heroImage} alt="Marketplace categories basket" />
        </motion.div>
      </section>

      <section className="category-stat-row container">
        {categoryStats.map((stat) => <CategoryStat stat={stat} key={stat.label} />)}
      </section>

      <section className="all-categories-grid container">
        {categories.map((category) => <CategoryTile category={category} key={category.name} />)}
      </section>

      <section className="category-book-cta container">
        <img src={bookImage} alt="Books to swap" />
        <div>
          <h2>Have books to swap?</h2>
          <p>Join our Book Swap community and exchange books you love with others.</p>
        </div>
        <Link className="btn btn--primary" to="/bookswap">Go to Book Swap <FiArrowRight /></Link>
      </section>
    </PageShell>
  );
}

function CategoryStat({ stat }) {
  const Icon = stat.icon;
  return (
    <motion.article whileHover={{ y: -5 }}>
      <Icon />
      <strong>{stat.value}</strong>
      <span>{stat.label}</span>
    </motion.article>
  );
}

function CategoryTile({ category }) {
  const Icon = category.icon;
  return (
    <motion.div whileHover={{ y: -8 }}>
      <Link className="category-tile block" to={`/categories/${category.name.toLowerCase().replaceAll(" ", "-")}`}>
        <img src={category.image} alt={category.name} />
        <div>
          <h3>{category.name}</h3>
          <strong>{category.count}</strong>
          <p>{category.text}</p>
          <span>Explore <FiArrowRight /></span>
        </div>
        <Icon />
      </Link>
    </motion.div>
  );
}

export default Categories;
