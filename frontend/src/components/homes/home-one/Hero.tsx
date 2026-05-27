import React, { useEffect, useState } from 'react';
import type { SiteSettings } from '../../../services/settingsService';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  settings?: SiteSettings;
  homeContent?: any;
}

const Hero: React.FC<HeroProps> = ({ settings: propSettings, homeContent }) => {
    const defaultVideos = [
        '/hero.mp4', 
        '/services.mp4', 
        '/services4.mp4', 
        '/service3.mp4'
    ];

    const dynamicVideos = homeContent?.heroVideos && homeContent.heroVideos.length > 0
        ? homeContent.heroVideos.map((v: any) => typeof v === 'string' ? v : v.url)
        : defaultVideos;

    const defaultGridItems = [
        { type: 'video', src: '/hero.mp4' },
        { type: 'image', src: '/svc-stage.png' },
        { type: 'video', src: '/services4.mp4' },
        { type: 'image', src: '/svc-wedding.jpg' },
        { type: 'video', src: '/service3.mp4' },
        { type: 'image', src: '/svc-hiphop.png' },
        { type: 'video', src: '/services.mp4' },
        { type: 'image', src: '/laptop.png' },
        { type: 'video', src: '/hero.mp4' }
    ];

    const gridItems = homeContent?.heroGridItems?.length > 0
        ? homeContent.heroGridItems
            .filter((item: { url?: string; src?: string }) => (item.url || item.src || "").trim())
            .map((item: { type?: string; url?: string; src?: string }) => ({
            type: item.type === 'image' ? 'image' : 'video',
            src: item.url || item.src || '',
          }))
        : homeContent?.heroVideos && homeContent.heroVideos.length > 0
        ? [
            { type: 'video', src: dynamicVideos[0] || '/hero.mp4' },
            { type: 'image', src: '/svc-stage.png' },
            { type: 'video', src: dynamicVideos[1] || dynamicVideos[0] || '/services4.mp4' },
            { type: 'image', src: '/svc-wedding.jpg' },
            { type: 'video', src: dynamicVideos[2] || dynamicVideos[0] || '/service3.mp4' },
            { type: 'image', src: '/svc-hiphop.png' },
            { type: 'video', src: dynamicVideos[3] || dynamicVideos[0] || '/services.mp4' },
            { type: 'image', src: '/laptop.png' },
            { type: 'video', src: dynamicVideos[0] || '/hero.mp4' }
          ]
        : defaultGridItems;

    const uniqueVideos = dynamicVideos;
    const [state, setState] = useState(1);

    const heroTitle = homeContent?.heroTitle || propSettings?.heroTitle || 'ELEVATE YOUR ARTISTRY';
    const heroSubtitle = homeContent?.heroSubtitle || propSettings?.heroSubtitle || 'Step into the world\'s most prestigious dance sanctuary. Where passion meets precision, and every move tells a story.';
    const heroBadge = homeContent?.heroBadge || homeContent?.heroBadgeText || propSettings?.heroBadge || null;
    const heroStats = homeContent?.heroStatistics || homeContent?.statistics || propSettings?.heroStatistics || '';
    const ctaButton = (homeContent?.heroCTAButtons && homeContent.heroCTAButtons[0]) || (homeContent?.ctaText ? { label: homeContent.ctaText, url: homeContent.ctaUrl || '/programs' } : null) || propSettings?.heroCTAButtons?.[0] || { label: 'GET STARTED', url: '/programs' };

    const [singleIndex, setSingleIndex] = useState(0);
    const [leftIndex, setLeftIndex] = useState(1);
    const [rightIndex, setRightIndex] = useState(2);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (state === 1) {
            timeout = setTimeout(() => setState(2), 3000);
        } else if (state === 2) {
            timeout = setTimeout(() => setState(3), 4000);
        } else if (state === 3) {
            timeout = setTimeout(() => setState(1), 5000);
        }
        return () => clearTimeout(timeout);
    }, [state]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (state === 2) {
            interval = setInterval(() => {
                setSingleIndex(prev => (prev + 1) % uniqueVideos.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [state]);

    useEffect(() => {
        let leftInterval: ReturnType<typeof setInterval>;
        let rightInterval: ReturnType<typeof setInterval>;
        if (state === 3) {
            leftInterval = setInterval(() => {
                setLeftIndex(prev => (prev + 1) % uniqueVideos.length);
            }, 3200);
            rightInterval = setInterval(() => {
                setRightIndex(prev => (prev + 2) % uniqueVideos.length);
            }, 3700);
        }
        return () => {
            clearInterval(leftInterval);
            clearInterval(rightInterval);
        };
    }, [state]);

    return (
        <>
            <style>{`
                .tg-header__area {
                    height: 96px;
                    background: #060606 !important;
                    position: fixed !important;
                    top: 0;
                    width: 100%;
                    z-index: 9999 !important;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .hero-wrapper {
                    background-color: #060606;
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 118px 2vw 40px 2vw; 
                }

                .steezy-complex-hero {
                    display: grid;
                    grid-template-columns: 2fr 1fr; 
                    width: 100%;
                    max-width: 1600px;
                    height: calc(100vh - 170px);
                    min-height: 650px;
                    max-height: 900px;
                    border-radius: 24px;
                    overflow: hidden;
                    background: #060606; 
                    gap: 8px; 
                    font-family: 'Montserrat', sans-serif;
                    align-items: stretch;
                }

                .left-video-area {
                    position: relative;
                    overflow: hidden;
                    min-height: 0;
                    height: 100%;
                    width: 100%;
                    background: #000;
                    border-radius: 24px 0 0 24px;
                }

                .state-container {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }
                
                .state-container video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .grid-3x3 {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(3, 1fr);
                    gap: 8px;
                }

                .split-2x1 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }

                .content-panel {
                    background: #0A0A0A;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                    padding: 28px 36px 36px;
                    height: 100%;
                    min-height: 0;
                    z-index: 10;
                    border-radius: 0 24px 24px 0;
                    overflow: hidden;
                }

                .content-headline {
                    font-family: 'Krona One', sans-serif;
                    font-size: clamp(26px, 2.9vw, 54px);
                    color: #FFFFFF;
                    line-height: 1.05;
                    font-weight: 900;
                    margin: 0 0 14px 0;
                    text-transform: uppercase;
                }

                .content-subtext {
                    font-family: 'Montserrat', sans-serif;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: clamp(15px, 1.15vw, 19px);
                    line-height: 1.55;
                    margin: 0 0 28px 0;
                }

                .content-btn {
                    width: 100%;
                    background-color: #634BFA;
                    color: #FFFFFF;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 700;
                    height: 60px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    font-size: 1rem;
                    border: none;
                    transition: background 0.3s ease;
                    flex-shrink: 0;
                }

                .content-btn:hover {
                    background-color: #5038e0;
                    color: #ffffff;
                }

                .hero-stats {
                    margin-top: 28px;
                    padding-top: 22px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    align-items: start;
                }

                .hero-stats .stat-item {
                    text-align: left;
                }

                .content-logos-wrapper {
                    margin-top: 28px;
                    display: flex;
                    gap: 28px;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .content-logos-wrapper a {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.95rem;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .content-logos-wrapper a:hover {
                    color: #ffffff;
                    transform: translateY(-2px);
                }

                .content-logos-wrapper i {
                    font-size: 1.35rem;
                }

                @media (max-width: 992px) {
                    .steezy-complex-hero {
                        grid-template-columns: 1fr;
                        height: auto;
                        min-height: 100vh;
                        border-radius: 24px;
                        gap: 0;
                    }
                    .left-video-area {
                        height: 50vh;
                        border-radius: 24px 24px 0 0;
                    }
                    .content-panel {
                        height: auto;
                        min-height: 50vh;
                        padding: 32px 28px 40px;
                        border-radius: 0 0 24px 24px;
                    }
                    .left-video-area {
                        min-height: 50vh;
                    }
                }
                
                @media (max-width: 768px) {
                    .hero-wrapper {
                        padding-top: 110px;
                        padding-left: 16px;
                        padding-right: 16px;
                    }
                }
            `}</style>

            <section className="hero-wrapper">
                <div className="steezy-complex-hero">
                    <div className="left-video-area">
                        <AnimatePresence initial={false}>
                            {state === 1 && (
                                <motion.div 
                                    key="state-1"
                                    className="state-container grid-3x3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    style={{ zIndex: 2 }}
                                >
                                    {gridItems.map((item, i) => (
                                        item.type === 'video' ? (
                                            <video key={`grid-${i}`} src={item.src} autoPlay muted loop playsInline />
                                        ) : (
                                            <img key={`grid-${i}`} src={item.src} alt={`collage-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        )
                                    ))}
                                </motion.div>
                            )}

                            {state === 2 && (
                                <motion.div 
                                    key="state-2"
                                    className="state-container"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                                    style={{ zIndex: 3 }}
                                >
                                    {uniqueVideos.map((vid, i) => (
                                        <video 
                                            key={`single-${i}`} 
                                            src={vid} 
                                            autoPlay muted loop playsInline 
                                            style={{
                                                position: 'absolute', inset: 0,
                                                opacity: singleIndex === i ? 1 : 0,
                                                transition: 'none' 
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            )}

                            {state === 3 && (
                                <motion.div 
                                    key="state-3"
                                    className="state-container split-2x1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    style={{ zIndex: 2 }}
                                >
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        {uniqueVideos.map((vid, i) => (
                                            <video 
                                                key={`left-${i}`} 
                                                src={vid} 
                                                autoPlay muted loop playsInline 
                                                style={{
                                                    position: 'absolute', inset: 0,
                                                    opacity: leftIndex === i ? 1 : 0,
                                                    transition: 'none'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        {uniqueVideos.map((vid, i) => (
                                            <video 
                                                key={`right-${i}`} 
                                                src={vid} 
                                                autoPlay muted loop playsInline 
                                                style={{
                                                    position: 'absolute', inset: 0,
                                                    opacity: rightIndex === i ? 1 : 0,
                                                    transition: 'none'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="content-panel">
                        {heroBadge && (
                            <span
                                className="hero-badge"
                                style={{
                                    display: 'inline-block',
                                    padding: '6px 14px',
                                    background: 'rgba(99, 75, 250, 0.1)',
                                    border: '1px solid rgba(99, 75, 250, 0.3)',
                                    color: '#634BFA',
                                    borderRadius: '20px',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '1.2px',
                                    marginBottom: '12px',
                                    alignSelf: 'flex-start',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {heroBadge}
                            </span>
                        )}

                        <h1 className="content-headline">{heroTitle}</h1>

                        <p className="content-subtext">{heroSubtitle}</p>

                        <Link to={ctaButton.url} className="content-btn">
                            {ctaButton.label}
                        </Link>

                        {heroStats && (
                            <div className="hero-stats">
                                {heroStats.split(',').map((stat: string, i: number) => {
                                    const trimmed = stat.trim();
                                    const firstSpaceIdx = trimmed.indexOf(' ');
                                    const num = firstSpaceIdx !== -1 ? trimmed.slice(0, firstSpaceIdx) : trimmed;
                                    const label = firstSpaceIdx !== -1 ? trimmed.slice(firstSpaceIdx + 1) : '';
                                    return (
                                        <div key={i} className="stat-item">
                                            <div style={{ fontSize: '18px', fontWeight: 900, color: '#634BFA', fontFamily: 'Krona One, sans-serif' }}>{num}</div>
                                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '4px', fontWeight: 600 }}>{label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="content-logos-wrapper">
                            <a href={`https://wa.me/${propSettings?.whatsappNumber || '9711384768'}`} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> WhatsApp
                            </a>
                            <a href="https://youtube.com/@garimadanceproductions1146?si=XEMV40bqEVW6JM71" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-youtube" style={{ color: '#FF0000' }}></i> YouTube
                            </a>
                            <a href="https://www.instagram.com/gdp_garimadanceproductions?igsh=MWhueGpqZGQzZGN0ZA==" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram" style={{ color: '#E1306C' }}></i> Instagram
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;


