import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { getBlogs, type Blog as BlogType } from '../services/blogService';
import { usePageContent, renderSplitHeroTitle } from '../hooks/usePageContent';
import { getLocalizedValue } from '../utils/contentHelper';
import '../styles/blog.css';

interface BlogPostUI {
  _id: string;
  title: string;
  date: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
}

const Blog: React.FC = () => {
  const { content: cmsPageContent, loaded } = usePageContent('blog');
  const hero = renderSplitHeroTitle(cmsPageContent, { before: 'THE ', highlight: 'JOURNAL' });
  const heroSubtitle =
    (cmsPageContent.heroSubtitle as string) || 'Insights into technique, culture, and artistry.';

  // Static fallbacks in case API is empty/unavailable
  const defaultFeaturedPost: BlogPostUI = {
    _id: "default-featured",
    title: "The Anatomy of a Perfect Stage Performance",
    date: "OCT 24, 2026",
    category: "Masterclass",
    author: "Anubhav",
    excerpt: "Preparing for a live showcase goes far beyond just remembering the choreography.",
    content: "Preparing for a live showcase goes far beyond just remembering the choreography. We break down the psychology of stage presence, blocking, and crowd control. When you step onto the stage, every gesture carries emotional weight and storytelling intention.",
    image: "/svc-stage.png"
  };

  const defaultPosts: BlogPostUI[] = [
    {
      _id: "default-2",
      title: "Finding Your Groove in Hip Hop Foundations",
      date: "OCT 20, 2026",
      category: "Technique",
      author: "GDP Team",
      excerpt: "Understanding the bounce, rock, and roll. Why basic fundamentals are key.",
      content: "Understanding the bounce, rock, and roll. Why basic fundamentals are the key to advanced texturing and musicality. Consistent practice of grooves creates a strong baseline.",
      image: "/svc-hiphop.png"
    },
    {
      _id: "default-3",
      title: "Building Confidence in Kids Through Dance",
      date: "OCT 15, 2026",
      category: "Development",
      author: "GDP Team",
      excerpt: "How structured studio training helps children develop discipline and creativity.",
      content: "How structured studio training helps children and teens develop discipline, creativity, and self-esteem early on through fun routine drills and ensemble work.",
      image: "/svc-kids.jpg"
    },
    {
      _id: "default-4",
      title: "Crafting the Ultimate Wedding Routine",
      date: "OCT 10, 2026",
      category: "Choreography",
      author: "Anubhav",
      excerpt: "From song selection to the final dip. Tips on making your first dance memorable.",
      content: "From song selection to the final dip. Tips on making your first dance memorable, elegant, and completely stress-free with customized choreography pacing.",
      image: "/svc-wedding.jpg"
    }
  ];

  const [blogsList, setBlogsList] = useState<BlogType[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPostUI | null>(null);

  useEffect(() => {
    getBlogs({ status: 'published' })
      .then((data) => {
        if (data && data.blogs && data.blogs.length > 0) {
          setBlogsList(data.blogs);
        }
      })
      .catch((err) => console.error("Error loading blog posts:", err));
  }, []);

  const mapToPostUI = (blog: BlogType): BlogPostUI => {
    const title = getLocalizedValue(blog.title, 'Untitled Post');
    const excerpt = getLocalizedValue(blog.excerpt, '');
    const content = getLocalizedValue(blog.content, '');
    const date = blog.publishedAt
      ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
      : blog.createdAt
        ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
        : 'OCTOBER 2026';

    const author =
      blog.author?.name ||
      (excerpt && excerpt.length < 35 && !excerpt.includes('.') ? excerpt : 'GDP Studio');

    return {
      _id: blog._id || String(Math.random()),
      title,
      date,
      category: blog.category || 'General',
      author,
      excerpt,
      content: content || excerpt || 'Read more inside...',
      image: blog.featuredImage?.url || '/svc-stage.png'
    };
  };

  const hasBlogs = blogsList.length > 0;
  const featuredPost = hasBlogs ? mapToPostUI(blogsList[0]) : defaultFeaturedPost;
  const posts = hasBlogs ? blogsList.slice(1).map(mapToPostUI) : defaultPosts;

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <Layout>
      <SEO pageTitle="Journal" />
      
      <div className="blog-page-wrapper">
        <section className="blog-hero-section">
          <div className="blog-ambient-bg"></div>
          
          <motion.h1 
            className="blog-hero-title"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {!loaded ? (
              <span className="home-skel" style={{ display: 'inline-block', height: 48, width: 260 }} />
            ) : (
              <>{hero.before}<span>{hero.highlight}</span></>
            )}
          </motion.h1>
          
          <motion.div 
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', letterSpacing: '1.5px', fontFamily: 'var(--font-montserrat)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {!loaded ? (
              <span className="home-skel" style={{ display: 'block', height: 16, width: 320, margin: '0 auto' }} />
            ) : (
              heroSubtitle
            )}
          </motion.div>
        </section>

        <section className="container">
          {/* Featured Post (Compact Size & Real Content Preview) */}
          <motion.div 
            className="blog-featured"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            onClick={() => setSelectedPost(featuredPost)}
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
              {featuredPost.author && (
                <div className="blog-byline">✍ By {featuredPost.author}</div>
              )}
              <p className="blog-content-text">{featuredPost.content}</p>
              <div>
                <button
                  type="button"
                  className="blog-read-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPost(featuredPost);
                  }}
                >
                  READ ARTICLE <span>→</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Grid Posts */}
          {posts.length > 0 && (
            <div className="blog-grid">
              {posts.map((post, i) => (
                <motion.div 
                  key={post._id} 
                  className="blog-card"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  onClick={() => setSelectedPost(post)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="blog-card-img">
                    <img src={post.image} alt={post.title} />
                  </div>
                  <div className="blog-card-content">
                    <div className="blog-meta">
                      <span className="blog-cat">{post.category}</span>
                      <span className="blog-date">{post.date}</span>
                    </div>
                    <h3 className="blog-title" style={{ fontSize: '17px' }}>{post.title}</h3>
                    {post.author && (
                      <div className="blog-byline" style={{ fontSize: '12px' }}>✍ By {post.author}</div>
                    )}
                    <p className="blog-content-text" style={{ fontSize: '13px' }}>{post.content}</p>
                    <div>
                      <button
                        type="button"
                        className="blog-read-more"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPost(post);
                        }}
                      >
                        READ <span>→</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Full Article Reader Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              className="blog-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
            >
              <motion.div
                className="blog-modal-card"
                initial={{ scale: 0.94, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 16 }}
                transition={{ duration: 0.22 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="blog-modal-close-btn"
                  onClick={() => setSelectedPost(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
                {selectedPost.image && (
                  <div className="blog-modal-img">
                    <img src={selectedPost.image} alt={selectedPost.title} />
                  </div>
                )}
                <div className="blog-modal-body">
                  <div className="blog-modal-meta">
                    <span className="blog-cat">{selectedPost.category}</span>
                    <span className="blog-date">{selectedPost.date}</span>
                  </div>
                  <h2 className="blog-modal-title">{selectedPost.title}</h2>
                  {selectedPost.author && (
                    <div className="blog-modal-byline">✍ By {selectedPost.author}</div>
                  )}
                  <div className="blog-modal-content">{selectedPost.content}</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Blog;
