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

    const welcomeLine1 = homeContent?.heroTitleLine1 || 'Welcome to';
    const welcomeLine2 = homeContent?.heroTitleLine2 || homeContent?.heroTitleHighlight || 'Garima Dance';
    const welcomeLine3 = homeContent?.heroTitleLine3 || 'Productions';
    const heroSubtitle = homeContent?.heroSubtitle || propSettings?.heroSubtitle || 'From unforgettable wedding performances to live online dance classes and professional dance education GDP helps you learn, aspire, dance and celebrate.';
    const heroStatsRaw = homeContent?.heroStatistics || homeContent?.statistics || propSettings?.heroStatistics || '';
    const ctaButton = (homeContent?.heroCTAButtons && homeContent.heroCTAButtons[0]) || (homeContent?.ctaText ? { label: homeContent.ctaText, url: homeContent.ctaUrl || '/services' } : null) || propSettings?.heroCTAButtons?.[0] || { label: 'Explore Our Services', url: '/services' };

    const defaultStats = [
        { value: '250K+', label: 'SOCIAL COMMUNITY' },
        { value: '15+', label: 'YEARS OF EXPERIENCE' },
        { value: '700+', label: 'WEDDINGS CHOREOGRAPHED' },
        { value: '50,000+', label: 'STUDENTS TRAINED' },
    ];

    const parsedStats = heroStatsRaw
        ? heroStatsRaw.split(',').map((stat: string) => {
            const trimmed = stat.trim();
            const firstSpaceIdx = trimmed.indexOf(' ');
            return {
                value: firstSpaceIdx !== -1 ? trimmed.slice(0, firstSpaceIdx) : trimmed,
                label: firstSpaceIdx !== -1 ? trimmed.slice(firstSpaceIdx + 1).toUpperCase() : '',
            };
        }).filter((s: { value: string }) => s.value)
        : defaultStats;

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
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 118px 2vw 40px 2vw;
                }

                .hero-intro {
                    text-align: center;
                    max-width: 900px;
                    margin: 0 auto 32px;
                    position: relative;
                }

                .hero-intro::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 120%;
                    height: 200%;
                    background: radial-gradient(ellipse at center, rgba(99, 75, 250, 0.08) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                }

                .hero-intro > * {
                    position: relative;
                    z-index: 1;
                }

                .hero-welcome-title {
                    font-family: var(--font-title, 'Krona One', sans-serif);
                    font-size: clamp(32px, 5vw, 64px);
                    color: #FFFFFF;
                    line-height: 1.1;
                    font-weight: 400;
                    margin: 0 0 24px 0;
                    text-transform: none;
                    letter-spacing: 0;
                }

                .hero-welcome-title .highlight-line {
                    background: var(--highlight-gradient, linear-gradient(135deg, #634BFA 0%, #1EFFE4 100%));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-welcome-subtext {
                    font-family: var(--font-body, 'Montserrat', sans-serif);
                    color: rgba(255, 255, 255, 0.65);
                    font-size: clamp(15px, 1.4vw, 18px);
                    line-height: 1.65;
                    margin: 0 auto;
                    max-width: 720px;
                    font-weight: 400;
                }

                .hero-cta-row {
                    display: flex;
                    justify-content: center;
                    margin-top: 36px;
                    margin-bottom: 32px;
                }

                .hero-explore-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    background-color: var(--primary-color, #634BFA);
                    color: #FFFFFF;
                    font-family: var(--font-body, 'Montserrat', sans-serif);
                    font-weight: 700;
                    font-size: 1rem;
                    padding: 16px 36px;
                    border-radius: 50px;
                    text-decoration: none;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                    border: none;
                }

                .hero-explore-btn:hover {
                    background-color: #5038e0;
                    color: #ffffff;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(99, 75, 250, 0.35);
                }

                .hero-explore-btn .arrow {
                    font-size: 1.2rem;
                    line-height: 1;
                }

                .hero-stats-bar {
                    width: 100%;
                    max-width: 1200px;
                    display: grid;
                    grid-template-columns: repeat(${parsedStats.length}, 1fr);
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    overflow: hidden;
                    margin-bottom: 0;
                }

                .hero-stats-bar .stat-col {
                    text-align: center;
                    padding: 28px 16px;
                    position: relative;
                }

                .hero-stats-bar .stat-col:not(:last-child)::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 20%;
                    height: 60%;
                    width: 1px;
                    background: rgba(255, 255, 255, 0.1);
                }

                .hero-stats-bar .stat-value {
                    font-family: var(--font-title, 'Krona One', sans-serif);
                    font-size: clamp(22px, 2.5vw, 36px);
                    font-weight: 400;
                    color: var(--primary-color, #634BFA);
                    line-height: 1.2;
                    margin-bottom: 8px;
                }

                .hero-stats-bar .stat-label {
                    font-family: var(--font-body, 'Montserrat', sans-serif);
                    font-size: clamp(9px, 0.9vw, 11px);
                    color: rgba(255, 255, 255, 0.5);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 600;
                }

                .hero-social-row {
                    display: flex;
                    justify-content: center;
                    gap: 28px;
                    align-items: center;
                    flex-wrap: wrap;
                    margin-top: 28px;
                }

                .hero-social-row a {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.95rem;
                    font-family: var(--font-body, 'Montserrat', sans-serif);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .hero-social-row a:hover {
                    color: #ffffff;
                    transform: translateY(-2px);
                }

                .hero-social-row i {
                    font-size: 1.35rem;
                }

                .hero-video-stage {
                    width: 100%;
                    max-width: 1600px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: center;
                }

                /* STEEZY left-panel video box — same 2/3 width + tall height as original clone */
                .steezy-complex-hero {
                    width: 66.666%;
                    max-width: 1064px;
                    height: clamp(650px, calc(100vh - 200px), 900px);
                    min-height: 650px;
                    border-radius: 24px;
                    overflow: hidden;
                    background: #060606;
                    font-family: 'Montserrat', sans-serif;
                    flex-shrink: 0;
                }

                .left-video-area {
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                    width: 100%;
                    background: #000;
                    border-radius: 24px;
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

                .split-2x1 > div {
                    position: relative;
                    overflow: hidden;
                    min-height: 0;
                }

                @media (max-width: 992px) {
                    .hero-stats-bar {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .hero-stats-bar .stat-col:nth-child(2)::after {
                        display: none;
                    }
                    .steezy-complex-hero {
                        width: 100%;
                        max-width: 100%;
                        height: 50vh;
                        min-height: 420px;
                        max-height: none;
                    }
                }
                
                @media (max-width: 768px) {
                    .hero-wrapper {
                        padding-top: 110px;
                        padding-left: 16px;
                        padding-right: 16px;
                    }
                    .steezy-complex-hero {
                        width: 100%;
                        height: 45vh;
                        min-height: 320px;
                    }
                    .hero-stats-bar {
                        grid-template-columns: 1fr 1fr;
                    }
                    .hero-stats-bar .stat-col {
                        padding: 20px 12px;
                    }
                    .hero-stats-bar .stat-col:nth-child(odd):not(:last-child)::after {
                        display: block;
                    }
                    .hero-stats-bar .stat-col:nth-child(even)::after {
                        display: none;
                    }
                }

                @media (max-width: 480px) {
                    .hero-stats-bar {
                        grid-template-columns: 1fr;
                    }
                    .hero-stats-bar .stat-col::after {
                        display: none !important;
                    }
                    .hero-stats-bar .stat-col:not(:last-child) {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    }
                }
            `}</style>

            <section className="hero-wrapper">
                <div className="hero-intro">
                    <h1 className="hero-welcome-title">
                        {welcomeLine1}<br />
                        <span className="highlight-line">{welcomeLine2}</span><br />
                        {welcomeLine3}
                    </h1>
                    <p className="hero-welcome-subtext">{heroSubtitle}</p>
                </div>

                <div className="hero-video-stage">
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
                                    style={{ zIndex: 3, transformOrigin: 'center center' }}
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
                </div>
                </div>

                <div className="hero-cta-row">
                    <Link to={ctaButton.url} className="hero-explore-btn">
                        {ctaButton.label}
                        <span className="arrow" aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="hero-stats-bar">
                    {parsedStats.map((stat: { value: string; label: string }, i: number) => (
                        <div key={i} className="stat-col">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="hero-social-row">
                    <a href={`https://wa.me/${propSettings?.whatsappNumber || '7838416907'}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> WhatsApp
                    </a>
                    <a href="https://youtube.com/@garimadanceproductions1146?si=XEMV40bqEVW6JM71" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-youtube" style={{ color: '#FF0000' }}></i> YouTube
                    </a>
                    <a href="https://www.instagram.com/gdp_garimadanceproductions?igsh=MWhueGpqZGQzZGN0ZA==" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram" style={{ color: '#E1306C' }}></i> Instagram
                    </a>
                </div>
            </section>
        </>
    );
};

export default Hero;


