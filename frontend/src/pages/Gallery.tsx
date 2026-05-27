import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { getGalleryItems, getPageContentBySlug } from '../services/cmsService';
import {
  resolvePublicMediaUrl,
  isDirectVideoUrl,
  isYoutubeUrl,
  getYoutubeEmbedUrl,
} from '../utils/mediaUrl';
import '../styles/gallery.css';

const DEFAULT_GALLERY = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    title: "Kathak Classical Performance - Annual Recital",
    category: "Classical",
    size: "large"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80",
    title: "Contemporary Fusion Workshop in Progress",
    category: "Contemporary",
    size: "tall"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=800&q=80",
    title: "Bollywood High-Energy Class Celebration",
    category: "Bollywood",
    size: "standard"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    title: "Folk Dance Celebrations - Navratri Special",
    category: "Folk",
    size: "wide"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    title: "Crew Showcase",
    category: "Competition",
    size: "standard"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80",
    title: "Contemporary Flow",
    category: "Choreography",
    size: "tall"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    title: "Breakdance Battle",
    category: "Underground",
    size: "wide"
  }
];

const DEFAULT_HERO_TITLE = 'THE ARCHIVE';
const DEFAULT_HERO_SUBTITLE = 'Raw emotion and precision';

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroTitle, setHeroTitle] = useState(DEFAULT_HERO_TITLE);
  const [heroSubtitle, setHeroSubtitle] = useState(DEFAULT_HERO_SUBTITLE);

  useEffect(() => {
    getPageContentBySlug('gallery')
      .then((page) => {
        const c = page?.content;
        if (!c) return;
        if (c.heroTitle) setHeroTitle(c.heroTitle);
        if (c.heroSubtitle) setHeroSubtitle(c.heroSubtitle);
      })
      .catch(() => {});

    getGalleryItems()
      .then((items) => {
        if (items && items.length > 0) {
          const sizes = ['large', 'tall', 'standard', 'wide', 'standard', 'tall', 'wide'];
          const mapped = items.map((item: any, index: number) => ({
            id: item._id || index,
            url: resolvePublicMediaUrl(item.url),
            rawUrl: item.url,
            title: item.caption || "Dance Performance",
            category: item.type === "video" ? "Video Showcase" : "Live Recital",
            size: sizes[index % sizes.length],
            type: item.type,
          }));
          setGalleryItems(mapped);
        } else {
          setGalleryItems(DEFAULT_GALLERY);
        }
      })
      .catch(() => {
        setGalleryItems(DEFAULT_GALLERY);
      })
      .finally(() => setLoading(false));
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemFade = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <Layout>
      <SEO pageTitle="Gallery" />
      
      <div className="gallery-page-wrapper">
        <section className="gal-hero-section">
          <div className="gal-ambient-bg"></div>
          
          <motion.h1 
            className="gal-hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {heroTitle.includes(' ') ? (
              <>
                {heroTitle.split(' ').slice(0, -1).join(' ')} <span>{heroTitle.split(' ').slice(-1)[0]}</span>
              </>
            ) : (
              heroTitle
            )}
          </motion.h1>
          
          <motion.div 
            className="gal-hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            {heroSubtitle}
          </motion.div>
        </section>

        <section className="container">
          {loading ? (
            <p className="gal-loading">Loading gallery…</p>
          ) : galleryItems.length === 0 ? (
            <p className="gal-loading">No gallery items yet. Add photos/videos from the admin panel.</p>
          ) : (
          <motion.div 
            className="gal-bento-grid"
            initial="visible"
            animate="visible"
            variants={staggerContainer}
          >
            {galleryItems.map((item) => {
              const youtubeEmbed = isYoutubeUrl(item.url) ? getYoutubeEmbedUrl(item.rawUrl || item.url) : null;
              const showVideo = isDirectVideoUrl(item.url);

              return (
              <motion.div 
                key={item.id} 
                className={`gal-item ${item.size}`}
                variants={itemFade}
              >
                {youtubeEmbed ? (
                  <iframe
                    src={youtubeEmbed}
                    title={item.title}
                    className="gal-image gal-youtube"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : showVideo ? (
                  <video
                    src={item.url}
                    className="gal-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="gal-image"
                    loading="lazy"
                  />
                )}
                <div className="gal-overlay">
                  <h3 className="gal-item-title">{item.title}</h3>
                  <div className="gal-item-category">{item.category}</div>
                </div>
              </motion.div>
            );
            })}
          </motion.div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Gallery;
