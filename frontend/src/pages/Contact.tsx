import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SEO from "../components/SEO";
import { getPageContentBySlug } from "../services/cmsService";
import { useSiteData } from "../contexts/SiteDataContext";
import { resolveContactInfo } from "../lib/contactInfo";
import { useEnquiryPopup } from "../contexts/EnquiryPopupContext";
import { intentFromSearch } from "../lib/trialEnquiry";
import "../styles/contact.css";

interface ContactContent {
  headerTitle: string;
  headerSubtitle: string;
  address: string;
  phone: string;
  email: string;
  hoursWeekday: string;
  hoursWeekend: string;
}

const DEFAULT_CONTENT: ContactContent = {
  headerTitle: "LET'S CONNECT.",
  headerSubtitle:
    "We love hearing from fellow dancers, prospective students, and collaborators! Reach out for general inquiries, booking details, or customized workshop sessions.",
  address: "Ghaziabad, Uttar Pradesh",
  phone: "+91 78384 16907",
  email: "Gdp.info2019@gmail.com",
  hoursWeekday: "Mon-Fri: 9AM - 10PM",
  hoursWeekend: "Sat-Sun: 10AM - 8PM",
};

const Contact: React.FC = () => {
  const { cmsSettings } = useSiteData();
  const { openEnquiry } = useEnquiryPopup();
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  const [content, setContent] = useState<ContactContent>(DEFAULT_CONTENT);

  useEffect(() => {
    const load = () => {
      getPageContentBySlug("contact")
        .then((page) => {
          const contact = resolveContactInfo(cmsSettings, page?.content);
          if (page?.content) {
            setContent({
              headerTitle: page.content.headerTitle || DEFAULT_CONTENT.headerTitle,
              headerSubtitle: page.content.headerSubtitle || DEFAULT_CONTENT.headerSubtitle,
              address: contact.address,
              phone: contact.phone,
              email: contact.email,
              hoursWeekday: page.content.hoursWeekday || DEFAULT_CONTENT.hoursWeekday,
              hoursWeekend: page.content.hoursWeekend || DEFAULT_CONTENT.hoursWeekend,
            });
          } else {
            setContent((prev) => ({
              ...prev,
              address: contact.address,
              phone: contact.phone,
              email: contact.email,
            }));
          }
        })
        .catch(() => {
          const contact = resolveContactInfo(cmsSettings, null);
          setContent((prev) => ({
            ...prev,
            address: contact.address,
            phone: contact.phone,
            email: contact.email,
          }));
        });
    };

    load();
  }, [cmsSettings]);

  useEffect(() => {
    openEnquiry(intentFromSearch(new URLSearchParams(query)));
  }, [openEnquiry, query]);

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
              {(() => {
                const title = content.headerTitle || "LET'S CONNECT.";
                const parts = title.split(/\s+/);
                if (parts.length >= 2) {
                  const last = parts.pop() as string;
                  return (
                    <>
                      {parts.join(" ")} <span>{last}</span>
                    </>
                  );
                }
                return title;
              })()}
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
                  {content.hoursWeekday}
                  <br />
                  {content.hoursWeekend}
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
            <h3 style={{ marginTop: 0 }}>Send an enquiry</h3>
            <p>The same form opens here, already set for the page you came from.</p>
            <button
              type="button"
              className="c-submit-btn"
              onClick={() => openEnquiry(intentFromSearch(new URLSearchParams(query)))}
            >
              Open the form
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
