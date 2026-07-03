import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiBell,
  FiBookOpen,
  FiBox,
  FiCamera,
  FiCheckCircle,
  FiEdit3,
  FiHeart,
  FiInbox,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSettings,
  FiShoppingBag,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import PageShell from "../../components/common/PageShell";
import coverImage from "../../assets/images/sindhu-fort.jpg";
import profileImage from "../../assets/images/appu.png";
import productImage from "../../assets/images/book-cover.jpg";
import listingImage from "../../assets/images/community.jpg";

const profileStats = [
  { label: "Products Listed", value: "12", icon: FiBox },
  { label: "Products Sold", value: "8", icon: FiShoppingBag },
  { label: "Book Swaps", value: "5", icon: FiBookOpen },
  { label: "Overall Rating", value: "4.9", icon: FiStar },
];

const sidebarLinks = [
  { id: "overview", label: "My Profile", icon: FiCheckCircle },
  { id: "edit", label: "Edit Profile", icon: FiEdit3 },
  { id: "listings", label: "My Listings", icon: FiBox },
  { id: "add", label: "Add Product", icon: FiPlus },
  { id: "wishlist", label: "Wishlist", icon: FiHeart },
  { id: "swaps", label: "Book Swap Requests", icon: FiBookOpen },
  { id: "inbox", label: "Inbox", icon: FiInbox },
  { id: "notifications", label: "Notifications", icon: FiBell },
  { id: "settings", label: "Settings", icon: FiSettings },
];

const quickActions = [
  { id: "add", label: "List New Product", icon: FiPlus },
  { id: "swaps", label: "Swap Books", icon: FiBookOpen },
  { id: "wishlist", label: "Wishlist", icon: FiHeart },
  { id: "inbox", label: "Inbox", icon: FiInbox },
  { id: "settings", label: "Settings", icon: FiSettings },
];

const listings = [
  { name: "Wooden Study Chair", category: "Furniture", price: "Rs. 1,200", taluka: "Kudal", status: "Active", image: listingImage },
  { name: "Dell Inspiron 15", category: "Electronics", price: "Rs. 22,000", taluka: "Malvan", status: "Sold", image: productImage },
  { name: "Rich Dad Poor Dad", category: "Books", price: "Swap Only", taluka: "Sawantwadi", status: "Swapped", image: productImage },
];

const wishlistItems = [
  { name: "MacBook Air M1", category: "Electronics", price: "Rs. 65,000", taluka: "Kankavli", status: "Saved", image: listingImage },
  { name: "Atomic Habits", category: "Books", price: "Swap Only", taluka: "Vengurla", status: "Saved", image: productImage },
  { name: "Study Table", category: "Furniture", price: "Rs. 2,800", taluka: "Sawantwadi", status: "Saved", image: listingImage },
];

const activities = [
  { title: "Product Added", text: "Listed Wooden Study Chair in Furniture.", date: "Today" },
  { title: "Book Swapped", text: "Swapped Rich Dad Poor Dad with Sneha.", date: "2 days ago" },
  { title: "Review Received", text: "Received a 5-star review from Rohit.", date: "5 days ago" },
  { title: "Product Sold", text: "Sold Dell Inspiron 15 in Malvan.", date: "1 week ago" },
];

const reviews = [
  { name: "Rohit Naik", text: "Friendly seller and quick response. Product matched the listing.", date: "2 days ago" },
  { name: "Sneha Sawant", text: "Book swap was smooth and the book was in great condition.", date: "1 week ago" },
];

