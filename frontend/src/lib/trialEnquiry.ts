export type TrialProgram =
  | 'wedding-choreography'
  | 'online-dance-classes'
  | 'pre-recorded-courses'
  | 'pcod-wellness'
  | 'thyroid-wellness'
  | 'post-pregnancy-wellness'
  | 'zumba'
  | 'hiit'
  | 'yoga';

export type EnquiryPurpose = 'trial' | 'contact' | 'service';

export type EnquiryIntent = {
  purpose: EnquiryPurpose;
  program?: TrialProgram | null;
  topic?: string;
};

export const TRIAL_PROGRAMS: Array<{ id: TrialProgram; label: string; short: string }> = [
  { id: 'wedding-choreography', label: 'Wedding Choreography', short: 'Wedding' },
  { id: 'online-dance-classes', label: 'Online Dance Classes', short: 'Online' },
  { id: 'pre-recorded-courses', label: 'Pre-Recorded Courses', short: 'Courses' },
  { id: 'pcod-wellness', label: 'PCOD / PCOS Wellness', short: 'PCOD' },
  { id: 'thyroid-wellness', label: 'Thyroid Wellness', short: 'Thyroid' },
  { id: 'post-pregnancy-wellness', label: 'Post Pregnancy Wellness', short: 'Postnatal' },
  { id: 'zumba', label: 'Zumba', short: 'Zumba' },
  { id: 'hiit', label: 'HIIT Dance', short: 'HIIT' },
  { id: 'yoga', label: 'Yoga', short: 'Yoga' },
];

export const DIAL_CODES = [
  { code: '+91', label: 'IN', iso: 'IN' },
  { code: '+971', label: 'AE', iso: 'AE' },
  { code: '+1', label: 'US', iso: 'US' },
  { code: '+44', label: 'UK', iso: 'GB' },
  { code: '+61', label: 'AU', iso: 'AU' },
  { code: '+65', label: 'SG', iso: 'SG' },
];

export const ENQUIRY_COUNTRIES = [
  'India',
  'United Arab Emirates',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Singapore',
  'Other',
];

export function programLabel(id: TrialProgram | string | null | undefined): string {
  return TRIAL_PROGRAMS.find((item) => item.id === id)?.label || '';
}

export type EnquiryServiceOption = {
  id: string;
  label: string;
};

const PRIMARY_SERVICE_COUNT = 4;

export function serviceOptionMatches(option: EnquiryServiceOption, intent: EnquiryIntent): boolean {
  const title = option.label.trim().toLowerCase();
  const topic = (intent.topic || '').trim().toLowerCase();
  const key = option.id.trim().toLowerCase();
  const chosen = (intent.program || '').trim().toLowerCase();
  if (chosen && (chosen === key || chosen === title)) return true;
  if (topic.length < 3) return false;
  return topic === title || title.includes(topic) || topic.includes(title);
}

export function buildEnquiryServiceOptions(
  cmsServices: Array<{ key?: string; title?: string | { en?: string;[key: string]: string }; isActive?: boolean }>,
): EnquiryServiceOption[] {
  const primary = cmsServices
    .filter((item) => item.isActive !== false)
    .map((item) => {
      const rawTitle = item.title;
      const label = (typeof rawTitle === 'string' ? rawTitle : rawTitle?.en || '').trim();
      return { id: String(item.key || label).trim(), label };
    })
    .filter((item) => item.id && item.label)
    .slice(0, PRIMARY_SERVICE_COUNT);

  const source = primary.length > 0
    ? primary
    : [
      { id: 'online-dance-classes', label: 'Online Dance Classes' },
      { id: 'online-combo-fitness', label: 'Online Combo Fitness Classes' },
      { id: 'wedding-choreography', label: 'Wedding Choreography' },
      { id: 'custom-choreography', label: 'Custom Choreography' },
    ];

  const extras = TRIAL_PROGRAMS
    .filter((item) => !source.some((option) => {
      const left = option.label.toLowerCase();
      const right = item.label.toLowerCase();
      return left === right || left.includes(right) || right.includes(left);
    }))
    .map((item) => ({ id: item.id, label: item.label }));

  return [...source, ...extras];
}

