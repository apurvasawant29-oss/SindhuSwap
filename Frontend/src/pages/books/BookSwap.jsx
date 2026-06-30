import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBookOpen,
  FiChevronDown,
  FiClock,
  FiX,
  FiHeart,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import PageShell from "../../components/common/PageShell";
import bookCover from "../../assets/images/book-cover.jpg";
import communityImage from "../../assets/images/community.jpg";
import teamMember from "../../assets/images/team-member.jpg";
import alchemistImage from "../../assets/Books/alchemist.jpg";
import richDadImage from "../../assets/Books/rap.jpg";
import atomicImage from "../../assets/Books/atomic.jpg";
import fiveAmImage from "../../assets/Books/5am.jpg";
import ikigaiImage from "../../assets/Books/ikigai.jpg";
import wingsImage from "../../assets/Books/wof.jpg";
import tspImage from "../../assets/Books/tsp.jpg";
import nineteenImage from "../../assets/Books/1984.jpg";

const books = [
  { title: "The Alchemist", author: "Paulo Coelho", condition: "Good", taluka: "Kankavli", status: "Available", image: alchemistImage, genre: "Fiction", owner: "Riya Patil", pages: "208", language: "English", description: "A clean copy of the classic journey story. Perfect for readers who enjoy inspiring fiction and simple, meaningful writing." },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", condition: "Like New", taluka: "Sawantwadi", status: "Popular", image: richDadImage, genre: "Finance", owner: "Omkar Naik", pages: "336", language: "English", description: "A popular personal finance book in excellent condition. Great for beginners learning about money and mindset." },
  { title: "Atomic Habits", author: "James Clear", condition: "Good", taluka: "Malvan", status: "Available", image: atomicImage, genre: "Self Help", owner: "Sneha Sawant", pages: "320", language: "English", description: "Useful for students and professionals who want practical habits, routines, and productivity ideas." },
  { title: "The 5 AM Club", author: "Robin Sharma", condition: "Like New", taluka: "Kudal", status: "New", image: fiveAmImage, genre: "Self Help", owner: "Amit Patkar", pages: "336", language: "English", description: "A motivational read about morning routines, focus, and personal growth. Cover and pages are well maintained." },
  { title: "Ikigai", author: "Hector Garcia", condition: "Good", taluka: "Vengurla", status: "Available", image: ikigaiImage, genre: "Lifestyle", owner: "Maya Naik", pages: "208", language: "English", description: "A peaceful and thoughtful book about purpose, health, and simple living. Good for light reading." },
  { title: "Wings of Fire", author: "A.P.J. Abdul Kalam", condition: "Like New", taluka: "Vaibhavwadi", status: "Trending", image: wingsImage, genre: "Biography", owner: "Sahil Gaonkar", pages: "180", language: "English", description: "Inspiring autobiography of Dr. A.P.J. Abdul Kalam. Great for students and biography readers." },
  { title: "The Silent Patient", author: "Alex Michaelides", condition: "Good", taluka: "Devgad", status: "Available", image: tspImage, genre: "Thriller", owner: "Pranav Jadhav", pages: "336", language: "English", description: "A suspenseful thriller copy available for swap. Best for readers who like mystery and fast-paced stories." },
  { title: "1984", author: "George Orwell", condition: "Good", taluka: "Dodamarg", status: "Classic", image: nineteenImage, genre: "Dystopian", owner: "Tanvi More", pages: "328", language: "English", description: "A classic dystopian novel in readable condition. Perfect for literature readers and students." },
];

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
  const [selectedBook, setSelectedBook] = useState(null);

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
          <input placeholder="Search books by title, author..." />
        </label>
        <button className="select-button" type="button">Select Category <FiChevronDown /></button>
        <button className="select-button" type="button">Select Condition <FiChevronDown /></button>
        <button className="btn btn--primary" type="button">Search</button>
      </section>

      <section className="section container" id="books">
        <div className="section-header">
          <h2>Books Available for Swap</h2>
          <span className="book-count">Total Books: 128</span>
        </div>
        <div className="book-grid book-grid--premium">
          {books.map((book) => <BookCard book={book} onSelect={setSelectedBook} key={book.title} />)}
        </div>
      </section>

      <section className="swap-timeline container">
        <h2>How Book Swap Works?</h2>
        <div className="timeline-grid">
          {steps.map((step, index) => <TimelineStep step={step} index={index} key={step.title} />)}
        </div>
      </section>

      <section className="section container">
        <div className="benefit-grid">
          {["Community", "Education", "Save Money", "Eco Friendly"].map((title) => (
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

      {selectedBook && <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
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

function BookCard({ book, onSelect }) {
  return (
    <motion.article className="book-card book-card--premium" whileHover={{ y: -8 }}>
      <div className="book-card__cover">
        <img src={book.image} alt={`${book.title} cover`} />
        <span>{book.status}</span>
        <button aria-label={`Save ${book.title}`}><FiHeart /></button>
      </div>
      <div className="book-card__body">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <small>{book.condition}</small>
        <div><FiMapPin /> {book.taluka}</div>
        <button type="button" onClick={() => onSelect(book)}>View & Swap</button>
      </div>
    </motion.article>
  );
}

function BookDetailModal({ book, onClose }) {
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
          <img src={book.image} alt={`${book.title} cover`} />
          <span>{book.status}</span>
        </div>
        <div className="book-detail-content">
          <span className="eyebrow"><FiBookOpen /> Book Details</span>
          <h2>{book.title}</h2>
          <p className="book-detail-author">by {book.author}</p>
          <p>{book.description}</p>
          <div className="book-detail-meta">
            <span><FiMapPin /> {book.taluka}</span>
            <span><FiCheckCircle /> {book.condition}</span>
            <span><FiClock /> {book.pages} pages</span>
            <span><FiUsers /> Owner: {book.owner}</span>
          </div>
          <div className="book-detail-tags">
            <span>{book.genre}</span>
            <span>{book.language}</span>
            <span>Swap Only</span>
          </div>
          <div className="book-detail-actions">
            <button className="btn btn--primary" type="button">Request Swap <FiRefreshCw /></button>
            <button className="btn btn--light btn--border" type="button">Save Book <FiHeart /></button>
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
      {index < 2 && <strong>→</strong>}
    </article>
  );
}

export default BookSwap;
