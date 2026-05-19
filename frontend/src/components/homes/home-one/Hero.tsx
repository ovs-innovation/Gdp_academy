import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const uniqueVideos = [
    '/hero.mp4', 
    '/services.mp4', 
    '/services4.mp4', 
    '/service3.mp4'
];

const gridItems = [
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

const Hero = () => {
    // 1 = Grid (3s), 2 = Single Zoom (4s), 3 = 2-Split (5s)
    const [state, setState] = useState(1);
    
    // Independent video indexes for completely gapless CSS cuts
    const [singleIndex, setSingleIndex] = useState(0);
    const [leftIndex, setLeftIndex] = useState(1);
    const [rightIndex, setRightIndex] = useState(2);

    // Master State Machine Loop
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

    // Hard Cuts for State 2 (Single video cuts every 3s)
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (state === 2) {
            interval = setInterval(() => {
                setSingleIndex(prev => (prev + 1) % uniqueVideos.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [state]);

    // Hard Cuts for State 3 (Left 3.2s, Right 3.7s - completely independent)
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
                /* NAVBAR OVERRIDE */
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

                /* Outer Wrapper */
                .hero-wrapper {
                    background-color: #060606;
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 130px 2vw 40px 2vw; 
                }

                /* The Parent Box */
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
                }

                /* LEFT PANEL */
                .left-video-area {
                    position: relative;
                    overflow: hidden;
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

                /* STATE 1: Grid */
                .grid-3x3 {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(3, 1fr);
                    gap: 8px;
                }

                /* STATE 3: Split */
                .split-2x1 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }

                /* RIGHT PANEL */
                .content-panel {
                    background: #0A0A0A;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 48px 40px;
                    height: 100%;
                    z-index: 10;
                    border-radius: 0 24px 24px 0;
                }

                .content-headline {
                    font-family: 'Krona One', sans-serif;
                    font-size: clamp(36px, 4vw, 75px);
                    color: #FFFFFF;
                    line-height: 1;
                    font-weight: 900;
                    margin-bottom: 16px;
                    text-transform: uppercase;
                }

                .content-subtext {
                    font-family: 'Montserrat', sans-serif;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: clamp(16px, 1.2vw, 20px);
                    line-height: 1.5;
                    margin-bottom: 40px;
                }

                .content-btn {
                    width: 100%;
                    background-color: #634BFA;
                    color: #FFFFFF;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 700;
                    height: 64px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    font-size: 1.1rem;
                    border: none;
                    transition: background 0.3s ease;
                }

                .content-btn:hover {
                    background-color: #5038e0;
                    color: #ffffff;
                }

                .content-logos-wrapper {
                    margin-top: 50px;
                    display: flex;
                    gap: 30px;
                    opacity: 0.3;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .content-logos-wrapper span {
                    color: #FFF;
                    font-size: 1rem;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .content-logos-wrapper i {
                    font-size: 1.4rem;
                }

                /* Responsive Mobile */
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
                        padding: 60px 24px;
                        border-radius: 0 0 24px 24px;
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
                    {/* LEFT SIDE: Dynamic Video Area */}
                    <div className="left-video-area">
                        <AnimatePresence initial={false}>
                            {/* STATE 1: 3x3 Grid Collage */}
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

                            {/* STATE 2: Single Video Zoom */}
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
                                                transition: 'none' // Instant zero-gap cut
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            )}

                            {/* STATE 3: 2-Split Panel */}
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
                                    {/* LEFT COLUMN */}
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
                                    
                                    {/* RIGHT COLUMN */}
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

                    {/* RIGHT SIDE: Static Content Panel */}
                    <div className="content-panel">
                        <h1 className="content-headline">
                            MASTER THE <br/> ART OF DANCE
                        </h1>
                        
                        <p className="content-subtext">
                            With 1500+ online classes, live workshops, and structured programs designed by Garima Dance Production.
                        </p>
                        
                        <Link to="/programs" className="content-btn">
                            GET STARTED
                        </Link>

                        <div className="content-logos-wrapper">
                            <span><i className="fab fa-google"></i> Google</span>
                            <span><i className="fab fa-facebook-f"></i> Facebook</span>
                            <span><i className="fab fa-instagram"></i> Instagram</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;


