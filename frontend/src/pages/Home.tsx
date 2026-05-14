import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { getSiteSettings, type SiteSettings } from '../services/settingsService';
import blog_data from '../data/home-data/BlogData';
import testimonial_data from '../data/home-data/TestimonialData';
import faq_data from '../data/home-data/FaqData';
import instructor_data from '../data/home-data/InstructorData';
import event_data from '../data/home-data/EventData';
import '../styles/home.css';

interface LazyVideoProps {
  src: string;
  className?: string;
  scale?: number;
}

const LazyVideo: React.FC<LazyVideoProps> = ({ src, className, scale = 1.1 }) => {
  const elRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');

  if (isYouTube) {
    const videoId = src.includes('youtube.com') ? src.split('embed/')[1]?.split('?')[0] : src.split('youtu.be/')[1];
    return (
      <div ref={elRef} className={className} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        {isVisible && (
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&vq=hd1080&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0`} 
            frameBorder="0" 
            allow="autoplay; encrypted-media" 
            allowFullScreen
            style={{ 
              objectFit: 'cover', 
              pointerEvents: 'none', 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              width: '100%', 
              height: '100%', 
              transform: `translate(-50%, -50%) scale(${scale})`,
              minWidth: '100%',
              minHeight: '100%'
            }}
          ></iframe>
        )}
      </div>
    );
  }

  return (
    <video
      ref={elRef}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      className={className}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    >
      {isVisible && <source src={src} type="video/mp4" />}
    </video>
  );
};

const Home: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const heroTitle = settings?.heroTitle || "ELEVATE YOUR ARTISTRY";
  const heroSubtitle = settings?.heroSubtitle || "Step into the world's most prestigious dance sanctuary. Where passion meets precision, and every move tells a story.";
  const finalCtaTitle = settings?.finalCtaTitle || "READY TO BEGIN YOUR TRANSFORMATION?";
  const finalCtaSubtitle = settings?.finalCtaSubtitle || "Join Garima Dance Production today and unlock your true artistic potential.";
  const servicesTitle = settings?.servicesTitle || "OUR SERVICES";
  const servicesSubtitle = settings?.servicesSubtitle || "Experience the ultimate dance training ecosystem.";
  const announcementText = settings?.announcementText || "📢 NEW WORKSHOP: CONTEMPORARY MASTERCLASS WITH ELENA VOLKOVA - ENROLLMENT OPEN NOW!";
  
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube API
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      // About Player
      new (window as any).YT.Player('about-video-player', {
        videoId: 'J-yM5y4Kd04',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: 'J-yM5y4Kd04',
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          origin: window.location.origin,
          vq: 'hd1080'
        },
        events: {
          onReady: (event: any) => {
            playerRef.current = event.target;
            event.target.playVideo();
          }
        }
      });

      // Hero Player
      new (window as any).YT.Player('hero-video-player', {
        videoId: '1phsCpxcBZU',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: '1phsCpxcBZU',
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          origin: window.location.origin,
          vq: 'hd1080'
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
            // Custom smooth loop for 42 seconds
            setInterval(() => {
              if (event.target.getCurrentTime() >= 42) {
                event.target.seekTo(0);
              }
            }, 200);
          }
        }
      });
    };

    (window as any).onYouTubeIframeAPIReady = initPlayer;

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    }
  }, []);

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <Layout>
      {/* 1. Hero Section */}
      <section className="hero">
        <div className="hero-video-container" style={{ overflow: 'hidden' }}>
          <div id="hero-video-player" className="hero-video" style={{ pointerEvents: 'none', transform: 'scale(1.5)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
          <div className="hero-overlay"></div>
        </div>

        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title" style={{ fontFamily: 'var(--font-title)', lineHeight: '1.1', textTransform: 'none' }}>
              Keep up your fitness <br /> through <span style={{ color: '#00d1ff' }}>Dance</span>
            </h1>
            <p className="hero-subtitle" style={{ maxWidth: '450px', textTransform: 'none', opacity: 0.9 }}>
              Garima Dance Productions is the place to go when you want to learn <br /> something artistic, be happy, get fit
            </p>
          </motion.div>
        </div>
          
          <motion.div 
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <div className="mouse"></div>
            <span>SCROLL</span>
          </motion.div>
      </section>

      {/* 2. Services Section */}
      <section className="services-section section-padding">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
            <h2 className="section-title" style={{ fontFamily: 'var(--font-title)', fontSize: '32px', letterSpacing: '1px' }}>Services</h2>
          </div>
          <div className="services-v2-grid">
            {[
              { 
                title: 'Regular dance sessions', 
                image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80', 
                active: true,
                tagline: 'All Levels | Fitness Focused',
                mainTitle: 'Transform your lifestyle through rhythm',
                features: ['Personalised training plans', 'Flexible morning & evening slots', 'Live performance opportunities']
              },
              { 
                title: 'Combo fitness sessions', 
                image: 'https://images.unsplash.com/photo-1518611012118-296072bb5604?auto=format&fit=crop&q=80', 
                active: false,
                tagline: 'Cardio | Strength | Dance',
                mainTitle: 'Get fit while having the time of your life',
                features: ['High-intensity workouts', 'Custom diet guidance', 'Progress tracking dashboard']
              },
              { 
                title: 'Wedding Choreography', 
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80', 
                active: false,
                tagline: 'Online | Offline',
                mainTitle: 'Make your special day unforgettable',
                features: ['Personalised choreographies', 'Flexible time schedules', 'Complementary music edits']
              },
              { 
                title: 'Custom choreography', 
                image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80', 
                active: false,
                tagline: 'Events | Competitions',
                mainTitle: 'Stand out with unique artistic vision',
                features: ['Theme-based concepts', 'Stage blocking & positioning', 'Prop assistance']
              },
            ].map((service, i) => (
              <div key={service.title}>
                <motion.div 
                  className={`service-card-v2 ${service.active ? 'active' : ''}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedService(service)}
                  viewport={{ once: true }}
                >
                  <div className="service-card-img">
                    <img src={service.image} className="service-video" alt={service.title} />
                    <div className="img-overlay"></div>
                  </div>
                  <div className="service-card-footer">
                    <h3>{service.title}</h3>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedService && (
            <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
              <motion.div 
                className="service-modal-content"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={() => setSelectedService(null)}>×</button>
                
                <div className="modal-left">
                  <div className="modal-header-info">
                    <span className="modal-service-title">{selectedService.title}</span>
                    <span className="modal-dot">•</span>
                    <span className="modal-tagline">{selectedService.tagline}</span>
                  </div>
                  <h2 className="modal-main-headline">{selectedService.mainTitle}</h2>
                  
                  <ul className="modal-features-list">
                    {selectedService.features.map((feature: string) => (
                      <li key={feature}>
                        <div className="feature-check">✓</div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="modal-gallery-preview">
                    <p className="gallery-label">Check out our Gallery</p>
                    <div className="gallery-thumbs">
                      <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80" alt="G1" />
                      <img src="https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80" alt="G2" />
                      <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80" alt="G3" />
                      <div className="thumb-next">›</div>
                    </div>
                  </div>
                </div>

                <div className="modal-right">
                  <div className="contact-form-box">
                    <h3>Let us reach you!</h3>
                    <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                      <div className="input-group">
                        <input type="text" placeholder="Full Name" />
                      </div>
                      <div className="input-group">
                        <input type="text" placeholder="Contact Number" />
                      </div>
                      <div className="input-group">
                        <input type="email" placeholder="Email ID" />
                      </div>
                      <div className="checkbox-group">
                        <input type="checkbox" id="wa-consent" />
                        <label htmlFor="wa-consent">agree to receive messages on WhatsApp</label>
                      </div>
                      <button type="submit" className="primary-btn submit-modal-btn">Send details</button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 2.5 Highlights Section */}
      <section className="highlights-section">
        <div className="highlights-container">
          <div className="highlights-wrapper-infinite">
            {[...Array(2)].map((_, groupIdx) => (
              <div key={groupIdx} className="highlights-group">
                {[
                  { title: 'Dance Reel', song: 'Studio Session', views: '1.2k', vid: 'https://www.youtube.com/embed/8G2EOLyWFv8' },
                  { title: 'Group Flow', song: 'Choreography', views: '2.5k', vid: 'https://www.youtube.com/embed/wiDo4xWDrdY' },
                  { title: 'Solo Edge', song: 'Performance', views: '3.1k', vid: 'https://www.youtube.com/embed/IyyCJjf8iqM' },
                  { title: 'Urban Move', song: 'Hip Hop', views: '1.8k', vid: 'https://www.youtube.com/embed/N_M1J_wgKcI' },
                  { title: 'Elite Grace', song: 'Classical', views: '4.2k', vid: 'https://www.youtube.com/embed/OGGhn--vbUo' },
                  { title: 'Dynamic Duo', song: 'Collaboration', views: '2.9k', vid: 'https://www.youtube.com/embed/U4wlmEcS6n8' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    className="highlight-card-v3"
                  >
                    <LazyVideo src={item.vid} className="highlight-video-bg" scale={2.5} />
                    <div className="highlight-card-overlay">
                      <div className="highlight-content-left">
                        <span className="highlight-views"><strong>{item.views}</strong> Views</span>
                        <h3 className="highlight-main-title">{item.title}</h3>
                        <p className="highlight-song-name">{item.song}</p>
                        <span className="highlight-author">By GDP</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. About Section */}
      <section className="about-section section-padding">
        <div className="container">
          <div className="about-content-wrapper">
            <div className="about-image-container animate-fade-in" style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
              <div id="about-video-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
              <button 
                onClick={toggleMute}
                className="mute-toggle-btn"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  zIndex: 10,
                  background: 'rgba(99, 75, 250, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>
            <div className="about-text">
              <h2 className="section-title">GARIMA DANCE <span className="gradient-text">PRODUCTION</span></h2>
              <p>
                Founded on the principles of grace, power, and artistic innovation, Garima Dance Production (GDP) 
                is India's premier sanctuary for high-end dance education. Our mission is to transform 
                passionate movers into technical masters through a curriculum that blends classical 
                finesse with urban edge.
              </p>
              <button className="secondary-btn glass-btn">DISCOVER OUR LEGACY</button>
            </div>
          </div>
        </div>
      </section>


      {/* 5. Upcoming Workshops */}
      <section className="workshops-preview section-padding" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">UPCOMING <span className="gradient-text">WORKSHOPS</span></h2>
            <p className="section-desc">Join our high-energy live sessions and intensive masterclasses.</p>
          </div>
          <div className="workshops-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {event_data.slice(0, 3).map((workshop, i) => (
              <motion.div 
                key={workshop.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="workshop-row glass-card"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 40px' }}
              >
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '40px' }}>
                    <span style={{ display: 'block', fontSize: '24px', fontWeight: '800', color: 'var(--accent-color)' }}>{workshop.date.split(' ')[0]}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>{workshop.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', marginBottom: '5px', fontWeight: '700' }}>{workshop.title}</h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>Location: {workshop.location}</p>
                  </div>
                </div>
                <button className="primary-btn join-btn" style={{ background: 'var(--primary-color)' }}>BOOK SPOT</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* 7. Instagram Section */}
      <section className="instagram-section section-padding">
        <div className="container">
          <div className="instagram-content">
            <div className="instagram-header">
              <motion.h2 
                className="insta-title"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                Join us <br /> <span className="gradient-text">on Instagram</span>
              </motion.h2>
              <motion.div 
                className="insta-badge"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="insta-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M17.5 6.51L17.51 6.49889" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="insta-handle">@GarimadanceProductions</span>
              </motion.div>
            </div>
            
            <div className="instagram-grid">
              {[
                { vid: '/services.mp4', delay: 0, offset: '0', likes: '1.2k', comments: '45' },
                { vid: '/service2.mp4', delay: 0.1, offset: '-50px', likes: '2.5k', comments: '82' },
                { vid: '/service3.mp4', delay: 0.2, offset: '50px', likes: '890', comments: '12' },
                { vid: '/services4.mp4', delay: 0.3, offset: '-20px', likes: '3.1k', comments: '104' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  className="insta-video-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay, duration: 0.8 }}
                  viewport={{ once: true }}
                  style={{ marginTop: item.offset }}
                >
                  <LazyVideo src={item.vid} scale={1.1} />
                  
                  {/* Reels UI Overlay */}
                  <div className="insta-reels-ui">
                    <div className="reels-side-actions">
                      <div className="reel-action">
                        <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><path d="M12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path></svg>
                        <span>{item.likes}</span>
                      </div>
                      <div className="reel-action">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="24" height="24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        <span>{item.comments}</span>
                      </div>
                      <div className="reel-action">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="24" height="24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      </div>
                    </div>
                    
                    <div className="reels-bottom-info">
                      <div className="reel-user">
                        <div className="reel-avatar">G</div>
                        <span>Garimadance...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="insta-overlay"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Student Testimonials */}
      <section className="testimonials section-padding" id="reviews">
        <div className="container">
          <div className="section-header-v2" style={{ textAlign: 'left', marginBottom: '60px' }}>
            <h2 className="section-title-v2" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '40px' }}>❤️</span> from Clients
            </h2>
            <p className="section-subtitle-v2" style={{ fontSize: '15px', opacity: 0.8, maxWidth: '350px' }}>
              We are Garima Dance Productions, helping all dance enthusiasts to live upto their dream
            </p>
          </div>

          {/* Row 1: Google Reviews */}
          <div className="google-reviews-grid">
            <motion.div className="google-rating-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
              <span className="google-label">Google Reviews</span>
              <div className="rating-box">
                <span className="rating-number">5.0</span>
              </div>
              <div className="stars">★★★★★</div>
              <span className="review-count">(236)</span>
            </motion.div>

            {[1, 2].map((_, i) => (
              <motion.div key={i} className="google-review-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <div className="review-header">
                  <div className="user-info">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                    <div>
                      <h4>Shubham Kumar</h4>
                      <p>Local Guide · 4 reviews · 42 photos</p>
                    </div>
                  </div>
                  <div className="more-dots">⋮</div>
                </div>
                <div className="review-stars">★★★★★ <span className="time">a month ago</span></div>
                <p className="review-text">
                  From two-left-feet to wedding floor heroes! I am incredibly grateful to Garima Dance Production. Despite our limited dance skills, we took a leap of faith... <span className="more-link">More</span>
                </p>
                <div className="review-footer">
                  <div className="review-icons">👍 📤</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 2: Video Testimonials */}
          <div className="video-testimonials-grid">
            {[
              { id: 1, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80', vid: 'https://www.youtube.com/embed/2iM5RoR0khg' },
              { id: 2, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80', vid: 'https://www.youtube.com/embed/3PQOq9pMMl4' },
              { id: 3, img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80', vid: 'https://www.youtube.com/embed/IIgDyLDnGK8' },
              { id: 4, img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80', vid: 'https://www.youtube.com/embed/IC7_5UXBQvE' },
            ].map((item, index) => (
              <motion.div 
                key={item.id} 
                className="video-review-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LazyVideo src={item.vid} className="testimonial-video-bg" scale={1.1} />
                <div className="video-overlay-gradient"></div>
                {index === 0 && <div className="carousel-arrow left">‹</div>}
                {index === 3 && <div className="carousel-arrow right">›</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. New FAQ Section */}
      <section className="faq-section-v2 section-padding">
        <div className="container">
          <div className="section-header-v2">
            <h2 className="section-title-v2">FAQ</h2>
            <p className="section-subtitle-v2">We are Garima Dance Productions, helping all dance enthusiasts to live up to their dream</p>
          </div>
          <div className="faq-v2-wrapper">
            <div className="faq-v2-list">
              {[
                { q: "1. Are online services available?", a: "We are Garima Dance Productions, helping all dance enthusiasts to live up to their dream" },
                { q: "2. Here comes question number second?", a: "We provide comprehensive dance training across various styles including classical, contemporary, and urban." },
                { q: "3. Here comes question number third?", a: "You can easily join our sessions by clicking the 'Join Academy' button or contacting us via WhatsApp." }
              ].map((faq, i) => (
                <div key={i} className="faq-v2-item">
                  <div className="faq-v2-question">
                    <span>{faq.q}</span>
                    <span className="faq-v2-icon">▾</span>
                  </div>
                  <div className="faq-v2-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="faq-v2-cta glass-card">
              <div className="cta-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Can't find what you're looking for?</h3>
              <button className="whatsapp-btn-v2 small">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.031.888 3.144.889h.002c3.181 0 5.767-2.586 5.768-5.766a5.756 5.756 0 00-5.768-5.766zM12.03 16.79c-1.13 0-2.112-.34-2.956-.848l-1.266.33.336-1.228c-.51-.83-.87-1.801-.869-2.923.001-2.695 2.193-4.887 4.888-4.887 1.305 0 2.532.508 3.456 1.431a4.85 4.85 0 011.432 3.457c0 2.694-2.193 4.886-4.887 4.886z"/></svg>
                Ask us directly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Contact Section ("Let's Catch up?") */}
      <section id="contact" className="contact-section-v2 section-padding">
        <div className="container">
          <div className="contact-v2-wrapper">
            <div className="contact-v2-text">
              <motion.h2 
                className="insta-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Let's <br /> <span className="gradient-text">Catch up?</span>
              </motion.h2>
              <p className="section-subtitle-v2">We are Garima Dance Productions, helping all dance enthusiasts to live up to their dream</p>
              <button className="whatsapp-btn-v2 large">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.031.888 3.144.889h.002c3.181 0 5.767-2.586 5.768-5.766a5.756 5.756 0 00-5.768-5.766zM12.03 16.79c-1.13 0-2.112-.34-2.956-.848l-1.266.33.336-1.228c-.51-.83-.87-1.801-.869-2.923.001-2.695 2.193-4.887 4.888-4.887 1.305 0 2.532.508 3.456 1.431a4.85 4.85 0 011.432 3.457c0 2.694-2.193 4.886-4.887 4.886z"/></svg>
                Connect on whatsapp
              </button>
            </div>
            <motion.div 
              className="contact-v2-form-card glass-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h3>Or let us reach you!</h3>
              <form className="contact-v2-form">
                <input type="text" placeholder="Full Name" className="v2-input" />
                <input type="text" placeholder="Contact Number" className="v2-input" />
                <input type="email" placeholder="Email ID" className="v2-input" />
                <div className="checkbox-row-v2">
                  <input type="checkbox" id="wa-consent" />
                  <label htmlFor="wa-consent">I agree to receive messages on WhatsApp. <Link to="/terms" style={{ color: 'var(--accent-color)' }}>Terms & Conditions</Link></label>
                </div>
                <button type="submit" className="send-details-btn">Send details</button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
