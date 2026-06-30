import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheckCircle,
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiShield,
  FiTag,
  FiTwitter,
  FiUser,
  FiUsers,
  FiYoutube,
} from "react-icons/fi";
import PageShell from "../../components/common/PageShell";
import supportImage from "../../assets/images/team-member.jpg";
import communityImage from "../../assets/images/community.jpg";

const contactMethods = [
  { title: "Email Us", text: "support@sindhuswap.com", meta: "We reply within 24 hours", icon: FiMail },
  { title: "Call Us", text: "+91 98765 43210", meta: "Mon - Sat (9AM - 7PM)", icon: FiPhone },
  { title: "Visit Us", text: "Sindhudurg, Maharashtra", meta: "India - 416602", icon: FiMapPin },
];

const supportCards = [
  { title: "Quick Support", text: "Fast and friendly help anytime.", icon: FiPhone },
  { title: "Secure & Safe", text: "Your data and privacy are always protected.", icon: FiShield },
  { title: "Community First", text: "We are built for the people of Sindhudurg.", icon: FiUsers },
  { title: "Trusted Platform", text: "Verified users, safer transactions, better trust.", icon: FiCheckCircle },
];

function Contact() {
  return (
    <PageShell>
      <section className="contact-hero container">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow"><FiUsers /> Contact Us</span>
          <h1>We’d love to hear <span>from you!</span></h1>
          <p>
            Have a question, suggestion, or need support? We are here to help.
            Reach out to us anytime.
          </p>
        </motion.div>
        <motion.div className="contact-illustration" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <img src={supportImage} alt="Support representative" />
          <span className="bubble bubble--mail"><FiMail /></span>
          <span className="bubble bubble--phone"><FiPhone /></span>
          <span className="bubble bubble--chat">•••</span>
        </motion.div>
      </section>

      <section className="contact-grid container">
        <motion.form className="contact-panel" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2>Send us a message</h2>
          <ContactField icon={FiUser} placeholder="Your Name" />
          <ContactField icon={FiMail} placeholder="Email Address" />
          <ContactField icon={FiTag} placeholder="Subject" />
          <label className="contact-field">
            <FiTag />
            <select defaultValue="">
              <option value="" disabled>Select a Category</option>
              <option>Buying Support</option>
              <option>Selling Support</option>
              <option>Book Swap</option>
              <option>Safety Concern</option>
            </select>
          </label>
          <label className="contact-field contact-field--textarea">
            <FiMail />
            <textarea placeholder="Write your message here..." />
          </label>
          <button className="btn btn--primary" type="submit">Send Message <FiSend /></button>
          <small><FiCheckCircle /> We usually respond within 24 hours</small>
        </motion.form>

        <motion.aside className="contact-panel" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2>Get in touch</h2>
          <div className="contact-methods">
            {contactMethods.map((item) => <ContactMethod item={item} key={item.title} />)}
            <article className="contact-method">
              <FiUsers />
              <div>
                <strong>Follow Us</strong>
                <div className="contact-socials">
                  <a href="/" aria-label="Facebook"><FiFacebook /></a>
                  <a href="/" aria-label="Instagram"><FiInstagram /></a>
                  <a href="/" aria-label="Twitter"><FiTwitter /></a>
                  <a href="/" aria-label="YouTube"><FiYoutube /></a>
                </div>
              </div>
            </article>
          </div>
        </motion.aside>
      </section>

      <section className="support-strip container">
        {supportCards.map((card) => <SupportCard card={card} key={card.title} />)}
      </section>

      <section className="help-cta container">
        <img src={communityImage} alt="Community support" />
        <div>
          <h2>Still have questions?</h2>
          <p>Check out our Help Center or FAQ section for quick answers.</p>
        </div>
        <a className="btn btn--primary" href="/help-center">Visit Help Center <FiArrowRight /></a>
      </section>
    </PageShell>
  );
}

function ContactField({ icon: Icon, placeholder }) {
  return (
    <label className="contact-field">
      <Icon />
      <input placeholder={placeholder} />
    </label>
  );
}

function ContactMethod({ item }) {
  const Icon = item.icon;
  return (
    <article className="contact-method">
      <Icon />
      <div>
        <strong>{item.title}</strong>
        <span>{item.text}</span>
        <small>{item.meta}</small>
      </div>
    </article>
  );
}

function SupportCard({ card }) {
  const Icon = card.icon;
  return (
    <motion.article whileHover={{ y: -6 }}>
      <Icon />
      <div>
        <h3>{card.title}</h3>
        <p>{card.text}</p>
      </div>
    </motion.article>
  );
}

export default Contact;
