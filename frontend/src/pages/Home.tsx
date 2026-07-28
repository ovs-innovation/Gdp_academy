import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { getFAQs, getPageContentBySlug, type CMSContent } from '../services/cmsService';
import { useSiteData } from '../contexts/SiteDataContext';
import { submitEnquiry } from '../services/enquiryService';
import { getFeaturedTestimonials, type Testimonial } from '../services/testimonialService';
import { getLocalizedValue } from '../utils/contentHelper';

import LazyImage from '../components/common/LazyImage';
import LazySection from '../components/common/LazySection';
import FormResultModal, { type FormResultType } from '../components/common/FormResultModal';
import Hero from '../components/homes/home-one/Hero';
import YouTubeShortsSection from '../components/home/YouTubeShortsSection';
import InstagramReelsSection from '../components/home/InstagramReelsSection';
import HomeStatsBar from '../components/home/HomeStatsBar';
import ReviewsSection from '../components/home/ReviewsSection';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import HomeMediaMarquee from '../components/home/HomeMediaMarquee';
import {
  HomeFaqSkeleton,
  HomeReviewsSkeleton,
  HomeServicesSkeleton,
} from '../components/home/HomeSkeletons';

import { invalidateCache } from '../lib/apiCache';
import {
  DEFAULT_YOUTUBE_CHANNEL_URL,
  resolveYoutubeChannelUrl,
} from '../utils/socialLinks';
import SEO from '../components/SEO';
import '../styles/home.css';
import { normalizeHomeContent } from '../lib/homeCms';
import { DEFAULT_SERVICES, HOME_SERVICE_IMAGE_BY_KEY, isExcludedService } from '../lib/defaultServices';
import { getServiceIcon } from '../components/home/ServiceIcons';
import {
  type EnquiryField,
  type EnquiryFieldErrors,
  hasEnquiryErrors,
  validateEnquiryField,
  validateEnquiryForm,
  sanitizeEnquiryField,
} from '../utils/enquiryValidation';

