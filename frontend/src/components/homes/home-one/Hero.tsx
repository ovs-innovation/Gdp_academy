import React, { useEffect, useState } from 'react';
import type { SiteSettings } from '../../../services/settingsService';
import { motion, AnimatePresence } from 'framer-motion';

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

    const gridItems = !contentReady
      ? defaultGridItems
      : homeContent?.heroGridItems?.length > 0
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
                    .hero-intro {
                        min-height: 150px;
                    }
                }
            `}</style>

            <section className="hero-wrapper">
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

            </section>
        </>
    );
};

export default Hero;