export function programFromLabel(key?: string, title?: string): TrialProgram | null {
  const slug = (key || '').toLowerCase().trim();
  const exact = TRIAL_PROGRAMS.find((item) => item.id === slug);
  if (exact) return exact.id;
  const text = `${key || ''} ${title || ''}`.toLowerCase();
  if (text.includes('pcod') || text.includes('pcos')) return 'pcod-wellness';
  if (text.includes('thyroid')) return 'thyroid-wellness';
  if (text.includes('pregnan') || text.includes('postnatal')) return 'post-pregnancy-wellness';
  if (text.includes('zumba')) return 'zumba';
  if (text.includes('hiit')) return 'hiit';
  if (text.includes('yoga')) return 'yoga';
  if (text.includes('pre-recorded') || text.includes('prerecorded') || text.includes('recorded') || text.includes('combo')) {
    return 'pre-recorded-courses';
  }
  if (text.includes('wedding') || text.includes('sangeet')) return 'wedding-choreography';
  if (text.includes('online') || text.includes('zoom')) return 'online-dance-classes';
  return null;
}

export function isContactHref(href: string, label = ''): boolean {
  const name = label.toLowerCase().trim();
  if (name.includes('term') || name.includes('privacy') || name.includes('policy')) return false;
  const path = href.split('?')[0].split('#')[0].toLowerCase().replace(/\/+$/, '') || '/';
  return path === '/contact' || name === 'contact';
}

export type EnquiryCopy = {
  eyebrow: string;
  lines: [string, string, string];
  blurb: string;
  hint: string;
  button: string;
  successTitle: string;
  successText: string;
  purposeLabel: string;
  subject: string;
};

const REACH = 'Our team will contact you shortly.';

function programShort(id: TrialProgram | null | undefined): string {
  return (TRIAL_PROGRAMS.find((item) => item.id === id)?.short || 'dance').toLowerCase();
}

export function enquiryCopy(intent: EnquiryIntent): EnquiryCopy {
  const topic = (intent.topic || '').trim();
  const programName = programLabel(intent.program);
  const subject = topic || programName;
  const about = subject ? `This is about ${subject}.` : '';

  if (intent.purpose === 'trial') {
    return {
      eyebrow: "Let's start your dance journey",
      lines: intent.program ? ['Book your', programShort(intent.program), 'class'] : ['Book your', 'free trial', 'class'],
      blurb: about || 'Fill this quick form and our team will contact you shortly to schedule your free trial class.',
      hint: subject ? `About ${subject}.` : '',
      button: 'Book My Free Trial',
      successTitle: "You're booked in.",
      successText: 'Our team will reach you on WhatsApp shortly.',
      purposeLabel: 'Free trial',
      subject: subject || 'a free trial class',
    };
  }

  if (intent.purpose === 'service') {
    return {
      eyebrow: subject || "Let's start your dance journey",
      lines: intent.program ? ['Book your', programShort(intent.program), 'class'] : ['Enquire', 'about', 'this'],
      blurb: about || `Tell us what you need. ${REACH}`,
      hint: subject ? `About ${subject}.` : '',
      button: 'Send my details',
      successTitle: 'Request sent.',
      successText: 'Our team will reach you on WhatsApp shortly.',
      purposeLabel: 'Service enquiry',
      subject: subject || 'GDP classes',
    };
  }

  return {
    eyebrow: subject || "Let's talk",
    lines: ['Get in', 'touch', 'today'],
    blurb: about || REACH,
    hint: subject ? `About ${subject}.` : '',
    button: 'Send my details',
    successTitle: 'Message sent.',
    successText: 'Our team will reach you on WhatsApp shortly.',
    purposeLabel: 'Contact',
    subject: subject || 'GDP classes',
  };
}

export function intentFromSearch(params: URLSearchParams, fallbackTopic = ''): EnquiryIntent {
  const sourceRaw = (params.get('source') || '').trim();
  const named =
    (params.get('workshop') || '').trim() ||
    (params.get('program') || '').trim() ||
    (params.get('plan') || '').trim();
  const topic = named || fallbackTopic || prettySource(sourceRaw);
  const blob = `${sourceRaw} ${named} ${fallbackTopic}`;
  let purpose: EnquiryPurpose = 'contact';
  if (/trial/i.test(blob)) purpose = 'trial';
  else if (/workshop|program|zoom/i.test(sourceRaw) || params.get('workshop') || params.get('program')) {
    purpose = 'service';
  }
  return {
    purpose,
    topic: topic || undefined,
    program: programFromLabel(blob),
  };
}

export function intentFromContactUrl(href: string, fallbackTopic = ''): EnquiryIntent | null {
  if (!isContactHref(href)) return null;
  const query = href.split('?')[1]?.split('#')[0] || '';
  return intentFromSearch(new URLSearchParams(query), fallbackTopic);
}

function prettySource(source: string): string {
  if (!source) return '';
  if (source === 'workshop-featured') return 'Workshops';
  if (source === 'live-zoom') return 'Live Zoom';
  return source.replace(/-/g, ' ');
}
