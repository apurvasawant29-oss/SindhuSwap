import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiHeart,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageShell from "../../components/common/PageShell";
import bookCover from "../../assets/images/book-cover.jpg";
import communityImage from "../../assets/images/community.jpg";
import teamMember from "../../assets/images/team-member.jpg";
import { productApi } from "../../api/productApi";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { getProductImageSrc } from "../../utils/productImage";

const benefits = [
  { title: "Save Money", text: "Get books for free by swapping.", icon: FiRefreshCw },
  { title: "Sustainable", text: "Reuse books and help the environment.", icon: FiShield },
  { title: "Community Learning", text: "Connect with fellow book lovers.", icon: FiUsers },
];

const steps = [
  { title: "Find a Book", text: "Search for books you want to read.", icon: FiSearch },
  { title: "Request Swap", text: "Send a swap request to the owner.", icon: FiRefreshCw },
  { title: "Exchange & Enjoy", text: "Exchange books and enjoy reading.", icon: FiBookOpen },
];

function BookSwap() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Books");
  const [condition, setCondition] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 8, totalPages: 1, totalItems: 0 });
  const { isUserAuthenticated } = useAuth();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const response = await productApi.list({
          category: category === "All" ? "Books" : category,
          search: search.trim(),
          condition: condition === "All" ? "" : condition,
          page,
          limit: 8,
          sort: "-createdAt",
        });

        setBooks(response.data.products || []);
        const nextPagination = response.data.pagination || { page: 1, limit: 8, totalPages: 1, total: 0 };
        setPagination({ ...nextPagination, totalItems: nextPagination.totalItems ?? nextPagination.total ?? 0 });
        setError("");
      } catch (err) {
        setError(err.message || "Unable to load books right now.");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [category, condition, page, search]);

  const totalItems = useMemo(() => pagination.totalItems ?? pagination.total ?? books.length, [books.length, pagination.total, pagination.totalItems]);

  return (
    <PageShell>
      <section className="book-hero container">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <span className="eyebrow"><FiBookOpen /> Book Swap</span>
          <h1>Swap Books,<br />Share <span>Knowledge</span></h1>
          <p>
            Give your books a new home and discover stories, guides, and textbooks
            from readers across Sindhudurg. Learn together, grow together.
          </p>
          <div className="hero__buttons">
            <a className="btn btn--primary" href="#books">Swap Now</a>
            <a className="btn btn--light btn--border" href="#list-book">List Your Book</a>
          </div>
          <div className="book-benefits">
            {benefits.map((item) => <MiniFeature item={item} key={item.title} />)}
          </div>
        </motion.div>

        <motion.div className="book-visual" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65 }}>
          <div className="book-visual__orbit" />
          <img className="book-visual__stack" src={bookCover} alt="Stacked books illustration placeholder" />
          <span className="book-visual__swap"><FiRefreshCw /></span>
          <img className="student student--one" src={teamMember} alt="Student" />
          <img className="student student--two" src={communityImage} alt="Student" />
          <img className="student student--three" src={teamMember} alt="Student" />
        </motion.div>
      </section>

      <section className="swap-search container" aria-label="Search books">
        <label>
          <FiSearch />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search books by title, author..." />
        </label>
        <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="select-button" aria-label="Select Category">
          <option value="All">Select Category</option>
          <option value="Books">Books</option>
        </select>
        <select value={condition} onChange={(event) => { setCondition(event.target.value); setPage(1); }} className="select-button" aria-label="Select Condition">
          <option value="All">Select Condition</option>
          <option value="Like New">Like New</option>
          <option value="Good">Good</option>
          <option value="Excellent">Excellent</option>
          <option value="Fair">Fair</option>
        </select>
        <button className="btn btn--primary" type="button" onClick={() => setPage(1)}>Search</button>
      </section>

      <section className="section container" id="books">
        <div className="section-header">
          <h2>Books Available for Swap</h2>
          <span className="book-count">Total Books: {totalItems}</span>
        </div>

        {loading ? (
          <div className="empty-state container"><p>Loading books from the community...</p></div>
        ) : error ? (
          <div className="empty-state container"><p>{error}</p></div>
        ) : books.length === 0 ? (
          <div className="empty-state container"><p>No books match your filters right now.</p></div>
        ) : (
          <>
            <div className="book-grid book-grid--premium">
              {books.map((book) => <BookCard book={book} onSelect={setSelectedBook} key={book.id || book._id} />)}
            </div>
            <div className="section-header" style={{ marginTop: "1.5rem" }}>
              <button className="btn btn--light btn--border" type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button>
              <span className="book-count">Page {pagination.page || page} of {pagination.totalPages || 1}</span>
              <button className="btn btn--light btn--border" type="button" disabled={page >= (pagination.totalPages || 1)} onClick={() => setPage((current) => current + 1)}>Next</button>
            </div>
          </>
        )}
      </section>

      <section className="swap-timeline container">
        <h2>How Book Swap Works?</h2>
        <div className="timeline-grid">
          {steps.map((step, index) => <TimelineStep step={step} index={index} key={step.title} />)}
        </div>
      </section>

      <section className="section container">
        <div className="benefit-grid">
          {['Community', 'Education', 'Save Money', 'Eco Friendly'].map((title) => (
            <motion.article className="feature-card" whileHover={{ y: -6 }} key={title}>
              <FiBookOpen />
              <h3>{title}</h3>
              <p>Make learning more accessible while supporting a cleaner, more connected district.</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="book-cta container" id="list-book">
        <div>
          <h2>Have books collecting dust?</h2>
          <p>Swap them today and help someone find their next favorite read.</p>
        </div>
        <a className="btn btn--primary" href="/add-product">List My Books</a>
      </section>

      {selectedBook && <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} isAuthenticated={isUserAuthenticated} />}
    </PageShell>
  );
}