interface HomeContent {
  aboutShortTitle: string;
  aboutShortText: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

const DEFAULT_HOME_CONTENT: HomeContent = {
  aboutShortTitle: "Dance with Grace and Power",
  aboutShortText: "Garima Dance Production has been a pioneer in creating transformative dance experiences. We nurture beginner students into elegant performers and support seasoned artists in refining their technique through standard classical and modern fusion modules."
};

const DEFAULT_FAQS = [
  { question: "Are online services available?", answer: "Yes, we specialize in high-quality live interactive Zoom classes and have a fully loaded pre-recorded video choreography library accessible 24/7." },
  { question: "What levels do you cater to?", answer: "We provide comprehensive dance training across various styles including classical, contemporary, and urban for all experience levels, from absolute beginners to professional performers." },
  { question: "How can I join the studio?", answer: "You can easily join our sessions by clicking the 'Join Studio' button, choosing a membership plan, or contacting us via WhatsApp directly." }
];

/** Curated images for homepage service cards (verified working URLs) */
const HOME_SERVICE_IMAGES = {
  regular:
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&h=700&q=80',
  fitness:
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&h=700&q=80',
  wedding:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&h=700&q=80',
  custom:
    'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=900&h=700&q=80',
} as const;

const HOME_SERVICE_IMAGE_LIST = [
  HOME_SERVICE_IMAGES.regular,
  HOME_SERVICE_IMAGES.fitness,
  HOME_SERVICE_IMAGES.wedding,
  HOME_SERVICE_IMAGES.custom,
] as const;

const DEFAULT_YOUTUBE_CHANNEL = '@garimadanceproductions1146';
// ─── Static YouTube Shorts (real IDs hardcoded) ───────────────────────────
const STATIC_YOUTUBE_SHORTS = [
  { vid: '', ytId: 't_U6KbVqRDg', title: 'Power Hip-Hop Dance Routine', views: '12K', likes: '1.2K', delay: 0 },
  { vid: '', ytId: 'xnvhC3obxHg', title: 'Energetic Stage Performance', views: '25K', likes: '2.4K', delay: 0.1 },
  { vid: '', ytId: 'OMr8rMSe_GQ', title: 'Classical Fusion Masterclass', views: '18K', likes: '1.9K', delay: 0.2 },
  { vid: '', ytId: 'wiDo4xWDrdY', title: 'Wedding Choreography Showcase', views: '32K', likes: '3.1K', delay: 0.3 },
  { vid: '', ytId: 'N_M1J_wgKcI', title: 'Contemporary Flow & Expression', views: '15K', likes: '1.5K', delay: 0.4 },
  { vid: '', ytId: 'IyyCJjf8iqM', title: 'Bollywood Beats Group Routine', views: '28K', likes: '2.6K', delay: 0.5 },
  { vid: '', ytId: 't_7IgCxN3kc', title: 'Street Jam Freestyle Sessions', views: '10K', likes: '980', delay: 0.6 },
  { vid: '', ytId: 'ziBaK1q7L2Q', title: 'Garima Dance Workshop Special', views: '45K', likes: '4.2K', delay: 0.7 },
  { vid: '', ytId: 't_U6KbVqRDg', title: 'Power Hip-Hop Dance Routine', views: '12K', likes: '1.2K', delay: 0.8 },
  { vid: '', ytId: 'xnvhC3obxHg', title: 'Energetic Stage Performance', views: '25K', likes: '2.4K', delay: 0.9 },
];

// ─── Static Instagram Reels (real IDs hardcoded) ──────────────────────────
const STATIC_INSTAGRAM_REELS = [
  { vid: '', reelId: 'DadAKWthgEB', url: 'https://www.instagram.com/reel/DadAKWthgEB/', delay: 0, offset: '0', likes: '', comments: '' },
  { vid: '', reelId: 'DX4zIElTyh9', url: 'https://www.instagram.com/reel/DX4zIElTyh9/', delay: 0.1, offset: '-20px', likes: '', comments: '' },
  { vid: '', reelId: 'DXB8VV3CbLc', url: 'https://www.instagram.com/reel/DXB8VV3CbLc/', delay: 0.2, offset: '20px', likes: '', comments: '' },
  { vid: '', reelId: 'DVBQlWyCeqY', url: 'https://www.instagram.com/reel/DVBQlWyCeqY/', delay: 0.3, offset: '-10px', likes: '', comments: '' },
  { vid: '', reelId: 'CqPTAdduo6m', url: 'https://www.instagram.com/reel/CqPTAdduo6m/', delay: 0.4, offset: '10px', likes: '', comments: '' },
  { vid: '', reelId: 'CpfgqWbNvUo', url: 'https://www.instagram.com/reel/CpfgqWbNvUo/', delay: 0.5, offset: '-30px', likes: '', comments: '' },
  { vid: '', reelId: 'CtayfVrJ174', url: 'https://www.instagram.com/reel/CtayfVrJ174/', delay: 0.6, offset: '30px', likes: '', comments: '' },
  { vid: '', reelId: 'DadAKWthgEB', url: 'https://www.instagram.com/reel/DadAKWthgEB/', delay: 0.7, offset: '-15px', likes: '', comments: '' },
  { vid: '', reelId: 'DX4zIElTyh9', url: 'https://www.instagram.com/reel/DX4zIElTyh9/', delay: 0.8, offset: '15px', likes: '', comments: '' },
  { vid: '', reelId: 'DXB8VV3CbLc', url: 'https://www.instagram.com/reel/DXB8VV3CbLc/', delay: 0.9, offset: '-5px', likes: '', comments: '' },
];


const DEFAULT_VIDEO_TESTIMONIALS = [
  { id: 1, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80', vid: 'https://www.youtube.com/embed/2iM5RoR0khg' },
  { id: 2, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80', vid: 'https://www.youtube.com/embed/3PQOq9pMMl4' },
  { id: 3, img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80', vid: 'https://www.youtube.com/embed/IIgDyLDnGK8' },
  { id: 4, img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80', vid: 'https://www.youtube.com/embed/IC7_5UXBQvE' },
];

const DEFAULT_ABOUT_YOUTUBE_ID = 'J-yM5y4Kd04';
const DEFAULT_HERO_YOUTUBE_ID = '1phsCpxcBZU';

const DEFAULT_TESTIMONIALS_SUBTITLE =
  'Real stories from students, couples & performers who learned, celebrated & grew with GDP.';

type GoogleReviewCard = {
  name: string;
  position: string;
  message: string;
  image: string;
  rating: number;
  headline?: string;
};

const DEFAULT_GOOGLE_REVIEWS: GoogleReviewCard[] = [
  {
    name: 'Gauri S.',
    position: 'Wedding Choreography',
    headline: 'Wonderful experience',
    message:
      'We had a wonderful experience with Garima Dance Productions. They were patient and professional, and created choreography that suited our comfort level while still looking elegant and impressive.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Mona G.',
    position: 'Online Dance Classes',
    headline: 'So much confidence',
    message:
      'As a beginner, I am learning a lot and gaining confidence. The instructors are patient, energetic, and always willing to give feedback on your moves during class.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Pinke C.',
    position: 'Pre-recorded Courses',
    headline: 'Highly recommend',
    message:
      'I can easily join from anywhere, which makes training so convenient. Overall it has been a positive experience — I highly recommend GDP!',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80',
    rating: 5,
  },
];

const resolveHomeServiceImage = (
  opts: { key?: string; title?: string; cmsImage?: string },
  index: number,
): string => {
  const cms = opts.cmsImage?.trim();
  if (
    cms &&
    (cms.startsWith('http') || cms.includes('cloudinary') || cms.includes('/uploads/')) &&
    !cms.includes('/svc-')
  ) {
    return cms;
  }

  const key = (opts.key || '').toLowerCase();
  if (key && HOME_SERVICE_IMAGE_BY_KEY[key]) {
    return HOME_SERVICE_IMAGE_BY_KEY[key];
  }

  const title = (opts.title || '').toLowerCase();
  if (title.includes('wedding')) return HOME_SERVICE_IMAGES.wedding;
  if (title.includes('online') || title.includes('zoom')) return HOME_SERVICE_IMAGES.regular;
  if (title.includes('pre-recorded') || title.includes('recorded')) return HOME_SERVICE_IMAGES.fitness;
  if (title.includes('kids') || title.includes('teen')) return HOME_SERVICE_IMAGES.custom;
  if (title.includes('fitness') || title.includes('combo')) return HOME_SERVICE_IMAGES.fitness;
  if (title.includes('custom')) return HOME_SERVICE_IMAGES.custom;
  if (title.includes('regular') || title.includes('dance session')) return HOME_SERVICE_IMAGES.regular;

  return HOME_SERVICE_IMAGE_LIST[index % HOME_SERVICE_IMAGE_LIST.length];
};

const mapCmsServiceToHomeCard = (svc: CMSContent, index: number) => {
  const features = Array.isArray(svc.content?.features)
    ? svc.content.features
    : (typeof svc.content?.features === 'string'
        ? svc.content.features.split(',').map((f: string) => f.trim())
        : []);

  return {
    _id: svc._id,
    key: svc.key,
    title: getLocalizedValue(svc.title, ''),
    image: resolveHomeServiceImage(
      {
        key: svc.key,
        title: getLocalizedValue(svc.title, ''),
        cmsImage: svc.images?.[0]?.url,
      },
      index,
    ),
    tagline: svc.content?.tagline || 'All Levels | Expert Guided',
    mainTitle: getLocalizedValue(svc.description, '').split('.')[0] || 'Unleash your creative potential',
    features: features.length > 0 ? features : ['Personalised training plans', 'Expert choreography guidance', 'Showcase opportunities'],
  };
};

const buildHomeServices = (
  cmsServices: CMSContent[],
  defaults: ReturnType<typeof mapCmsServiceToHomeCard>[],
) => {
  const filteredDefaults = defaults.filter(
    (s) => !isExcludedService({ key: s.key, title: s.title }),
  );

  if (!cmsServices?.length) return filteredDefaults;

  const mapped = cmsServices
    .map(mapCmsServiceToHomeCard)
    .filter((s) => !isExcludedService({ key: s.key, title: s.title }));

  if (mapped.length >= 3) return mapped.slice(0, 3);

  const usedTitles = new Set(mapped.map((s) => s.title.toLowerCase()));
  const fillers = filteredDefaults.filter((d) => !usedTitles.has(d.title.toLowerCase()));
  return [...mapped, ...fillers].slice(0, 3);
};

const Home: React.FC = () => {
  useScrollToHash();
  const { appSettings: settings, servicesCms, ready: siteDataReady } = useSiteData();
  const [homeContent, setHomeContent] = useState<any>(DEFAULT_HOME_CONTENT);
  const [cmsServices, setCmsServices] = useState<CMSContent[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<Testimonial[]>([]);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', email: '', message: '', whatsappConsent: false });
  const [enquiryErrors, setEnquiryErrors] = useState<EnquiryFieldErrors>({});
  const [isEnquirySubmitting, setIsEnquirySubmitting] = useState(false);
  const [sectionReady, setSectionReady] = useState({
    home: false,
    settings: true,
    services: true,
    faqs: true,
    testimonials: true,
  });
  const [formModal, setFormModal] = useState<{
    open: boolean;
    type: FormResultType;
    title: string;
    message: string;
  }>({ open: false, type: 'success', title: '', message: '' });

  // Track the currently active playing video (YouTube short or Instagram reel)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const showFormModal = (type: FormResultType, title: string, message: string) => {
    setFormModal({ open: true, type, title, message });
  };

  const homeCopyReady = sectionReady.home && sectionReady.settings;

  useEffect(() => {
    if (siteDataReady) {
      setSectionReady((s) => ({ ...s, settings: true }));
    }
  }, [siteDataReady]);

  useEffect(() => {
    if (servicesCms.length > 0) {
      setCmsServices(servicesCms);
    }
    if (siteDataReady) {
      setSectionReady((s) => ({ ...s, services: true }));
    }
  }, [servicesCms, siteDataReady]);

  useEffect(() => {
    // Bust in-memory API cache on every mount so DB changes always load fresh
    invalidateCache();

    getFeaturedTestimonials(6)
      .then((data) => {
        if (data && data.length > 0) {
          setFeaturedTestimonials(data);
        }
      })
      .catch(() => {})
      .finally(() => setSectionReady((s) => ({ ...s, testimonials: true })));

    getPageContentBySlug('home')
      .then((page) => {
        if (page && page.content) {
          setHomeContent(normalizeHomeContent(page.content));
        }
      })
      .catch(() => setHomeContent(DEFAULT_HOME_CONTENT))
      .finally(() => setSectionReady((s) => ({ ...s, home: true })));

    getFAQs()
      .then((data) => {
        if (data && data.length > 0) {
          setFaqs(data);
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      })
      .catch(() => setFaqs(DEFAULT_FAQS))
      .finally(() => setSectionReady((s) => ({ ...s, faqs: true })));
  }, []);

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' && 'checked' in e.target ? e.target.checked : false;
    const fieldName = name as EnquiryField | 'whatsappConsent';

    if (fieldName === 'whatsappConsent') {
      setEnquiryForm((prev) => ({ ...prev, whatsappConsent: checked }));
      return;
    }

    const sanitized = sanitizeEnquiryField(fieldName, value);
    setEnquiryForm((prev) => ({
      ...prev,
      [name]: sanitized,
    }));

    setEnquiryErrors((prev) => {
      if (!prev[fieldName]) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  const handleEnquiryBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    requireMessage = false,
  ) => {
    const field = e.target.name as EnquiryField;
    const error = validateEnquiryField(field, e.target.value, { requireMessage });
    setEnquiryErrors((prev) => {
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  const handleCatchUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateEnquiryForm(enquiryForm);
    if (hasEnquiryErrors(errors)) {
      setEnquiryErrors(errors);
      showFormModal('error', 'Almost there', 'Please fix the highlighted fields and try again.');
      return;
    }

    setIsEnquirySubmitting(true);
    try {
      await submitEnquiry({
        name: enquiryForm.name.trim(),
        phone: enquiryForm.phone.trim(),
        email: enquiryForm.email.trim(),
        message:
          enquiryForm.message?.trim() ||
          `Homepage Let's Catch up enquiry. WhatsApp consent: ${enquiryForm.whatsappConsent ? 'Yes' : 'No'}`,
        subject: "Homepage Let's Catch up",
        whatsappConsent: enquiryForm.whatsappConsent,
        source: 'contact_form',
      });
      setEnquiryForm({ name: '', phone: '', email: '', message: '', whatsappConsent: false });
      setEnquiryErrors({});
      showFormModal(
        'success',
        'Message sent!',
        'Thank you for reaching out. Our team will contact you within 24–48 hours.',
      );
    } catch (err: any) {
      showFormModal('error', 'Could not send', err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsEnquirySubmitting(false);
    }
  };

  const handleServiceEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const errors = validateEnquiryForm(enquiryForm, { requireMessage: true });
    if (hasEnquiryErrors(errors)) {
      setEnquiryErrors(errors);
      showFormModal('error', 'Almost there', 'Please fill in all required fields correctly.');
      return;
    }

    setIsEnquirySubmitting(true);
    try {
      await submitEnquiry({
        name: enquiryForm.name.trim(),
        phone: enquiryForm.phone.trim(),
        email: enquiryForm.email.trim(),
        message:
          enquiryForm.message?.trim() ||
          `Enquiry about ${selectedService.title} from homepage services section`,
        subject: `Service enquiry: ${selectedService.title}`,
        whatsappConsent: enquiryForm.whatsappConsent,
        source: 'general',
      });
      setEnquiryForm({ name: '', phone: '', email: '', message: '', whatsappConsent: false });
      setEnquiryErrors({});
      setSelectedService(null);
      showFormModal(
        'success',
        'Enquiry sent!',
        'We received your details and will get back to you soon.',
      );
    } catch (err: any) {
      showFormModal('error', 'Could not send', err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsEnquirySubmitting(false);
    }
  };

  const renderEnquiryFieldError = (field: EnquiryField) =>
    enquiryErrors[field] ? (
      <p className="enquiry-field-error" role="alert">
        {enquiryErrors[field]}
      </p>
    ) : null;

  const defaultServices = DEFAULT_SERVICES.map((service, index) => ({
    _id: service._id,
    key: service.key,
    title: service.title,
    image: service.imageUrl,
    active: index === 0,
    tagline: service.tagline,
    mainTitle: service.description.split('.')[0] || service.title,
    features: service.features,
  }));

  // Static YouTube Shorts — directly use real IDs, no DB needed
  const youtubeShorts = STATIC_YOUTUBE_SHORTS;

  const youtubeChannel = homeContent.youtubeChannel || DEFAULT_YOUTUBE_CHANNEL;
  const youtubeChannelUrl = resolveYoutubeChannelUrl(
    homeContent.youtubeChannelUrl as string | undefined,
    DEFAULT_YOUTUBE_CHANNEL_URL,
  );

  // Static Instagram Reels — directly use real IDs, no DB needed
  const instagramPosts = STATIC_INSTAGRAM_REELS;

  const instagramHandle = homeContent.instagramHandle || '@GarimadanceProductions';

  const aboutYoutubeId = homeContent.aboutYoutubeId || DEFAULT_ABOUT_YOUTUBE_ID;
  const heroYoutubeId = homeContent.heroYoutubeId || DEFAULT_HERO_YOUTUBE_ID;

  const videoTestimonials = homeCopyReady
    ? homeContent.videoTestimonials?.length > 0
      ? homeContent.videoTestimonials
      : DEFAULT_VIDEO_TESTIMONIALS
    : [];

  const testimonialsSubtitle =
    homeContent.testimonialsSubtitle || DEFAULT_TESTIMONIALS_SUBTITLE;
  const googleRating = homeContent.googleRating ?? '5.0';
  const googleReviewCount = homeContent.googleReviewCount ?? '(236)';

  const mapTestimonialToReview = (t: Testimonial, i: number): GoogleReviewCard => ({
    name: t.name,
    position: t.position || 'GDP Student',
    message: getLocalizedValue(t.message, ''),
    image: t.image || `https://i.pravatar.cc/150?u=${i + 10}`,
    rating: t.rating || 5,
  });

  const googleReviewCards: GoogleReviewCard[] = (() => {
    if (!sectionReady.testimonials) return [];
    if (featuredTestimonials.length === 0) return DEFAULT_GOOGLE_REVIEWS;
    const mapped = featuredTestimonials.slice(0, 5).map(mapTestimonialToReview);
    while (mapped.length < 3) {
      mapped.push(DEFAULT_GOOGLE_REVIEWS[mapped.length]);
    }
    return mapped;
  })();

  const servicesToRender = sectionReady.services
    ? buildHomeServices(cmsServices, defaultServices)
    : [];

  const [isMuted, setIsMuted] = useState(true);
  const [aboutSectionVisible, setAboutSectionVisible] = useState(false);
  const playerRef = useRef<any>(null);

  // WhatsApp float: only visible between services section and catch-up section
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const catchUpSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const srv = servicesSectionRef.current;
      const ctc = catchUpSectionRef.current;
      if (!srv || !ctc) return;
      const scrollY = window.scrollY + window.innerHeight / 2;
      const srvBottom = srv.getBoundingClientRect().bottom + window.scrollY;
      const ctcTop = ctc.getBoundingClientRect().top + window.scrollY;
      setShowWhatsApp(scrollY >= srvBottom && scrollY <= ctcTop + 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!homeCopyReady) return;

    // Load YouTube API
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      // About Player — only when section scrolls into view
      if (
        aboutSectionVisible &&
        document.getElementById('about-video-player') &&
        !(document.getElementById('about-video-player') as HTMLElement)?.dataset?.ytReady
      ) {
        new (window as any).YT.Player('about-video-player', {
          videoId: aboutYoutubeId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: aboutYoutubeId,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            origin: window.location.origin,
            vq: 'hd1080'
          },
          events: {
            onReady: (event: any) => {
              const el = document.getElementById('about-video-player');
              if (el) el.dataset.ytReady = '1';
              playerRef.current = event.target;
              event.target.playVideo();
            }
          }
        });
      }

      // Hero Player
      if (document.getElementById('hero-video-player') && !(document.getElementById('hero-video-player') as HTMLElement)?.dataset?.ytReady) {
        new (window as any).YT.Player('hero-video-player', {
          videoId: heroYoutubeId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: heroYoutubeId,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            origin: window.location.origin,
            vq: 'hd1080'
          },
          events: {
            onReady: (event: any) => {
              const el = document.getElementById('hero-video-player');
              if (el) el.dataset.ytReady = '1';
              event.target.playVideo();
              setInterval(() => {
                if (event.target.getCurrentTime() >= 42) {
                  event.target.seekTo(0);
                }
              }, 200);
            }
          }
        });
      }
    };

    (window as any).onYouTubeIframeAPIReady = initPlayer;

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    }
  }, [homeCopyReady, aboutYoutubeId, heroYoutubeId, aboutSectionVisible]);

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
      <SEO
        pageTitle="Home"
        description="Garima Dance Productions — dance classes, workshops, live Zoom sessions, and performance training in Ghaziabad and online."
        path="/"
      />
      {/* 1. Hero Section */}
      <Hero settings={settings} homeContent={homeContent} contentReady={homeCopyReady} />

      <HomeStatsBar stats={homeCopyReady ? homeContent.homeStats : undefined} />

      {/* 2. Services Section */}
      <section className="services-section section-padding" ref={servicesSectionRef}>
        <div className="container">
          <div className="services-section-header">
            {!homeCopyReady ? (
              <>
                <div className="home-skel" style={{ height: 36, width: 180, margin: '0 auto 12px' }} />
                <div className="home-skel" style={{ height: 16, width: '70%', maxWidth: 420, margin: '0 auto' }} />
              </>
            ) : (
              <>
                <h2 className="section-title">{homeContent.servicesTitle || settings?.servicesTitle || 'Services'}</h2>
                <p className="section-desc">{homeContent.servicesSubtitle || settings?.servicesSubtitle || 'Experience the ultimate dance training ecosystem.'}</p>
              </>
            )}
          </div>
          {!sectionReady.services ? (
            <HomeServicesSkeleton />
          ) : (
          <HomeMediaMarquee
            layout="services"
            ariaLabel="Services"
            items={servicesToRender}
            renderItem={(service, index) => (
              <Link
                key={service._id || service.key || index}
                to={`/services/${service.key}`}
                className="service-card-link"
              >
                <motion.div
                  className="service-card-v2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8 }}
                  viewport={{ once: true }}
                >
                  <div className="service-card-img">
                    <LazyImage
                      src={service.image}
                      className="service-video"
                      alt={service.title}
                      rootMargin="300px"
                      onError={(e) => {
                        const img = e.currentTarget;
                        const fallback = HOME_SERVICE_IMAGE_LIST[index % HOME_SERVICE_IMAGE_LIST.length];
                        if (img.src !== fallback) img.src = fallback;
                      }}
                    />
                    <div className="img-overlay" />
                  </div>
                  <div className="service-card-footer">
                    <span className="service-card-icon" aria-hidden="true">
                      {getServiceIcon({ key: service.key, title: service.title })}
                    </span>
                    <h3>{service.title}</h3>
                  </div>
                </motion.div>
              </Link>
            )}
          />
          )}
          <div className="services-explore-wrap">
            <Link to="/services" className="services-explore-btn">
              Explore All Services
              <span aria-hidden="true">→</span>
            </Link>
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

                  <div style={{ marginTop: '25px', marginBottom: '25px' }}>
                    <Link 
                      to="/services" 
                      className="primary-btn" 
                      style={{ 
                        textDecoration: 'none', 
                        background: 'transparent', 
                        border: '1px solid #634BFA', 
                        color: '#634BFA', 
                        display: 'inline-flex', 
                        padding: '12px 24px', 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        borderRadius: '4px', 
                        letterSpacing: '1px', 
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 10px rgba(99, 75, 250, 0.1)'
                      }}
                      onClick={() => setSelectedService(null)}
                    >
                      EXPLORE FULL PROGRAM DETAILS →
                    </Link>
                  </div>

                  <div className="modal-gallery-preview">
                    <p className="gallery-label">Check out our Gallery</p>
                    <div className="gallery-thumbs">
                      <LazyImage src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80" alt="G1" />
                      <LazyImage src="https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80" alt="G2" />
                      <LazyImage src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80" alt="G3" />
                    </div>
                  </div>
                </div>

                <div className="modal-right">
                  <div className="contact-form-box">
                    <h3>Let us reach you!</h3>
                    <form className="modal-form" onSubmit={handleServiceEnquirySubmit} noValidate>
                      <div className="input-group">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={enquiryForm.name}
                          onChange={handleEnquiryChange}
                          onBlur={(e) => handleEnquiryBlur(e, true)}
                          className={enquiryErrors.name ? 'has-error' : ''}
                          maxLength={60}
                          autoComplete="name"
                        />
                        {renderEnquiryFieldError('name')}
                      </div>
                      <div className="input-group">
                        <input
                          type="tel"
                          name="phone"
                          inputMode="numeric"
                          placeholder="10-digit mobile number"
                          value={enquiryForm.phone}
                          onChange={handleEnquiryChange}
                          onBlur={(e) => handleEnquiryBlur(e, true)}
                          className={enquiryErrors.phone ? 'has-error' : ''}
                          maxLength={10}
                          autoComplete="tel"
                        />
                        {renderEnquiryFieldError('phone')}
                      </div>
                      <div className="input-group">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email ID"
                          value={enquiryForm.email}
                          onChange={handleEnquiryChange}
                          onBlur={(e) => handleEnquiryBlur(e, true)}
                          className={enquiryErrors.email ? 'has-error' : ''}
                          maxLength={100}
                          autoComplete="email"
                        />
                        {renderEnquiryFieldError('email')}
                      </div>
                      <div className="input-group">
                        <textarea
                          name="message"
                          placeholder="Your Message"
                          value={enquiryForm.message}
                          onChange={handleEnquiryChange}
                          onBlur={(e) => handleEnquiryBlur(e, true)}
                          className={enquiryErrors.message ? 'has-error' : ''}
                          maxLength={500}
                        />
                        {renderEnquiryFieldError('message')}
                      </div>
                      <div className="checkbox-group">
                        <input
                          type="checkbox"
                          id="wa-consent-modal"
                          name="whatsappConsent"
                          checked={enquiryForm.whatsappConsent}
                          onChange={handleEnquiryChange}
                        />
                        <label htmlFor="wa-consent-modal">agree to receive messages on WhatsApp</label>
                      </div>
                      <button type="submit" className="primary-btn submit-modal-btn" disabled={isEnquirySubmitting}>
                        {isEnquirySubmitting ? 'Sending…' : 'Send details'}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      <LazySection minHeight={520} rootMargin="400px">
      <YouTubeShortsSection
        shorts={youtubeShorts}
        channel={youtubeChannel}
        channelUrl={youtubeChannelUrl}
        channelId={homeContent.youtubeChannelId as string | undefined}
        logoUrl={settings?.logoUrl}
        loading={!homeCopyReady}
        activeVideoId={activeVideoId}
        setActiveVideoId={setActiveVideoId}
      />
      </LazySection>

      {/* 3. About Section */}
      <LazySection minHeight={480} rootMargin="400px" onVisible={() => setAboutSectionVisible(true)}>
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
              {!homeCopyReady ? (
                <>
                  <div className="home-skel" style={{ height: 32, width: '80%', marginBottom: 16 }} />
                  <div className="home-skel" style={{ height: 14, width: '100%', marginBottom: 8 }} />
                  <div className="home-skel" style={{ height: 14, width: '92%', marginBottom: 8 }} />
                  <div className="home-skel" style={{ height: 14, width: '70%', marginBottom: 20 }} />
                </>
              ) : (
                <>
                  <h2 className="section-title" style={{ textTransform: 'uppercase' }}>
                    {homeContent.aboutShortTitle}
                  </h2>
                  <p>
                    {homeContent.aboutShortText}
                  </p>
                </>
              )}
              <Link to="/about" className="secondary-btn glass-btn" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
                DISCOVER OUR LEGACY
              </Link>
            </div>
          </div>
        </div>
      </section>
      </LazySection>

      <LazySection minHeight={520} rootMargin="400px">
      <InstagramReelsSection
        reels={instagramPosts}
        handle={instagramHandle}
        activeVideoId={activeVideoId}
        setActiveVideoId={setActiveVideoId}
      />
      </LazySection>
      <LazySection minHeight={560} rootMargin="400px">
      {!sectionReady.testimonials || !homeCopyReady ? (
        <section className="reviews-v3 section-padding" id="reviews">
          <div className="container">
            <div className="services-section-header">
              <h2 className="section-title"><span className="gradient-text">Reviews</span></h2>
            </div>
            <HomeReviewsSkeleton />
          </div>
        </section>
      ) : (
      <ReviewsSection
        badgeText={homeContent.reviewsBadge || 'Our Community'}
        titlePrefix={homeContent.reviewsTitlePrefix || 'From Our'}
        titleHighlight={homeContent.reviewsSectionTitle || 'Clients'}
        subtitle={testimonialsSubtitle}
        googleRating={googleRating}
        googleReviewCount={googleReviewCount}
        reviews={googleReviewCards}
        videoTestimonials={videoTestimonials}
      />
      )}
      </LazySection>

      {/* 10. FAQ Section */}
      <LazySection minHeight={420} rootMargin="400px">
      <section className="faq-v3 section-padding">
        <div className="container">
          <div className="services-section-header faq-v3-header">
            <h2 className="section-title">
              <span className="gradient-text">{homeContent.faqTitle || 'FAQ'}</span>
            </h2>
            <p className="section-desc">
              {!homeCopyReady ? (
                <span className="home-skel" style={{ display: 'block', height: 16, width: '70%', margin: '0 auto' }} />
              ) : (
                homeContent.faqSubtitle || settings?.faqSubtitle || 'We are Garima Dance Productions, helping all dance enthusiasts to live up to their dream'
              )}
            </p>
          </div>

          <div className="faq-v3-body">
            {!sectionReady.faqs ? (
              <HomeFaqSkeleton />
            ) : (
            <div className="faq-v3-list">
              {faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div key={i} className={`faq-v3-item${isOpen ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="faq-v3-question"
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-v3-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="faq-v3-q">{faq.question}</span>
                      <span className="faq-v3-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                    <div className="faq-v3-answer">
                      <div className="faq-v3-answer-inner">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            <aside className="faq-v3-cta">
              <div className="faq-v3-cta-glow" aria-hidden="true" />
              <div className="faq-v3-cta-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Can&apos;t find what you&apos;re looking for?</h3>
              <p>Reach out on WhatsApp — we&apos;ll help you pick the right class or program.</p>
              <a
                href={buildWhatsAppUrl(settings?.whatsappNumber || '7838416907')}
                target="_blank"
                rel="noopener noreferrer"
                className="faq-v3-cta-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.031.888 3.144.889h.002c3.181 0 5.767-2.586 5.768-5.766a5.756 5.756 0 00-5.768-5.766zM12.03 16.79c-1.13 0-2.112-.34-2.956-.848l-1.266.33.336-1.228c-.51-.83-.87-1.801-.869-2.923.001-2.695 2.193-4.887 4.888-4.887 1.305 0 2.532.508 3.456 1.431a4.85 4.85 0 011.432 3.457c0 2.694-2.193 4.886-4.887 4.886z"/>
                </svg>
                Ask us directly
              </a>
            </aside>
          </div>
        </div>
      </section>
      </LazySection>

      {/* 11. Contact Section */}
      <LazySection minHeight={480} rootMargin="400px">
      <section id="contact" className="contact-v3 section-padding" ref={catchUpSectionRef}>
        <div className="container">
          <div className="contact-v3-body">
            <div className="contact-v3-text">
              <span className="contact-v3-badge">Get in Touch</span>
              {!homeCopyReady ? (
                <>
                  <div className="home-skel" style={{ height: 40, width: '70%', marginBottom: 16 }} />
                  <div className="home-skel" style={{ height: 14, width: '90%', marginBottom: 8 }} />
                  <div className="home-skel" style={{ height: 14, width: '60%', marginBottom: 20 }} />
                </>
              ) : (
                <>
                  <motion.h2
                    className="contact-v3-title"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    {homeContent.contactSectionTitle || settings?.contactSectionTitle || "Let's"}{' '}
                    <span className="gradient-text">
                      {homeContent.contactSectionHighlight || settings?.contactSectionSubtitle || 'Catch up?'}
                    </span>
                  </motion.h2>
                  <p className="contact-v3-desc">
                    {homeContent.contactSectionText || 'We are Garima Dance Productions, helping all dance enthusiasts to live up to their dream'}
                  </p>
                </>
              )}
              <a
                href={buildWhatsAppUrl(settings?.whatsappNumber || '7838416907')}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-v3-wa-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.031.888 3.144.889h.002c3.181 0 5.767-2.586 5.768-5.766a5.756 5.756 0 00-5.768-5.766zM12.03 16.79c-1.13 0-2.112-.34-2.956-.848l-1.266.33.336-1.228c-.51-.83-.87-1.801-.869-2.923.001-2.695 2.193-4.887 4.888-4.887 1.305 0 2.532.508 3.456 1.431a4.85 4.85 0 011.432 3.457c0 2.694-2.193 4.886-4.887 4.886z"/>
                </svg>
                Connect on WhatsApp
              </a>
            </div>

            <motion.div
              className="contact-v3-form-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <div className="contact-v3-form-glow" aria-hidden="true" />
              <h3>{homeCopyReady ? (homeContent.contactFormTitle || 'Or let us reach you!') : '…'}</h3>
              <form className="contact-v3-form" onSubmit={handleCatchUpSubmit} noValidate>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className={`contact-v3-input${enquiryErrors.name ? ' has-error' : ''}`}
                  value={enquiryForm.name}
                  onChange={handleEnquiryChange}
                  onBlur={(e) => handleEnquiryBlur(e)}
                  maxLength={60}
                  autoComplete="name"
                />
                {renderEnquiryFieldError('name')}
                <input
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  className={`contact-v3-input${enquiryErrors.phone ? ' has-error' : ''}`}
                  value={enquiryForm.phone}
                  onChange={handleEnquiryChange}
                  onBlur={(e) => handleEnquiryBlur(e)}
                  maxLength={10}
                  autoComplete="tel"
                />
                {renderEnquiryFieldError('phone')}
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  className={`contact-v3-input${enquiryErrors.email ? ' has-error' : ''}`}
                  value={enquiryForm.email}
                  onChange={handleEnquiryChange}
                  onBlur={(e) => handleEnquiryBlur(e)}
                  maxLength={100}
                  autoComplete="email"
                />
                {renderEnquiryFieldError('email')}
                <div className="contact-v3-checkbox">
                  <input
                    type="checkbox"
                    id="wa-consent-home"
                    name="whatsappConsent"
                    checked={enquiryForm.whatsappConsent}
                    onChange={handleEnquiryChange}
                  />
                  <label htmlFor="wa-consent-home">
                    I agree to receive messages on WhatsApp.{' '}
                    <Link to="/terms" className="contact-v3-terms">Terms &amp; Conditions</Link>
                  </label>
                </div>
                <button type="submit" className="contact-v3-submit" disabled={isEnquirySubmitting}>
                  {isEnquirySubmitting ? 'Sending…' : 'Send details'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      </LazySection>

      {/* WhatsApp float — only between Services and Catch Up sections */}
      {showWhatsApp && (
        <a
          href={buildWhatsAppUrl(settings?.whatsappNumber || '7838416907')}
          className="whatsapp-float whatsapp-float--home"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            background: '#25D366',
            color: 'white',
            padding: '15px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(37,211,102,0.4)',
            zIndex: 1000,
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      )}

      <FormResultModal
        open={formModal.open}
        type={formModal.type}
        title={formModal.title}
        message={formModal.message}
        onClose={() => setFormModal((m) => ({ ...m, open: false }))}
      />
    </Layout>
  );
};

export default Home;
