import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiChevronDown, FiLifeBuoy, FiLock, FiMessageCircle, FiRefreshCw, FiSend, FiShield, FiUser } from "react-icons/fi";
import PageShell from "../../components/common/PageShell";
import helpImage from "../../assets/images/community.jpg";

const topics = [
  { title: "Getting Started", text: "Create your account and explore local listings.", icon: FiUser },
  { title: "Safety Tips", text: "Learn how to buy, sell, and swap safely.", icon: FiShield },
  { title: "Swap Process", text: "Understand book swaps from request to exchange.", icon: FiRefreshCw },
  { title: "Community Guidelines", text: "Keep SindhuSwap trusted and respectful.", icon: FiLock },
];

const faqs = [
  ["Account & Profile", "How do I update my profile?", "Go to Profile, choose Edit Profile, and save your updated details."],
  ["Book Swaps", "Can I sell books?", "No. Books can only be swapped to keep learning affordable."],
  ["Payments & Shipping", "Does SindhuSwap handle payments?", "The current frontend is ready for future API payment integrations."],
  ["Returns & Refunds", "How are returns handled?", "Users should agree on condition and exchange details before completing a deal."],
  ["Technical Support", "What if something is not working?", "Send a message through the support form and our team will help."],
];

function HelpCenter() {
  return (
    <PageShell>
      <section className="help-hero container">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow"><FiLifeBuoy /> Help Center</span>
          <h1>How can we help you today?</h1>
          <p>Find answers about accounts, swaps, safety, returns, and technical support.</p>
        </motion.div>
        <motion.img src={helpImage} alt="Help center illustration" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} />
      </section>

      <section className="section container">
        <div className="help-topic-grid">
          {topics.map((topic) => <HelpTopic topic={topic} key={topic.title} />)}
        </div>
      </section>

      <section className="help-content container">
        <div className="help-faq-panel">
          <h2>Frequently Asked Questions</h2>
          {faqs.map(([category, question, answer]) => <AccordionItem category={category} question={question} answer={answer} key={category} />)}
        </div>
        <form className="help-support-form">
          <h2>Contact Support</h2>
          <input placeholder="Your name" />
          <input placeholder="Email address" />
          <input placeholder="Subject" />
          <textarea placeholder="Tell us what happened" />
          <button className="btn btn--primary" type="submit">Submit Request <FiSend /></button>
        </form>
      </section>

      <section className="chat-cta container">
        <div>
          <h2>Need a faster answer?</h2>
          <p>Chat with us for quick guidance on listings, swaps, and account questions.</p>
        </div>
        <a className="btn btn--dark" href="/contact"><FiMessageCircle /> Chat with Us <FiArrowRight /></a>
      </section>
    </PageShell>
  );
}

function HelpTopic({ topic }) {
  const Icon = topic.icon;
  return (
    <motion.article className="help-topic-card" whileHover={{ y: -6 }}>
      <Icon />
      <h3>{topic.title}</h3>
      <p>{topic.text}</p>
    </motion.article>
  );
}

function AccordionItem({ category, question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`help-accordion ${open ? "is-open" : ""}`}>
      <button type="button" onClick={() => setOpen((current) => !current)}>
        <span>{category}</span>
        <strong>{question}</strong>
        <FiChevronDown />
      </button>
      {open && <p>{answer}</p>}
    </article>
  );
}

export default HelpCenter;