function MiniFeature({ item }) {
  const Icon = item.icon;
  return (
    <article>
      <Icon />
      <div>
        <strong>{item.title}</strong>
        <span>{item.text}</span>
      </div>
    </article>
  );
}

function BookCard({ book, onSelect, isAuthenticated }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isInWishlist(book.id || book._id);
  const navigate = useNavigate();

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Please login to save this item.");
      navigate("/login");
      return;
    }

    if (wishlisted) {
      await removeFromWishlist(book.id || book._id);
    } else {
      await addToWishlist(book);
    }
  };

  return (
    <motion.article className="book-card group" whileHover={{ y: -6 }}>
      <div className="book-card__cover">
        <img src={getProductImageSrc(book)} alt={`${book.title} cover`} />
        <span>{book.status || "Available"}</span>
        <button 
          aria-label={`Save ${book.title}`} 
          type="button" 
          onClick={handleWishlist}
          className={wishlisted ? "text-red-500" : ""}
        >
          <FiHeart className={wishlisted ? "fill-current" : ""} />
        </button>
      </div>
      <div className="book-card__body">
        <h3>{book.title}</h3>
        <p>{book.seller || "Community Seller"}</p>
        <small>{book.condition}</small>
        <div><FiMapPin /> {book.taluka}</div>
        <button type="button" onClick={() => onSelect(book)}>View & Swap</button>
      </div>
    </motion.article>
  );
}

function BookDetailModal({ book, onClose, isAuthenticated }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isInWishlist(book.id || book._id);

  const handleSwapRequest = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to request a swap.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await productApi.requestSwap(book.id || book._id, { message: "I would like to swap for this book." });
      toast.success("Swap request sent successfully.");
      onClose();
    } catch (error) {
      toast.error(error.message || "Unable to send swap request.");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to save this item.");
      navigate("/login");
      return;
    }

    if (wishlisted) {
      await removeFromWishlist(book.id || book._id);
    } else {
      await addToWishlist(book);
    }
  };

  return (
    <div className="book-modal-backdrop" role="presentation" onClick={onClose}>
      <motion.article
        className="book-detail-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="book-modal-close" type="button" onClick={onClose} aria-label="Close book details">
          <FiX />
        </button>
        <div className="book-detail-cover">
          <img src={getProductImageSrc(book)} alt={`${book.title} cover`} />
          <span>{book.status || "Available"}</span>
        </div>
        <div className="book-detail-content">
          <span className="eyebrow"><FiBookOpen /> Book Details</span>
          <h2>{book.title}</h2>
          <p className="book-detail-author">by {book.seller || "Community Seller"}</p>
          <p>{book.description}</p>
          <div className="book-detail-meta">
            <span><FiMapPin /> {book.taluka}</span>
            <span><FiCheckCircle /> {book.condition}</span>
            <span><FiClock /> {book.price ? `Rs. ${book.price}` : "Swap Only"}</span>
            <span><FiUsers /> Owner: {book.seller || "Community Seller"}</span>
          </div>
          <div className="book-detail-tags">
            <span>{book.category}</span>
            <span>{book.productType || "Swap"}</span>
            <span>{book.condition}</span>
          </div>
          <div className="book-detail-actions">
            <button className="btn btn--primary" type="button" onClick={handleSwapRequest} disabled={loading}>{loading ? "Sending..." : "Request Swap"} <FiRefreshCw /></button>
            <button className="btn btn--light btn--border" type="button" onClick={handleWishlist}>{wishlisted ? "Saved" : "Save Book"} <FiHeart /></button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function TimelineStep({ step, index }) {
  const Icon = step.icon;
  return (
    <article className="timeline-step">
      <span><Icon /></span>
      <div>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </div>
      {index < 2 && <strong>â†’</strong>}
    </article>
  );
}

export default BookSwap;


