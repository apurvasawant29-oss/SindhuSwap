import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiChevronDown,
  FiGithub,
  FiLinkedin,
  FiRefreshCw,
  FiShield,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import { IoLeafOutline } from "react-icons/io5";
import PageShell from "../../components/common/PageShell";
import fortImage from "../../assets/images/sindhu-fort.jpg";
import teamMember from "../../assets/images/team-member.jpg";
import appu from "../../assets/images/appu.png";
import gauri from "../../assets/images/gauri.png";
import shweta from "../../assets/images/shweta.png";

const stats = [
  { value: "1000+", label: "Happy Users", icon: FiUsers },
  { value: "500+", label: "Products", icon: FiTarget },
  { value: "200+", label: "Book Swaps", icon: FiRefreshCw },
];

const values = [
  { title: "Community First", text: "We believe in building a stronger local network together.", icon: FiUsers },
  { title: "Trust & Safety", text: "We ensure a safe and secure experience for all our users.", icon: FiShield },
  { title: "Sustainability", text: "We promote reuse, recycle, and reduce to protect our environment.", icon: IoLeafOutline },
  { title: "Integrity", text: "We are transparent, honest, and committed to our users.", icon: FiTarget },
];

const team = [
  { name: "Apurva Sawant", role: "Frontend Developer", image: appu },
  { name: "Gauri Sawant", role: "Backend Developer", image: gauri },
  { name: "Shweta Parab", role: "UI/UX Designer", image: shweta },
];

const faqs = [
  ["What is SindhuSwap?", "SindhuSwap is a Sindhudurg-focused marketplace for buying, selling, and swapping useful items locally."],
  ["Can books be sold?", "No. Books are designed for swapping only so students and readers can exchange knowledge affordably."],
  ["Which locations are supported?", "The platform supports the eight talukas of Sindhudurg district."],
  ["Is SindhuSwap free to use?", "The frontend is prepared for free local listings and future REST API integration."],
  ["How do users stay safe?", "Listings are taluka-based, profiles are visible, and the product flow is designed around trust signals."],
];

function About() {
  return (
    <PageShell>
      <section className="about-hero container">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow"><FiUsers /> About Us</span>
          <h1>Building a Better Marketplace for <span>Sindhudurg</span></h1>
          <p>
            SindhuSwap is a community marketplace dedicated to buying, selling,
            and swapping second-hand items and books within Sindhudurg. Our
            mission is to create a trusted platform that connects people,
            promotes sustainability, and strengthens our local community.
          </p>
          <div className="about-stats">
            {stats.map((stat) => <StatCard stat={stat} key={stat.label} />)}
          </div>
        </motion.div>
        <motion.div className="about-hero__image" initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }}>
          <img src={fortImage} alt="Sindhudurg Fort" />
          <div>Proudly Made for <strong>Sindhudurg</strong></div>
        </motion.div>
      </section>

      <section className="mission-grid container">
        <InfoPanel icon={FiTarget} title="Our Mission" text="To empower the people of Sindhudurg by providing a safe, easy, and efficient platform to buy, sell, and swap pre-owned items and books while reducing waste." />
        <InfoPanel icon={FiUsers} title="Our Vision" text="To become the most trusted and loved marketplace in Sindhudurg, where sustainability meets community and everyone benefits." />
      </section>

      <section className="section container">
        <h2>Our Core Values</h2>
        <div className="value-grid">
          {values.map((value) => <ValueCard value={value} key={value.title} />)}
        </div>
      </section>

      <section className="story-section container">
        <div>
          <h2>Our Story</h2>
          <div className="story-line">
            {["Started with a simple idea for local exchange.", "Helped students swap books instead of buying every time.", "Grew into a cleaner, trusted marketplace for families."].map((item) => (
              <article key={item}>
                <span />
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
        <img src={teamMember} alt="SindhuSwap team illustration placeholder" />
      </section>

      <section className="section container">
        <h2>Meet The Team</h2>
        <div className="team-grid">
          {team.map((person) => <TeamCard person={person} key={person.name} />)}
        </div>
      </section>

      <section className="section container">
        <h2>FAQ</h2>
        <div className="faq-list">
          {faqs.map(([question, answer]) => <FaqItem question={question} answer={answer} key={question} />)}
        </div>
      </section>

      <section className="book-cta container">
        <div>
          <h2>Join SindhuSwap Today</h2>
          <p>Start buying, start selling, or start swapping with your local community.</p>
        </div>
        <div className="cta-actions">
          <a className="btn btn--primary" href="/categories">Start Buying</a>
          <a className="btn btn--light btn--border" href="/add-product">Start Selling</a>
          <a className="btn btn--dark" href="/bookswap">Start Swapping</a>
        </div>
      </section>
    </PageShell>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return <article><Icon /><strong>{stat.value}</strong><span>{stat.label}</span></article>;
}

function InfoPanel({ icon: Icon, title, text }) {
  return <motion.article className="info-panel" whileHover={{ y: -6 }}><Icon /><div><h3>{title}</h3><p>{text}</p></div></motion.article>;
}

function ValueCard({ value }) {
  const Icon = value.icon;
  return <motion.article className="value-card" whileHover={{ y: -6 }}><Icon /><h3>{value.title}</h3><p>{value.text}</p></motion.article>;
}

function TeamCard({ person }) {
  return (
    <motion.article className="team-card" whileHover={{ y: -7 }}>
      <img src={person.image} alt={person.name} />
      <div>
        <h3>{person.name}</h3>
        <p>{person.role}</p>
        <span><FiLinkedin /><FiGithub /></span>
      </div>
    </motion.article>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`faq-item ${open ? "is-open" : ""}`}>
      <button type="button" onClick={() => setOpen((current) => !current)}>
        {question}<FiChevronDown />
      </button>
      {open && <p>{answer}</p>}
    </article>
  );
}

export default About;