function Profile() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageShell>
      <section className="profile-layout container">
        <aside className="profile-sidebar">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                className={activeTab === link.id ? "is-active" : ""}
                type="button"
                onClick={() => setActiveTab(link.id)}
                key={link.id}
              >
                <Icon /> {link.label}
              </button>
            );
          })}
          <div className="profile-sidebar__promo">
            <FiShoppingBag />
            <h3>Buy, Sell & Swap in your community</h3>
            <p>Join thousands of people in Sindhudurg and support local exchange.</p>
            <button className="btn btn--primary" type="button" onClick={() => setActiveTab("add")}>Add New Product</button>
          </div>
        </aside>

        <div className="profile-main">
          {activeTab === "overview" && <OverviewPanel onNavigate={setActiveTab} />}
          {activeTab === "edit" && <EditProfilePanel />}
          {activeTab === "listings" && <ListingsPanel title="My Listings" items={listings} />}
          {activeTab === "add" && <AddProductMiniPanel />}
          {activeTab === "wishlist" && <WishlistPanel onNavigate={setActiveTab} />}
          {activeTab === "swaps" && <SimplePanel title="Book Swap Requests" icon={FiRefreshCw} />}
          {activeTab === "inbox" && <SimplePanel title="Inbox" icon={FiInbox} />}
          {activeTab === "notifications" && <SimplePanel title="Notifications" icon={FiBell} />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </section>

      <button className="floating-add" type="button" onClick={() => setActiveTab("add")} aria-label="Add new product">
        <FiPlus />
      </button>
    </PageShell>
  );
}

function OverviewPanel({ onNavigate }) {
  return (
    <>
      <ProfileHeader onEdit={() => onNavigate("edit")} />
      <div className="profile-stats-grid">
        {profileStats.map((stat) => <StatsCard stat={stat} key={stat.label} />)}
      </div>
      <section className="profile-section">
        <div className="section-header"><h2>Quick Actions</h2></div>
        <div className="quick-action-grid">
          {quickActions.map((action) => <QuickAction action={action} onNavigate={onNavigate} key={action.id} />)}
        </div>
      </section>
      <ListingsPanel title="My Listings" items={listings} compact />
      <div className="profile-two-column">
        <section className="profile-section">
          <div className="section-header"><h2>Recent Activities</h2></div>
          <div className="activity-list">
            {activities.map((activity) => <ActivityItem activity={activity} key={activity.title} />)}
          </div>
        </section>
        <section className="profile-section">
          <div className="section-header"><h2>Recent Reviews</h2></div>
          <div className="review-list">
            {reviews.map((review) => <ReviewCard review={review} key={review.name} />)}
          </div>
        </section>
      </div>
    </>
  );
}

function ProfileHeader({ onEdit }) {
  return (
    <motion.section className="profile-header" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <img className="profile-header__cover" src={coverImage} alt="" />
      <div className="profile-header__content">
        <div className="profile-photo-wrap">
          <img src={profileImage} alt="Apurva Sawant" />
          <button aria-label="Change profile photo"><FiCamera /></button>
        </div>
        <div>
          <h1>Apurva Sawant <FiCheckCircle /></h1>
          <p>apurvasawant29@gmail.com</p>
          <span><FiMapPin /> Sawantwadi, Sindhudurg</span>
          <span>Member since July 2026</span>
        </div>
        <button className="btn btn--light" type="button" onClick={onEdit}><FiEdit3 /> Edit Profile</button>
      </div>
    </motion.section>
  );
}

function StatsCard({ stat }) {
  const Icon = stat.icon;
  return (
    <motion.article className="profile-stat-card" whileHover={{ y: -6 }}>
      <Icon />
      <strong>{stat.value}</strong>
      <span>{stat.label}</span>
    </motion.article>
  );
}

function QuickAction({ action, onNavigate }) {
  const Icon = action.icon;
  return (
    <motion.button className="quick-action-card" type="button" onClick={() => onNavigate(action.id)} whileHover={{ y: -6 }}>
      <Icon />
      <span>{action.label}</span>
    </motion.button>
  );
}

function ListingsPanel({ title, items, compact = false }) {
  return (
    <section className="profile-section">
      <div className="section-header"><h2>{title}</h2></div>
      <div className="profile-listing-grid">
        {(compact ? items.slice(0, 3) : items).map((item) => <ListingCard item={item} key={item.name} />)}
      </div>
    </section>
  );
}

function ListingCard({ item }) {
  return (
    <motion.article className="profile-listing-card" whileHover={{ y: -8 }}>
      <img src={item.image} alt={item.name} />
      <div>
        <span className={`status status--${item.status.toLowerCase()}`}>{item.status}</span>
        <h3>{item.name}</h3>
        <p>{item.category} • {item.taluka}</p>
        <strong>{item.price}</strong>
        <div className="listing-actions">
          <button type="button"><FiEdit3 /> Edit</button>
          <button type="button"><FiTrash2 /> Delete</button>
          <button type="button"><FiCheckCircle /> Mark Sold</button>
        </div>
      </div>
    </motion.article>
  );
}

