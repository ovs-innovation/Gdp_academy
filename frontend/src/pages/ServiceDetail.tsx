import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { useSiteData } from '../contexts/SiteDataContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { submitEnquiry } from '../services/enquiryService';
import FormResultModal, { type FormResultType } from '../components/common/FormResultModal';
import {
  sanitizeEnquiryField,
  validateEnquiryField,
  validateEnquiryForm,
  hasEnquiryErrors,
  type EnquiryFieldErrors,
} from '../utils/enquiryValidation';
import '../styles/services.css';

// ──────────────────────────────────────────────────────────────
// Service content data
// ──────────────────────────────────────────────────────────────
const SERVICE_DATA: Record<string, {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  youtubeId?: string;
  stats?: { value: string; label: string }[];
  whyUs?: { title: string; description: string; iconKey: string }[];
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: { num: string; title: string; description: string; image: string }[];
  faq?: { q: string; a: string }[];
}> = {
  'wedding-choreography': {
    title: 'Wedding Choreography',
    tagline: 'Virtual & In-Person | Worldwide',
    description:
      'Make your wedding unforgettable with custom choreography crafted around you. From romantic first dances to energetic sangeet group performances, our expert choreographers design routines that match your comfort level and vision — whether you\'re a first-timer or a trained dancer.',
    features: [
      'Personalised first dance & sangeet routines',
      'Group choreography for family & friends',
      'Complementary music edits & mashups',
      'Virtual & in-person packages available',
      'Flexible schedule around your wedding timeline',
      'Professional video feedback & corrections',
    ],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&h=700&q=85',
    youtubeId: '5EpB_2G9aPA',
    stats: [
      { value: '700+', label: 'Weddings\nChoreographed' },
      { value: '12+', label: 'Years of\nExperience' },
      { value: '15+', label: 'Countries\nReached' },
      { value: '100%', label: 'Beginner\nFriendly' }
    ],
    whyUs: [
      {
        title: 'Personalized Choreography',
        description: 'Every performance is customized according to your story, comfort level and wedding vision.',
        iconKey: 'heart'
      },
      {
        title: 'Virtual & In-Person',
        description: 'Learn through tutorials/Zoom from anywhere in the world or choose on-site group rehearsals.',
        iconKey: 'video'
      },
      {
        title: 'Beginner Friendly',
        description: 'Never danced before? No problem. We specialize in teaching all skill levels with patience.',
        iconKey: 'smile'
      },
      {
        title: 'Professional Support',
        description: 'From song selection and theme planning to performance day execution, we are with you.',
        iconKey: 'users'
      },
      {
        title: 'High-Quality Mixes',
        description: 'Our in-house sound editors compile seamless, high-quality music mixes and mashups for your sets.',
        iconKey: 'music'
      },
      {
        title: 'Worldwide Service',
        description: 'Trusted by couples and families across India, USA, UK, UAE, and around the globe.',
        iconKey: 'globe'
      }
    ],
    processTitle: 'Our Wedding Choreography Process',
    processSubtitle: 'A simple, step-by-step and stress-free journey to your dream performance',
    processSteps: [
      {
        num: '01',
        title: 'Book a Consultation',
        description: 'Share your wedding details, events, dates, and performance requirements with us to begin.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '02',
        title: 'We Help You Select Songs',
        description: 'We will guide you in choosing songs that match your personalities, themes, and celebrations.',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '03',
        title: 'Custom Audio Mix & Choreography',
        description: 'Our team designs your custom sound mix and choreographs steps tailored specifically to your comfort level.',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '04',
        title: 'Structured Timeline Roadmap',
        description: 'Receive a custom practice schedule and step-by-step recorded video tutorials to guide your learning.',
        image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '05',
        title: 'Interactive Rehearsals',
        description: 'Join virtual Zoom practice sessions or in-person studio rehearsals with our professional instructors.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '06',
        title: 'Showstopper Performance',
        description: 'Shine on stage with maximum confidence, grace, and perfect coordination, creating magic.',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=500&q=80'
      }
    ],
    faq: [
      { q: 'How far in advance should I book?', a: 'We recommend booking at least 2–3 months before your wedding date for the best experience.' },
      { q: 'Can I do this online?', a: 'Absolutely! Our virtual packages are delivered via Zoom with full-HD session recording for review.' },
      { q: 'How many people can join?', a: 'We handle groups of all sizes — from intimate couples to large sangeet groups of 30+.' },
    ],
  },
  'online-dance-classes': {
    title: 'Online Dance Classes',
    tagline: 'Live Zoom | All Levels',
    description:
      'Join our expert-led live Zoom dance classes from the comfort of your home. Our instructors provide real-time feedback and corrections so every session feels like a personal one-on-one class. From Bollywood to contemporary, we have something for every style and skill level.',
    features: [
      'Live interactive Zoom sessions',
      'Real-time feedback & corrections',
      'Morning & evening batch options',
      'All styles — Bollywood, contemporary, classical',
      'Beginner to advanced levels',
      'Session recordings shared after class',
    ],
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&h=700&q=85',
    youtubeId: 'q-5EpB_2G9a',
    stats: [
      { value: '5000+', label: 'Active\nStudents' },
      { value: '15+', label: 'Dance\nStyles Taught' },
      { value: '500+', label: 'Live Zoom\nBatches' },
      { value: '100%', label: 'Interactive\nLearning' }
    ],
    whyUs: [
      {
        title: 'Live Interactive Zoom',
        description: 'Fully interactive live classes where our teachers see you, guide you, and call out corrections.',
        iconKey: 'video'
      },
      {
        title: 'Real-time Corrections',
        description: 'Get immediate body posture and step corrections during class for faster, safer improvement.',
        iconKey: 'eye'
      },
      {
        title: 'Flexible Timings',
        description: 'Choose from multiple morning, afternoon, and evening batches to fit your busy schedule.',
        iconKey: 'clock'
      },
      {
        title: 'Expert Instructors',
        description: 'Learn from highly trained, friendly instructors who specialize in teaching absolute beginners.',
        iconKey: 'users'
      },
      {
        title: 'Access Recordings',
        description: 'Get class recordings within 24 hours to review and practice at home between sessions.',
        iconKey: 'play'
      },
      {
        title: 'Global Community',
        description: 'Connect and dance with batchmates from all over the world, building confidence together.',
        iconKey: 'globe'
      }
    ],
    processTitle: 'Our Online Class Process',
    processSubtitle: 'An interactive, structured roadmap to mastering your favorite dance styles',
    processSteps: [
      {
        num: '01',
        title: 'Select Your Style & Batch',
        description: 'Choose from Bollywood, Hip Hop, Semi-Classical, Contemporary, and beginner-friendly sessions.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '02',
        title: 'Get Your Zoom Link',
        description: 'Receive your private interactive class links, batch schedules, and student dashboard log-ins.',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '03',
        title: 'Interactive Live Class',
        description: 'Join live sessions with two-way video communication, real-time corrections, and group energy.',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '04',
        title: 'Count-by-Count Breakdown',
        description: 'Instructors break down complex movements, footwork, hand gestures, and performance expressions.',
        image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '05',
        title: 'Review Recordings',
        description: 'Access the dynamic class video recording via your dashboard to practice anytime at home.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '06',
        title: 'Performance & Progress',
        description: 'Record your routine, get detailed personal video reviews, and graduate to the next skill level.',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=500&q=80'
      }
    ],
    faq: [
      { q: 'Do I need any dance experience?', a: 'Not at all! We have dedicated beginner batches to get you started from scratch.' },
      { q: 'What equipment do I need?', a: 'Just a device with camera/mic and a clear space of about 6x6 feet.' },
      { q: 'Are classes recorded?', a: 'Yes, recordings are shared with enrolled students for review within 24 hours.' },
    ],
  },
  'pre-recorded-courses': {
    title: 'Pre-Recorded Dance Courses',
    tagline: '24/7 Access | Self-Paced',
    description:
      'Access our ever-growing library of professional choreography and technique tutorials. Learn at your own pace, revisit any lesson as many times as you like, and track your progress as you advance from beginner to advanced dancer — all on your own schedule.',
    features: [
      'Full choreography video library',
      'Step-by-step technique breakdowns',
      'Learn anytime, on any device',
      'Regular new content uploads',
      'Progress tracking dashboard',
      'Community access & Q&A support',
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&h=700&q=85',
    youtubeId: 'x-5EpB_2G9a',
    stats: [
      { value: '10,000+', label: 'Lifetime\nLearners' },
      { value: '24/7', label: 'Access\nAnywhere' },
      { value: '100+', label: 'HD\nChoreographies' },
      { value: '100%', label: 'Self-Paced\nLearning' }
    ],
    whyUs: [
      {
        title: 'Learn Anytime, Anywhere',
        description: 'Complete 24/7 access to all choreography courses on your mobile, tablet, or laptop.',
        iconKey: 'clock'
      },
      {
        title: 'Lifetime Access',
        description: 'Enroll once and keep the course materials forever. Revisit routines whenever you need.',
        iconKey: 'shield'
      },
      {
        title: 'Mirror-View Breakdown',
        description: 'Video tutorials are filmed in mirror-view, making it incredibly simple to follow hand & feet movements.',
        iconKey: 'repeat'
      },
      {
        title: 'Self-Paced Controls',
        description: 'Speed up or slow down videos, loop sections, and progress entirely at your own comfort.',
        iconKey: 'sliders'
      },
      {
        title: 'Interactive Dashboard',
        description: 'Keep track of completed sections, watch lists, and unlock achievement certificates.',
        iconKey: 'check-circle'
      },
      {
        title: 'Expert Feedback Channel',
        description: 'Submit your practice videos inside the portal and get custom video reviews from trainers.',
        iconKey: 'message-square'
      }
    ],
    processTitle: 'Our Course Learning Process',
    processSubtitle: 'A structured, step-by-step approach to self-paced dance mastery',
    processSteps: [
      {
        num: '01',
        title: 'Browse Our Collection',
        description: 'Explore programs sorted by style (Bollywood, semi-classical, contemporary) and difficulty level.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '02',
        title: 'Enroll and Unlock',
        description: 'Complete a secure, one-time enrollment to gain lifetime access to all learning materials.',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '03',
        title: 'Count-by-Count HD Videos',
        description: 'Access high-definition, mirror-view step-by-step breakdowns led by certified instructors.',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '04',
        title: 'Flexible Practice Controls',
        description: 'Slow down play speeds (0.5x, 0.75x) to catch complex footwork, and loop repeat sections.',
        image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '05',
        title: 'Get Personal Feedback',
        description: 'Upload a short practice video through the community tab to get personalized corrections.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&h=500&q=80'
      },
      {
        num: '06',
        title: 'Claim Your Certificate',
        description: 'Complete all sections, showcase your final performance, and download your course completion award.',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=500&q=80'
      }
    ],
    faq: [
      { q: 'How long do I have access?', a: 'Lifetime access for all enrolled courses — learn at your own pace forever.' },
      { q: 'Can I download the videos?', a: 'Videos are stream-only to protect content, but you can watch offline via our app.' },
    ],
  },
  'pcod-wellness': {
    title: 'PCOD / PCOS Wellness',
    tagline: 'Dance-Led Hormonal Balance',
    description:
      'A specialised movement programme combining dance cardio, breath work and mindful movement to help women manage PCOD/PCOS symptoms naturally. Our approach is medically informed and led by certified wellness instructors.',
    features: [
      'Hormone-balancing dance cardio routines',
      'Stress-reduction & breath-work sessions',
      'Diet & lifestyle guidance',
      'Small group sessions for personalised attention',
      'Progress tracking with wellness milestones',
    ],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&h=700&q=85',
  },
  'thyroid-wellness': {
    title: 'Thyroid Wellness',
    tagline: 'Boost Metabolism Through Movement',
    description:
      'Designed to support thyroid health through targeted movement, breathing techniques and energy-boosting dance routines. Our instructors are trained to work with thyroid patients safely and effectively.',
    features: [
      'Metabolism-boosting movement sessions',
      'Energy-restoration exercises',
      'Guided breath work',
      'Low-impact safe routines',
    ],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&h=700&q=85',
  },
  'post-pregnancy-wellness': {
    title: 'Post Pregnancy Wellness',
    tagline: 'Safe Movement for New Mothers',
    description:
      'Rebuild strength, confidence and joy after childbirth with our carefully designed post-pregnancy dance and movement programme. Safe, gentle and led by trained instructors who specialise in postnatal recovery.',
    features: [
      'Safe postnatal movement routines',
      'Core strength rebuilding',
      'Mood-lifting dance sessions',
      'Expert instructor guidance',
    ],
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&h=700&q=85',
  },
  'zumba': {
    title: 'Zumba',
    tagline: 'Latin Cardio Dance | All Levels',
    description:
      'Get your heart pumping with our high-energy Zumba sessions. Combining Latin rhythms, easy-to-follow moves and non-stop music, Zumba is the workout that feels more like a party.',
    features: [
      'High-energy Latin cardio',
      'Beginner-friendly choreography',
      'Full-body workout disguised as fun',
      'Live & recorded sessions available',
    ],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&h=700&q=85',
  },
  'hiit': {
    title: 'HIIT Dance',
    tagline: 'High-Intensity | Short & Powerful',
    description:
      'High-intensity interval training meets dance cardio. Short bursts of intense movement combined with active recovery — the most time-efficient way to burn calories and build fitness.',
    features: [
      'Short 30–45 minute sessions',
      'Maximum calorie burn',
      'Strength & cardio combined',
      'No equipment needed',
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&h=700&q=85',
  },
  'yoga': {
    title: 'Yoga',
    tagline: 'Flexibility, Breath & Flow',
    description:
      'Restore balance to your body and mind with our guided yoga sessions. From gentle flow to power yoga, our classes are designed to improve flexibility, reduce stress and build inner strength.',
    features: [
      'Morning & evening batch options',
      'Gentle to power yoga levels',
      'Meditation & pranayama included',
      'Flexibility & posture improvement',
    ],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&h=700&q=85',
  },
};

// ──────────────────────────────────────────────────────────────
const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { appSettings: settings } = useSiteData();

  const service = slug ? SERVICE_DATA[slug] : null;

  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState<EnquiryFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; type: FormResultType; title: string; message: string }>({
    open: false, type: 'success', title: '', message: '',
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    setIsPlayingVideo(false);
  }, [slug]);

  // If slug not found → redirect to /services
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as keyof typeof form;
    const raw = e.target.value;
    // Sanitize on the fly (strips invalid chars)
    const sanitized = sanitizeEnquiryField(field as Parameters<typeof sanitizeEnquiryField>[0], raw);
    setForm((prev) => ({ ...prev, [field]: sanitized }));
    // Live validate once the user has typed something
    if (sanitized.length > 0) {
      const err = validateEnquiryField(field as Parameters<typeof validateEnquiryField>[0], sanitized);
      setFieldErrors((prev) => ({ ...prev, [field]: err }));
    } else {
      setFieldErrors((prev) => { const next = { ...prev }; delete next[field as keyof EnquiryFieldErrors]; return next; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Full form validation
    const errors = validateEnquiryForm(
      { name: form.name, phone: form.phone, email: form.email, message: form.message },
      { requireMessage: false },
    );
    setFieldErrors(errors);
    if (hasEnquiryErrors(errors)) return;
    setSubmitting(true);
    try {
      await submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim() || `Enquiry about ${service.title}`,
        subject: `Service enquiry: ${service.title}`,
        source: 'general',
      });
      setForm({ name: '', phone: '', email: '', message: '' });
      setFieldErrors({});
      setModal({ open: true, type: 'success', title: 'Enquiry sent!', message: 'We\'ll get back to you within 24 hours.' });
    } catch {
      setModal({ open: true, type: 'error', title: 'Could not send', message: 'Something went wrong. Please try WhatsApp.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO pageTitle={service.title} description={service.description} path={`/services/${slug}`} />
      <div className="services-page-wrapper svcd-container">
        
        {/* ================= 1. PREMIUM SPLIT HERO SECTION ================= */}
        <section className="svcd-hero-section">
          <div className="svcd-hero-overlay-grid" />
          <div className="container">
            <div className="svcd-hero-split-grid">
              
              {/* Left Column: Text & CTA */}
              <motion.div
                className="svcd-hero-content"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to="/services" className="svcd-back-link">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to Services
                </Link>
                <div className="svcd-hero-badge">
                  <span className="svcd-badge-text">GDP Premium Experience</span>
                </div>
                <h1 className="svcd-title">{service.title}</h1>
                <p className="svcd-subtitle">{service.tagline}</p>
                <a href="#enquire" className="svc-btn-glow svcd-hero-cta">
                  BOOK A CONSULTATION
                </a>
              </motion.div>

              {/* Right Column: Visual Frame */}
              <motion.div
                className="svcd-hero-showcase"
                initial={{ opacity: 0, scale: 0.9, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="svcd-showcase-glow" />
                <div className="svcd-showcase-frame">
                  {service.youtubeId && isPlayingVideo ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${service.youtubeId}?autoplay=1&rel=0`}
                      title={service.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="svcd-showcase-iframe"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full relative cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="svcd-showcase-img"
                      />
                      {service.youtubeId && (
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center hover:bg-black/25 transition-colors duration-300">
                          <div className="relative z-10 w-16 h-16 rounded-full bg-[#FF6A00] flex items-center justify-center text-white shadow-2xl transition-all duration-350 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-6 h-6 ml-1 fill-current" aria-hidden="true">
                              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path>
                            </svg>
                            <div className="absolute inset-0 rounded-full bg-[#FF6A00] blur-md -z-10"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ================= 1.5 STATS BANNER STRIP ================= */}
        {service.stats && service.stats.length > 0 && (
          <section className="svcd-stats-section">
            <div className="container">
              <div className="svcd-stats-grid">
                {service.stats.map((item, i) => (
                  <div key={i} className="svcd-stat-col">
                    <span className="svcd-stat-number">{item.value}</span>
                    <span className="svcd-stat-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================= 2. WHAT WE OFFER & BENTO GRID ================= */}
        <section className="svcd-overview-section section-padding">
          <div className="container">
            <div className="svcd-overview-grid">
              
              {/* Left Column: Description */}
              <div className="svcd-desc-col">
                <span className="svcd-section-badge">THE EXPERIENCE</span>
                <h2 className="svcd-section-title">
                  What We <span className="gradient-text">Offer</span>
                </h2>
                <p className="svcd-desc-text">{service.description}</p>
                
                {!service.whyUs && (
                  <div className="mt-8 flex flex-col gap-4">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#FF6A00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <span className="text-sm font-semibold text-zinc-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Bento Features / Advantages Grid */}
              <div className="svcd-bento-grid">
                {service.whyUs ? (
                  service.whyUs.map((feat, i) => (
                    <motion.div
                      key={i}
                      className="svcd-bento-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <div className="svcd-bento-card-glow" />
                      <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center shrink-0 mb-4">
                        {feat.iconKey === 'heart' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        )}
                        {feat.iconKey === 'video' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                        )}
                        {feat.iconKey === 'smile' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                        )}
                        {feat.iconKey === 'users' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        )}
                        {feat.iconKey === 'music' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                        )}
                        {feat.iconKey === 'globe' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        )}
                        {feat.iconKey === 'eye' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                        {feat.iconKey === 'clock' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        )}
                        {feat.iconKey === 'play' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        )}
                        {feat.iconKey === 'shield' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        )}
                        {feat.iconKey === 'repeat' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                        )}
                        {feat.iconKey === 'sliders' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>
                        )}
                        {feat.iconKey === 'check-circle' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        )}
                        {feat.iconKey === 'message-square' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        )}
                      </div>
                      <h4 className="font-bold text-base mb-2">{feat.title}</h4>
                      <p className="text-sm leading-relaxed text-zinc-400 font-medium">{feat.description}</p>
                    </motion.div>
                  ))
                ) : (
                  service.features.map((feat, i) => (
                    <motion.div
                      key={i}
                      className="svcd-bento-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <div className="svcd-bento-card-glow" />
                      <span className="svcd-bento-card-number">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h4>{feat}</h4>
                    </motion.div>
                  ))
                )}
              </div>

            </div>
          </div>
        </section>

        {/* ================= 3. ALTERNATING PROCESS SECTIONS ================= */}
        <section className="svcd-process-section section-padding">
          <div className="container">
            <div className="svcd-center-header">
              <span className="svcd-section-badge">THE METHODOLOGY</span>
              <h2 className="svcd-section-title">
                {service.processTitle || 'The Choreography Process'}
              </h2>
              <p className="svcd-section-desc">
                {service.processSubtitle || 'From song selection to the final stage dip, here is how we curate your magic step-by-step.'}
              </p>
            </div>

            <div className="svcd-alternating-rows">
              {service.processSteps ? (
                service.processSteps.map((step, i) => {
                  const isReverse = i % 2 !== 0;
                  return (
                    <div key={i} className={`svcd-process-row${isReverse ? ' reverse' : ''}`}>
                      <div className="svcd-process-text-col">
                        <div className="svcd-process-num">{step.num}</div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                      <div className="svcd-process-visual-col">
                        <div className="svcd-visual-container">
                          <img 
                            src={step.image} 
                            alt={step.title} 
                            className="svcd-process-img"
                          />
                          <div className="svcd-visual-glow" />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Alternating rows fallback
                <>
                  <div className="svcd-process-row">
                    <div className="svcd-process-text-col">
                      <div className="svcd-process-num">01</div>
                      <h3>Creative Discovery</h3>
                      <p>We discover your dance preferences, select themes, and curate the perfect custom music mix tailored to your vision.</p>
                    </div>
                    <div className="svcd-process-visual-col">
                      <div className="svcd-visual-container">
                        <img 
                          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&h=500&q=80" 
                          alt="Creative Discovery" 
                          className="svcd-process-img"
                        />
                        <div className="svcd-visual-glow" />
                      </div>
                    </div>
                  </div>

                  <div className="svcd-process-row reverse">
                    <div className="svcd-process-text-col">
                      <div className="svcd-process-num">02</div>
                      <h3>Custom Mixing & Edits</h3>
                      <p>Our in-house sound editors craft clean transitions, mashups, and audio tracks that sync beautifully with the routine.</p>
                    </div>
                    <div className="svcd-process-visual-col">
                      <div className="svcd-visual-container">
                        <img 
                          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&h=500&q=80" 
                          alt="Custom Mixing & Edits" 
                          className="svcd-process-img"
                        />
                        <div className="svcd-visual-glow" />
                      </div>
                    </div>
                  </div>

                  <div className="svcd-process-row">
                    <div className="svcd-process-text-col">
                      <div className="svcd-process-num">03</div>
                      <h3>Personalised Choreography</h3>
                      <p>Step-by-step custom dance tutorials built around your comfort and skill level, ensuring absolute beginners look elegant.</p>
                    </div>
                    <div className="svcd-process-visual-col">
                      <div className="svcd-visual-container">
                        <img 
                          src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=500&q=80" 
                          alt="Personalised Choreography" 
                          className="svcd-process-img"
                        />
                        <div className="svcd-visual-glow" />
                      </div>
                    </div>
                  </div>

                  <div className="svcd-process-row reverse">
                    <div className="svcd-process-text-col">
                      <div className="svcd-process-num">04</div>
                      <h3>Rehearsals & Polish</h3>
                      <p>Intensive Zoom sessions or studio checkins with personal video feedback and body-groove corrections for maximum stage confidence.</p>
                    </div>
                    <div className="svcd-process-visual-col">
                      <div className="svcd-visual-container">
                        <img 
                          src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&h=500&q=80" 
                          alt="Rehearsals & Polish" 
                          className="svcd-process-img"
                        />
                        <div className="svcd-visual-glow" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ================= 4. PREMIUM BOOKING / INQUIRY SECTION ================= */}
        <section id="enquire" className="svcd-booking-section section-padding">
          <div className="container">
            <div className="svcd-booking-grid">
              
              {/* Left Column: Heading & WhatsApp */}
              <div className="svcd-booking-info">
                <span className="svcd-section-badge">RESERVE BATCH</span>
                <h2 className="svcd-section-title">
                  Let's Create <br />
                  <span className="gradient-text">Your Magic</span>
                </h2>
                <p className="svcd-booking-desc">
                  Have questions or want a customized quote? Send us an inquiry or connect with our support team directly via WhatsApp for a quick response.
                </p>

                <a
                  href={buildWhatsAppUrl(settings?.whatsappNumber || '7838416907')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="svcd-whatsapp-btn"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat with us on WhatsApp
                </a>
              </div>

              {/* Right Column: Form Card */}
              <motion.div
                className="svcd-form-card"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="svcd-form-glow" />
                <h3>Enquire about {service.title}</h3>
                <form className="svcd-form" onSubmit={handleSubmit} noValidate>
                  <div className="svcd-field-wrap">
                    <input
                      type="text" name="name" placeholder="Full Name *"
                      className={`svcd-input${fieldErrors.name ? ' svcd-input-error' : ''}`}
                      value={form.name} onChange={handleChange}
                      maxLength={60} autoComplete="name"
                    />
                    {fieldErrors.name && <span className="svcd-field-error">{fieldErrors.name}</span>}
                  </div>
                  <div className="svcd-field-wrap">
                    <input
                      type="tel" name="phone" placeholder="10-digit mobile number *" inputMode="numeric"
                      className={`svcd-input${fieldErrors.phone ? ' svcd-input-error' : ''}`}
                      value={form.phone} onChange={handleChange}
                      maxLength={10} autoComplete="tel"
                    />
                    {fieldErrors.phone && <span className="svcd-field-error">{fieldErrors.phone}</span>}
                  </div>
                  <div className="svcd-field-wrap">
                    <input
                      type="email" name="email" placeholder="Email ID"
                      className={`svcd-input${fieldErrors.email ? ' svcd-input-error' : ''}`}
                      value={form.email} onChange={handleChange}
                      maxLength={100} autoComplete="email"
                    />
                    {fieldErrors.email && <span className="svcd-field-error">{fieldErrors.email}</span>}
                  </div>
                  <div className="svcd-field-wrap">
                    <textarea
                      name="message" placeholder={`Tell us more about your ${service.title} requirements`}
                      className={`svcd-input svcd-textarea${fieldErrors.message ? ' svcd-input-error' : ''}`}
                      value={form.message} onChange={handleChange}
                      maxLength={500}
                    />
                    {fieldErrors.message && <span className="svcd-field-error">{fieldErrors.message}</span>}
                  </div>
                  <button type="submit" className="svcd-submit-btn" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Enquiry'}
                  </button>
                </form>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ================= 5. COMMON QUESTIONS / FAQS ================= */}
        {service.faq && service.faq.length > 0 && (
          <section className="svcd-faq-section section-padding">
            <div className="container">
              <div className="svcd-center-header">
                <span className="svcd-section-badge">FAQ</span>
                <h2 className="svcd-section-title">
                  Common <span className="gradient-text">Questions</span>
                </h2>
              </div>
              
              <div className="faq-v3-list" style={{ maxWidth: 760, margin: '0 auto' }}>
                {service.faq.map((item, i) => (
                  <div key={i} className={`faq-v3-item${openFaq === i ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="faq-v3-question"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="faq-v3-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="faq-v3-q">{item.q}</span>
                      <span className="faq-v3-icon">{openFaq === i ? '−' : '+'}</span>
                    </button>
                    <div className="faq-v3-answer">
                      <div className="faq-v3-answer-inner"><p>{item.a}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================= 6. BOTTOM CTA SECTION ================= */}
        <section className="svc-final-cta">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="svc-final-cta-title">EXPLORE MORE CHOREOGRAPHY</h2>
              <Link to="/services" className="svc-btn-glow svcd-final-cta-btn">
                VIEW ALL SERVICES
              </Link>
            </motion.div>
          </div>
        </section>

      </div>

      <FormResultModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
      />
    </Layout>
  );
};

export default ServiceDetail;
