import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SEO from "../components/SEO";
import { submitContactMessage, getPageContentBySlug } from "../services/cmsService";
import { toast } from "react-toastify";
import "../styles/contact.css";

interface ContactContent {
  headerTitle: string;
  headerSubtitle: string;
  address: string;
  phone: string;
  email: string;
}

const DEFAULT_CONTENT: ContactContent = {
  headerTitle: "Get in Touch",
  headerSubtitle: "We love hearing from fellow dancers, prospective students, and collaborators! Reach out for general inquiries, booking details, or customized workshop sessions.",
  address: "123 Creative Rhythm Way, Dance Arts District, New Delhi, India",
  phone: "+91 98765 43210",
  email: "hello@gdpstudio.com"
};

const Contact: React.FC = () => {
  const [content, setContent] = useState<ContactContent>(DEFAULT_CONTENT);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPageContentBySlug("contact")
      .then((page) => {
        if (page && page.content) {
          setContent({
            headerTitle: page.content.headerTitle || DEFAULT_CONTENT.headerTitle,
            headerSubtitle: page.content.headerSubtitle || DEFAULT_CONTENT.headerSubtitle,
            address: page.content.address || DEFAULT_CONTENT.address,
            phone: page.content.phone || DEFAULT_CONTENT.phone,
            email: page.content.email || DEFAULT_CONTENT.email
          });
        }
      })
      .catch(() => {
        setContent(DEFAULT_CONTENT);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: "Contact Page Enquiry",
        message: formData.message.trim(),
      });

      toast.success("Thank you! We will get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <SEO pageTitle="Contact Us" />

      <div className="contact-page-wrapper">
        <div className="contact-ambient"></div>
        <div className="contact-ambient-2"></div>

        <div className="contact-container">
          {/* Left Info Side */}
          <motion.div
            className="contact-info-side"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="contact-hero-title">
              LET'S <span>CONNECT.</span>
            </h1>
            <p className="contact-hero-subtitle">
              {content.headerSubtitle}
            </p>

            <div className="contact-details-grid">
              <div className="contact-detail-block">
                <h4>THE STUDIO</h4>
                <p style={{ whiteSpace: "pre-line" }}>
                  {content.address}
                </p>
              </div>

              <div className="contact-detail-block">
                <h4>CONTACT</h4>
                <p>
                  {content.email}
                  <br />
                  {content.phone}
                </p>
              </div>

              <div className="contact-detail-block">
                <h4>HOURS</h4>
                <p>
                  Mon-Fri: 9AM - 10PM
                  <br />
                  Sat-Sun: 10AM - 8PM
                </p>
              </div>

              <div className="contact-detail-block">
                <h4>SOCIALS</h4>
                <p style={{ display: "flex", gap: "15px" }}>
                  <a
                    href="https://instagram.com/garimadanceproduction"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "var(--svc-green)",
                      textDecoration: "none",
                    }}
                  >
                    IG
                  </a>
                  <a
                    href="https://youtube.com/garimadanceproduction"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "var(--svc-green)",
                      textDecoration: "none",
                    }}
                  >
                    YT
                  </a>
                  <a
                    href="https://facebook.com/garimadanceproduction"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "var(--svc-green)",
                      textDecoration: "none",
                    }}
                  >
                    FB
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Form Side */}
          <motion.div
            className="contact-form-side"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handleSubmit}>
              <div className="c-form-group">
                <label>YOUR NAME</label>
                <input
                  type="text"
                  name="name"
                  className="c-form-input"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="c-form-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  name="email"
                  className="c-form-input"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="c-form-group">
                <label>PHONE NUMBER</label>
                <input
                  type="tel"
                  name="phone"
                  className="c-form-input"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="c-form-group">
                <label>MESSAGE</label>
                <textarea
                  name="message"
                  className="c-form-textarea"
                  placeholder="Tell us about your dance goals..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="c-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
