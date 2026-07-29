import type { ServiceDetailData } from "./serviceDetail";

export const SERVICE_DATA: Record<string, ServiceDetailData> = {
  'wedding-choreography': {
    title: 'Wedding Choreography',
    tagline: 'Virtual & In-Person | Worldwide',
    description:
      'Make your wedding unforgettable with custom choreography crafted around you. From romantic first dances to energetic sangeet group performances, our expert choreographers design routines that match your comfort level and vision â€” whether you\'re a first-timer or a trained dancer.',
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
      { q: 'How far in advance should I book?', a: 'We recommend booking at least 2â€“3 months before your wedding date for the best experience.' },
      { q: 'Can I do this online?', a: 'Absolutely! Our virtual packages are delivered via Zoom with full-HD session recording for review.' },
      { q: 'How many people can join?', a: 'We handle groups of all sizes â€” from intimate couples to large sangeet groups of 30+.' },
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
      'All styles â€” Bollywood, contemporary, classical',
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
      'Access our ever-growing library of professional choreography and technique tutorials. Learn at your own pace, revisit any lesson as many times as you like, and track your progress as you advance from beginner to advanced dancer â€” all on your own schedule.',
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
      { q: 'How long do I have access?', a: 'Lifetime access for all enrolled courses â€” learn at your own pace forever.' },
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
      'High-intensity interval training meets dance cardio. Short bursts of intense movement combined with active recovery â€” the most time-efficient way to burn calories and build fitness.',
    features: [
      'Short 30â€“45 minute sessions',
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
