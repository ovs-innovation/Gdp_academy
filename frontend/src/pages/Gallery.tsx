import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import '../styles/gallery.css';

const Gallery: React.FC = () => {
  const galleryItems = [
    {
      id: 1,
      url: "/svc-stage.png",
      title: "Stage Performance",
      category: "Live Show",
      size: "large" // col-span-2 row-span-2
    },
    {
      id: 2,
      url: "/svc-hiphop.png",
      title: "Studio Rehearsal",
      category: "Training",
      size: "tall" // row-span-2
    },
    {
      id: 3,
      url: "/svc-kids.jpg",
      title: "Urban Cypher",
      category: "Freestyle",
      size: "standard" 
    },
    {
      id: 4,
      url: "/svc-wedding.jpg",
      title: "Neon Nights",
      category: "Concept Video",
      size: "wide" // col-span-2
    },
    {
      id: 5,
      url: "/svc-hiphop.png",
      title: "Crew Showcase",
      category: "Competition",
      size: "standard"
    },
    {
      id: 6,
      url: "/svc-stage.png",
      title: "Contemporary Flow",
      category: "Choreography",
      size: "tall" // row-span-2
    },
    {
      id: 7,
      url: "/svc-wedding.jpg",
      title: "Breakdance Battle",
      category: "Underground",
      size: "wide"
    }
  ];

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
            THE <span>ARCHIVE</span>
          </motion.h1>
          
          <motion.div 
            className="gal-hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Raw emotion and precision
          </motion.div>
        </section>

        <section className="container">
          <motion.div 
            className="gal-bento-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {galleryItems.map((item) => (
              <motion.div 
                key={item.id} 
                className={`gal-item ${item.size}`}
                variants={itemFade}
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="gal-image"
                  loading="lazy"
                />
                <div className="gal-overlay">
                  <h3 className="gal-item-title">{item.title}</h3>
                  <div className="gal-item-category">{item.category}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export default Gallery;
