import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SiteSettings } from '../../../services/settingsService';
import { motion, AnimatePresence } from 'framer-motion';
import { resolvePublicMediaUrl, extractYoutubeVideoId } from '../../../utils/mediaUrl';

interface HeroProps {
  settings?: SiteSettings | null;
  homeContent?: any;
  /** When false, show skeletons — never flash hardcoded copy then CMS text. */
  contentReady?: boolean;
}

const FALLBACK_SUBTITLE =
  'Premium Kathak, Contemporary, and Bollywood dance classes tailored for students worldwide. Discover rhythm, precision, and passion under expert guidance.';

const Hero: React.FC<HeroProps> = ({ settings: propSettings, homeContent, contentReady = true }) => {
    const defaultVideos = [
        '/hero.mp4', 
        '/services.mp4', 
        '/services4.mp4', 
        '/service3.mp4'
    ];

    const dynamicVideos = homeContent?.heroVideos && homeContent.heroVideos.length > 0
        ? homeContent.heroVideos
            .map((v: any) => resolvePublicMediaUrl(typeof v === 'string' ? v : v?.url))
            .filter(Boolean)
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

    const gridItems = !contentReady
      ? defaultGridItems
      : homeContent?.heroGridItems?.length > 0
        ? homeContent.heroGridItems
            .filter((item: { url?: string; src?: string }) => (item.url || item.src || "").trim())
            .map((item: { type?: string; url?: string; src?: string }) => ({
            type: item.type === 'image' ? 'image' : 'video',
            src: resolvePublicMediaUrl(item.url || item.src || ''),
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

    const welcomeLine1 = contentReady
      ? (homeContent?.heroTitleLine1 || 'Welcome to')
      : '';
    const welcomeLine2 = contentReady
      ? (homeContent?.heroTitleLine2 || homeContent?.heroTitleHighlight || 'Garima Dance')
      : '';
    const welcomeLine3 = contentReady
      ? (homeContent?.heroTitleLine3 || 'Productions')
      : '';
    const heroSubtitle = contentReady
      ? (homeContent?.heroSubtitle || propSettings?.heroSubtitle || FALLBACK_SUBTITLE)
      : '';

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
    }, [state, uniqueVideos.length]);

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
    }, [state, uniqueVideos.length]);

    const [showDemoModal, setShowDemoModal] = useState(false);
    const rawHeroYt = homeContent?.heroYoutubeId || propSettings?.heroYoutubeId || '1phsCpxcBZU';
    const heroYoutubeId = extractYoutubeVideoId(rawHeroYt) || rawHeroYt;

    const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else if (id === 'services') {
            window.location.href = '/services';
        }
    };

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
                    padding: 140px 2vw 40px 2vw;
                }

                .hero-pill-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(99, 75, 250, 0.08);
                    border: 1px solid rgba(99, 75, 250, 0.25);
                    padding: 8px 16px;
                    border-radius: 100px;
                    margin-bottom: 24px;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }

                .hero-pill-badge:hover {
                    background: rgba(99, 75, 250, 0.12);
                    border-color: rgba(99, 75, 250, 0.4);
                }

                .hero-pill-badge span {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    color: rgba(255, 255, 255, 0.85);
                    text-transform: uppercase;
                }

                .hero-pill-badge .heart-icon {
                    font-size: 12px;
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }

                .hero-intro {
                    text-align: center;
                    max-width: 900px;
                    margin: 0 auto 32px;
                    position: relative;
                    min-height: 180px;
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

                .hero-btns-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    margin: 0 auto 48px auto;
                    width: 100%;
                    z-index: 10;
                    position: relative;
                }

                .hero-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(135deg, #634BFA 0%, #392D91 100%);
                    color: #FFFFFF !important;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    padding: 14px 28px;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    text-decoration: none;
                    box-shadow: 0 4px 15px rgba(99, 75, 250, 0.3);
                }

                .hero-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(99, 75, 250, 0.5);
                }

                .hero-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #FFFFFF !important;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    padding: 14px 28px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    backdrop-filter: blur(10px);
                }

                .hero-btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.25);
                }

                .btn-icon {
                    width: 18px;
                    height: 18px;
                }

                .hero-text-skel {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 14px;
                    width: 100%;
                }

                .hero-text-skel .home-skel {
                    border-radius: 8px;
                }

                .hero-skel-title {
                    height: clamp(36px, 5vw, 56px);
                    width: min(70%, 520px);
                }

                .hero-skel-title-sm {
                    height: clamp(28px, 4vw, 44px);
                    width: min(48%, 340px);
                }

                .hero-skel-sub {
                    height: 18px;
                    width: min(90%, 640px);
                    margin-top: 8px;
                }

                .hero-skel-sub-2 {
                    height: 18px;
                    width: min(72%, 480px);
                }

                .hero-video-stage {
                    width: 100%;
                    max-width: 1600px;
                    margin: 0 auto 48px auto;
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

                .hero-bottom-stats {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 12px;
                    width: 100%;
                    max-width: 1064px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 20px 16px;
                    margin-bottom: 32px;
                    backdrop-filter: blur(10px);
                }

                .stat-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 10px;
                    min-width: 0;
                }

                .stat-box:not(:last-child) {
                    border-right: 1px solid rgba(255, 255, 255, 0.08);
                }

                .stat-purple-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: rgba(99, 75, 250, 0.1);
                    color: #634BFA;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .stat-purple-icon svg {
                    width: 20px;
                    height: 20px;
                }

                .stat-info {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    flex: 1;
                }

                .stat-main-val {
                    font-family: 'Krona One', sans-serif;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 1.2;
                    white-space: nowrap;
                }

                .stat-stars {
                    color: #FFB800;
                    font-size: 10px;
                    margin-left: 4px;
                    letter-spacing: 0.5px;
                }

                .stat-sub-label {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.45);
                    margin-top: 3px;
                    line-height: 1.3;
                    white-space: normal;
                    word-break: break-word;
                }

                .hero-trusted-by {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    width: 100%;
                    max-width: 1064px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    padding-top: 24px;
                    margin-top: 16px;
                }

                .trusted-title {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    color: rgba(255, 255, 255, 0.35);
                    text-transform: uppercase;
                }

                .trusted-flags-row {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                }

                .trusted-flag-pill {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 8px 14px;
                    border-radius: 30px;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.75);
                }

                .flag-img {
                    width: 20px;
                    height: 14px;
                    border-radius: 2px;
                    object-fit: cover;
                    box-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
                }

                .trusted-more-link {
                    color: #634BFA;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .trusted-more-link:hover {
                    color: #1EFFE4;
                    text-shadow: 0 0 10px rgba(30, 255, 228, 0.3);
                }

                /* Video Demo Modal Styles */
                .demo-video-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .demo-video-modal-container {
                    position: relative;
                    width: 100%;
                    max-width: 960px;
                    aspect-ratio: 16/9;
                    background: #000;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px -12px rgba(99, 75, 250, 0.25);
                }

                .demo-video-modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 36px;
                    height: 36px;
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    color: #FFFFFF;
                    font-size: 18px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    transition: all 0.2s ease;
                }

                .demo-video-modal-close:hover {
                    background: #FF0000;
                    border-color: #FF0000;
                }

                .demo-iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }

                @media (max-width: 992px) {
                    .steezy-complex-hero {
                        width: 100%;
                        max-width: 100%;
                        height: 50vh;
                        min-height: 420px;
                        max-height: none;
                    }
                    .hero-bottom-stats {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 10px;
                        padding: 16px 12px;
                    }
                    .stat-box {
                        border-right: none !important;
                        border-bottom: none !important;
                        padding: 10px 8px;
                    }
                    .stat-box:nth-child(1),
                    .stat-box:nth-child(2) {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                        padding-bottom: 12px;
                    }
                    .stat-box:nth-child(odd) {
                        border-right: 1px solid rgba(255, 255, 255, 0.08);
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
                    .hero-intro {
                        min-height: 150px;
                    }
                    .hero-bottom-stats {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 8px;
                        padding: 14px 10px;
                    }
                    .stat-box {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        gap: 8px;
                        padding: 10px 6px;
                        border-right: none !important;
                    }
                    .stat-box:nth-child(odd) {
                        border-right: none !important;
                    }
                    .stat-box:nth-child(1),
                    .stat-box:nth-child(2) {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                        padding-bottom: 12px;
                        margin-bottom: 0;
                    }
                    .stat-purple-icon {
                        width: 34px;
                        height: 34px;
                    }
                    .stat-purple-icon svg {
                        width: 17px;
                        height: 17px;
                    }
                    .stat-main-val {
                        font-size: 14px;
                    }
                    .stat-sub-label {
                        font-size: 9px;
                        line-height: 1.25;
                    }
                    .hero-btns-row {
                        flex-direction: column;
                        width: 100%;
                        margin-bottom: 24px;
                    }
                    .hero-btn-primary, .hero-btn-secondary {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>

            <section className="hero-wrapper">
                <div className="hero-pill-badge">
                    <span className="heart-icon">💜</span>
                    <span>INDIA'S ONLINE-FIRST DANCE & FITNESS COMPANY</span>
                </div>

                <div className="hero-intro" aria-busy={!contentReady}>
                    {!contentReady ? (
                      <div className="hero-text-skel" role="status" aria-label="Loading hero">
                        <div className="home-skel hero-skel-title" />
                        <div className="home-skel hero-skel-title-sm" />
                        <div className="home-skel hero-skel-sub" />
                        <div className="home-skel hero-skel-sub-2" />
                      </div>
                    ) : (
                      <>
                        <h1 className="hero-welcome-title">
                            {welcomeLine1}<br />
                            <span className="highlight-line">{welcomeLine2}</span><br />
                            {welcomeLine3}
                        </h1>
                        <p className="hero-welcome-subtext">{heroSubtitle}</p>
                      </>
                    )}
                </div>

                <div className="hero-btns-row">
                    <Link to="/contact" className="hero-btn-primary">
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Book Free Trial
                        <span style={{ marginLeft: '4px' }}>→</span>
                    </Link>
                    <a href="#services" onClick={handleScrollTo('services')} className="hero-btn-secondary">
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        Explore Services
                    </a>
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
                                                <video key={`grid-${i}`} src={item.src} autoPlay muted loop playsInline preload="none" />
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
                                                autoPlay muted loop playsInline preload="none"
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
                                                    autoPlay muted loop playsInline preload="none"
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
                                                    autoPlay muted loop playsInline preload="none"
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

                <div className="hero-bottom-stats">
                    {(homeContent?.homeStats || [
                        { value: "4.9", label: "320+ Reviews" },
                        { value: "15+", label: "Countries" },
                        { value: "10K+", label: "Happy Students" },
                        { value: "250+", label: "Weddings" }
                    ]).slice(0, 4).map((stat: any, idx: number) => (
                        <div key={idx} className="stat-box">
                            <div className="stat-purple-icon">
                                {idx === 0 ? (
                                    <svg fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
                                    </svg>
                                ) : idx === 1 ? (
                                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="2" y1="12" x2="22" y2="12"/>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                    </svg>
                                ) : idx === 2 ? (
                                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                ) : (
                                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="8" r="7"/>
                                        <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88"/>
                                    </svg>
                                )}
                            </div>
                            <div className="stat-info">
                                <span className="stat-main-val">
                                    {stat.value}
                                    {idx === 0 && <span className="stat-stars">★★★★★</span>}
                                </span>
                                <span className="stat-sub-label">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hero-trusted-by">
                    <span className="trusted-title">Trusted By Students From</span>
                    <div className="trusted-flags-row">
                        <div className="trusted-flag-pill">
                            <img src="https://flagcdn.com/w40/in.png" alt="India" className="flag-img" />
                            <span>India</span>
                        </div>
                        <div className="trusted-flag-pill">
                            <img src="https://flagcdn.com/w40/ae.png" alt="Dubai" className="flag-img" />
                            <span>Dubai</span>
                        </div>
                        <div className="trusted-flag-pill">
                            <img src="https://flagcdn.com/w40/us.png" alt="USA" className="flag-img" />
                            <span>USA</span>
                        </div>
                        <div className="trusted-flag-pill">
                            <img src="https://flagcdn.com/w40/gb.png" alt="UK" className="flag-img" />
                            <span>UK</span>
                        </div>
                        <div className="trusted-flag-pill">
                            <img src="https://flagcdn.com/w40/ca.png" alt="Canada" className="flag-img" />
                            <span>Canada</span>
                        </div>
                        <div className="trusted-flag-pill">
                            <img src="https://flagcdn.com/w40/au.png" alt="Australia" className="flag-img" />
                            <span>Australia</span>
                        </div>
                        <a href="#contact" onClick={handleScrollTo('contact')} className="trusted-more-link">and more...</a>
                    </div>
                </div>
            </section>

            {showDemoModal && (
                <div className="demo-video-modal-overlay" onClick={() => setShowDemoModal(false)}>
                    <div className="demo-video-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="demo-video-modal-close" onClick={() => setShowDemoModal(false)}>×</button>
                        <iframe 
                            className="demo-iframe"
                            src={`https://www.youtube.com/embed/${heroYoutubeId}?autoplay=1`}
                            title="Demo Class Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Hero;