function EditProfilePanel() {
  return (
    <motion.section className="profile-section profile-form-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="section-header"><h2>Edit Profile</h2></div>
      <div className="edit-profile-hero">
        <img src={profileImage} alt="Apurva Sawant" />
        <button className="btn btn--light btn--border" type="button"><FiCamera /> Change Photo</button>
      </div>
      <div className="profile-form-grid">
        <label><span>Full Name</span><input defaultValue="Apurva Sawant" /></label>
        <label><span>Email</span><input defaultValue="apurvasawant29@gmail.com" /></label>
        <label><span>Phone</span><input defaultValue="+91 9420105073" /></label>
        <label><span>Taluka</span><select defaultValue="Sawantwadi"><option>Sawantwadi</option><option>Kudal</option><option>Malvan</option></select></label>
        <label className="profile-form-grid__full"><span>Bio</span><textarea defaultValue="I love books, minimal living, and helping my community by buying, selling, and swapping second-hand items." /></label>
      </div>
      <button className="btn btn--primary" type="button">Save Changes</button>
    </motion.section>
  );
}

function WishlistPanel({ onNavigate }) {
  return (
    <>
      <ListingsPanel title="Wishlist" items={wishlistItems} />
      <section className="profile-section add-product-strip">
        <div>
          <h2>Add New Products</h2>
          <p>List something from your room, shelf, or study table and reach nearby buyers.</p>
        </div>
        <button className="btn btn--primary" type="button" onClick={() => onNavigate("add")}><FiPlus /> Add Product</button>
      </section>
    </>
  );
}

function AddProductMiniPanel() {
  return (
    <motion.section className="profile-section profile-form-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="section-header"><h2>Add New Product</h2></div>
      <div className="profile-form-grid">
        <label><span>Product Title</span><input placeholder="e.g. Study table, phone, book" /></label>
        <label><span>Category</span><select><option>Electronics</option><option>Furniture</option><option>Books</option></select></label>
        <label><span>Price</span><input placeholder="Rs. 2,500 or Swap Only" /></label>
        <label><span>Taluka</span><select><option>Sawantwadi</option><option>Kudal</option><option>Malvan</option></select></label>
        <label className="profile-form-grid__full"><span>Description</span><textarea placeholder="Add condition, usage, and pickup details" /></label>
      </div>
      <a className="btn btn--primary" href="/add-product"><FiPlus /> Open Full Add Product Page</a>
    </motion.section>
  );
}

function SettingsPanel() {
  return (
    <motion.section className="profile-section profile-form-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="section-header"><h2>Settings</h2></div>
      <div className="settings-list">
        {["Email notifications", "Wishlist alerts", "Book swap updates", "Profile visibility"].map((item) => (
          <label key={item}><span>{item}</span><input type="checkbox" defaultChecked /></label>
        ))}
      </div>
      <button className="btn btn--primary" type="button">Save Settings</button>
    </motion.section>
  );
}

function SimplePanel({ title, icon: Icon }) {
  return (
    <motion.section className="profile-section empty-profile-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <Icon />
      <h2>{title}</h2>
      <p>This section is ready for backend data. The UI is connected and updates from the profile sidebar.</p>
    </motion.section>
  );
}

function ActivityItem({ activity }) {
  return (
    <article className="activity-item">
      <span />
      <div>
        <strong>{activity.title}</strong>
        <p>{activity.text}</p>
      </div>
      <small>{activity.date}</small>
    </article>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="profile-review-card">
      <img src={profileImage} alt={review.name} />
      <div>
        <div className="stars">{[1, 2, 3, 4, 5].map((star) => <FiStar key={star} />)}</div>
        <strong>{review.name}</strong>
        <p>{review.text}</p>
        <small>{review.date}</small>
      </div>
    </article>
  );
}

export default Profile;
