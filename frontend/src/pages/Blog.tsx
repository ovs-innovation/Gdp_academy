import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import '../styles/blog.css';

const Blog: React.FC = () => {
  // Use guaranteed local images to avoid network blocking
  const featuredPost = {
    id: 1,
    title: "The Anatomy of a Perfect Stage Performance",
    date: "OCT 24, 2024",
    category: "Masterclass",
    author: "Anubhav",
    excerpt: "Preparing for a live showcase goes far beyond just remembering the choreography. We break down the psychology of stage presence, blocking, and crowd control.",
    image: "/svc-stage.png"
  };

  const posts = [
    {
      id: 2,
      title: "Finding Your Groove in Hip Hop Foundations",
      date: "OCT 20, 2024",
      category: "Technique",
      author: "GDP Team",
      excerpt: "Understanding the bounce, rock, and roll. Why basic fundamentals are the key to advanced texturing and musicality.",
      image: "/svc-hiphop.png"
    },
    {
      id: 3,
      title: "Building Confidence in Kids Through Dance",
      date: "OCT 15, 2024",
      category: "Development",
      author: "GDP Team",
      excerpt: "How structured studio training helps children and teens develop discipline, creativity, and self-esteem early on.",
      image: "/svc-kids.jpg"
    },
    {
      id: 4,
      title: "Crafting the Ultimate Wedding Routine",
      date: "OCT 10, 2024",
      category: "Choreography",
      author: "Anubhav",
      excerpt: "From song selection to the final dip. Tips on making your first dance memorable, elegant, and completely stress-free.",
      image: "/svc-wedding.jpg"
    },
    {
      id: 5,
      title: "Behind The Scenes: The Cypher Vol. 2",
      date: "OCT 05, 2024",
      category: "Events",
      author: "GDP Team",
      excerpt: "An exclusive look at our latest underground battle event. The energy, the community, and the standout moments.",
      image: "/anubhav.png"
    },
    {
      id: 6,
      title: "How to Recover Fast After Intensive Training",
      date: "SEP 28, 2024",
      category: "Health",
      author: "GDP Team",
      excerpt: "Dance is an extreme sport. Here is our recommended protocol for muscle recovery, stretching, and staying injury-free.",
      image: "/svc-stage.png"
    }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <Layout>
      <SEO pageTitle="Journal" />
      
      <div className="blog-page-wrapper">
        <section className="blog-hero-section">
          <div className="blog-ambient-bg"></div>
          
          <motion.h1 
            className="blog-hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            THE <span>JOURNAL</span>
          </motion.h1>
          
          <motion.div 
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', letterSpacing: '2px', fontFamily: 'var(--font-montserrat)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Insights into technique, culture, and artistry.
          </motion.div>
        </section>

        <section className="container">
          {/* Featured Post */}
          <motion.div 
            className="blog-featured"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <div className="blog-featured-img">
              <img src={featuredPost.image} alt={featuredPost.title} />
            </div>
            <div className="blog-featured-content">
              <div className="blog-meta">
                <span className="blog-cat">{featuredPost.category}</span>
                <span className="blog-date">{featuredPost.date}</span>
              </div>
              <h2 className="blog-title">{featuredPost.title}</h2>
              <p className="blog-excerpt">{featuredPost.excerpt}</p>
              <div>
                <button className="blog-read-more">READ ARTICLE <span>→</span></button>
              </div>
            </div>
          </motion.div>

          {/* Grid Posts */}
          <div className="blog-grid">
            {posts.map((post, i) => (
              <motion.div 
                key={post.id} 
                className="blog-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="blog-card-img">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span className="blog-cat">{post.category}</span>
                    <span className="blog-date">{post.date}</span>
                  </div>
                  <h3 className="blog-title" style={{ fontSize: '16px' }}>{post.title}</h3>
                  <p className="blog-excerpt" style={{ fontSize: '13px' }}>{post.excerpt}</p>
                  <div>
                    <button className="blog-read-more">READ <span>→</span></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Blog;
