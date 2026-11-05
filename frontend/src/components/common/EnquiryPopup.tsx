import React, { useEffect, useRef, useState } from 'react';
import { submitEnquiry } from '../../services/enquiryService';
import { useSiteData } from '../../contexts/SiteDataContext';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { sanitizeEnquiryField } from '../../utils/enquiryValidation';
import {
  DIAL_CODES,
  ENQUIRY_COUNTRIES,
  enquiryCopy,
  programLabel,
  type EnquiryIntent,
} from '../../lib/trialEnquiry';
import '../../styles/enquiry-popup.css';

type Props = {
  intent: EnquiryIntent | null;
  onClose: () => void;
};

const STATS = [
  { icon: 'star', value: '5.0', label: 'Google Rating' },
  { icon: 'users', value: '10,000+', label: 'Students' },
  { icon: 'globe', value: '15+', label: 'Countries' },
  { icon: 'ring', value: '300+', label: 'Weddings' },
] as const;

interface CourseOption {
  id: string;
  label: string;
  icon: IconName;
}

const COURSES: CourseOption[] = [
  {
    id: 'dance-classes',
    label: 'Dance Classes',
    icon: 'monitor',
  },
  {
    id: 'fitness-sessions',
    label: 'Fitness Sessions for PCOD/ PCOS / Thyroid / Post Pregnancy wellness',
    icon: 'heart',
  },
  {
    id: 'wedding-choreography',
    label: 'Wedding Choreography',
    icon: 'ring',
  },
  {
    id: 'personal-classes',
    label: 'Personal classes',
    icon: 'user',
  },
];

function matchCourseWithIntent(intent: EnquiryIntent | null): string {
  if (!intent) return '';
  const text = `${intent.program || ''} ${intent.topic || ''}`.toLowerCase();
  if (text.includes('wedding') || text.includes('sangeet')) return 'wedding-choreography';
  if (
    text.includes('pcod') ||
    text.includes('pcos') ||
    text.includes('thyroid') ||
    text.includes('pregnan') ||
    text.includes('fitness') ||
    text.includes('wellness') ||
    text.includes('combo') ||
    text.includes('zumba') ||
    text.includes('hiit')
  ) {
    return 'fitness-sessions';
  }
  if (text.includes('personal') || text.includes('private') || text.includes('custom') || text.includes('1-on-1')) {
    return 'personal-classes';
  }
  if (text.includes('dance') || text.includes('kathak') || text.includes('bollywood') || text.includes('contemporary')) {
    return 'dance-classes';
  }
  return '';
}

const COUNTRY_ISO: Record<string, string> = {
  India: 'IN',
  'United Arab Emirates': 'AE',
  'United States': 'US',
  'United Kingdom': 'GB',
  Canada: 'CA',
  Australia: 'AU',
  Singapore: 'SG',
};

type IconName = 'star' | 'users' | 'globe' | 'ring' | 'clock' | 'user' | 'pin' | 'monitor' | 'heart' | 'home' | 'child' | 'lock' | 'whatsapp' | 'spark' | 'play' | 'check';

function Icon({ name }: { name: IconName }) {
  if (name === 'whatsapp') {
    return (
      <svg className="enquiry-popup__svg enquiry-popup__svg--wa" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10.1 10.1 0 0 0 4.65 1.12h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 14.15c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.12.1-1.81-.11-.41-.13-.95-.31-1.64-.61-2.89-1.25-4.77-4.16-4.91-4.35-.14-.19-1.17-1.55-1.17-2.96 0-1.41.74-2.1 1-2.39.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.58.81 2 .88 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.28-.12.55.16.26.7 1.16 1.51 1.88 1.04.92 1.91 1.21 2.18 1.35.26.14.42.12.58-.07.16-.19.66-.77.84-1.03.17-.26.35-.22.58-.13.24.09 1.5.71 1.76.84.26.12.43.19.49.3.07.1.07.61-.17 1.29z" />
      </svg>
    );
  }
  return (
    <svg className="enquiry-popup__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'star' ? <polygon points="12 3.2 14.7 8.7 20.7 9.5 16.3 13.7 17.4 19.6 12 16.8 6.6 19.6 7.7 13.7 3.3 9.5 9.3 8.7" fill="currentColor" stroke="none" /> : null}
      {name === 'users' ? <><path d="M16 20v-1.2A3.8 3.8 0 0 0 12.2 15H7.8A3.8 3.8 0 0 0 4 18.8V20" /><circle cx="10" cy="8" r="3" /><path d="M20 20v-1.2A3.5 3.5 0 0 0 17 15.4" /><path d="M16 5.1a3 3 0 0 1 0 5.8" /></> : null}
      {name === 'globe' ? <><circle cx="12" cy="12" r="8" /><path d="M4 12h16" /><path d="M12 4c2.2 2.4 3.3 5.1 3.3 8S14.2 17.6 12 20c-2.2-2.4-3.3-5.1-3.3-8S9.8 6.4 12 4z" /></> : null}
      {name === 'ring' ? <><circle cx="9" cy="13" r="4" /><circle cx="15" cy="13" r="4" /><path d="M9 7.5 10.2 5h2.2" /><path d="M15 7.5 13.8 5h-2" /></> : null}
      {name === 'clock' ? <><circle cx="12" cy="12" r="8" /><path d="M12 8v4.5L15 15" /></> : null}
      {name === 'user' ? <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 19.2a6.5 6.5 0 0 1 13 0" /></> : null}
      {name === 'pin' ? <><path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" /><circle cx="12" cy="11" r="2" /></> : null}
      {name === 'monitor' ? <><rect x="3.5" y="4.5" width="17" height="11" rx="2" /><path d="M8 19.5h8" /><path d="M12 15.5v4" /></> : null}
      {name === 'heart' ? <path d="M12 19s-6.2-3.8-8.2-7.2C2.4 9.6 3.2 6.8 5.8 6.2 7.4 5.8 9 6.5 12 9c3-2.5 4.6-3.2 6.2-2.8 2.6.6 3.4 3.4 2 5.6C18.2 15.2 12 19 12 19z" /> : null}
      {name === 'home' ? <><path d="M4 11.5 12 5l8 6.5" /><path d="M7 10.5V19h10v-8.5" /></> : null}
      {name === 'child' ? <><circle cx="12" cy="7.5" r="2.6" /><path d="M8 19.5v-2.2A3.2 3.2 0 0 1 11.2 14h1.6A3.2 3.2 0 0 1 16 17.3v2.2" /><path d="M7.5 11.5h9" /></> : null}
      {name === 'lock' ? <><rect x="6" y="11" width="12" height="8" rx="2" /><path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" /></> : null}
      {name === 'spark' ? <path d="M12 3.5 13.4 9 19 10.5 13.4 12 12 17.5 10.6 12 5 10.5 10.6 9z" /> : null}
      {name === 'play' ? <polygon points="9 7 17 12 9 17" fill="currentColor" stroke="none" /> : null}
      {name === 'check' ? <path d="M5 12.5 9.2 17 19 7" /> : null}
    </svg>
  );
}

function Flag({ iso }: { iso: string }) {
  return (
    <svg className="enquiry-popup__flag" viewBox="0 0 18 12" aria-hidden="true">
      {iso === 'IN' ? <><rect width="18" height="4" fill="#FF9933" /><rect y="4" width="18" height="4" fill="#fff" /><rect y="8" width="18" height="4" fill="#138808" /><circle cx="9" cy="6" r="1.15" fill="none" stroke="#000080" strokeWidth="0.45" /></> : null}
      {iso === 'AE' ? <><rect width="5" height="12" fill="#FF0000" /><rect x="5" width="13" height="4" fill="#00732F" /><rect x="5" y="4" width="13" height="4" fill="#fff" /><rect x="5" y="8" width="13" height="4" fill="#000" /></> : null}
      {iso === 'US' ? <><rect width="18" height="12" fill="#BF0A30" /><rect y="1.7" width="18" height="1.1" fill="#fff" /><rect y="4" width="18" height="1.1" fill="#fff" /><rect y="6.3" width="18" height="1.1" fill="#fff" /><rect y="8.6" width="18" height="1.1" fill="#fff" /><rect width="8" height="6.4" fill="#002868" /></> : null}
      {iso === 'GB' ? <><rect width="18" height="12" fill="#012169" /><path d="M0 0 18 12M18 0 0 12" stroke="#fff" strokeWidth="2.4" /><path d="M0 0 18 12M18 0 0 12" stroke="#C8102E" strokeWidth="1.1" /><path d="M9 0v12M0 6h18" stroke="#fff" strokeWidth="3.6" /><path d="M9 0v12M0 6h18" stroke="#C8102E" strokeWidth="1.8" /></> : null}
      {iso === 'CA' ? <><rect width="18" height="12" fill="#fff" /><rect width="4.5" height="12" fill="#FF0000" /><rect x="13.5" width="4.5" height="12" fill="#FF0000" /><path d="M9 2.4 9.7 4.4 11.8 4.2 10.2 5.5 11 7.4 9 6.3 7 7.4 7.8 5.5 6.2 4.2 8.3 4.4z" fill="#FF0000" /></> : null}
      {iso === 'AU' ? <><rect width="18" height="12" fill="#012169" /><rect width="9" height="6" fill="#012169" /><path d="M0 0 9 6M9 0 0 6" stroke="#fff" strokeWidth="1.3" /><path d="M0 0 9 6M9 0 0 6" stroke="#C8102E" strokeWidth="0.6" /><path d="M4.5 0v6M0 3h9" stroke="#fff" strokeWidth="2" /><path d="M4.5 0v6M0 3h9" stroke="#C8102E" strokeWidth="1" /><circle cx="13.2" cy="8.2" r="0.7" fill="#fff" /></> : null}
      {iso === 'SG' ? <><rect width="18" height="6" fill="#EF3340" /><rect y="6" width="18" height="6" fill="#fff" /><circle cx="5.2" cy="3.1" r="1.5" fill="#fff" /><circle cx="5.8" cy="3.1" r="1.2" fill="#EF3340" /></> : null}
    </svg>
  );
}

function phoneError(dial: string, phone: string): string | undefined {
  if (!phone) return 'Enter your WhatsApp number.';
  if (dial === '+91') {
    if (!/^\d{10}$/.test(phone)) return 'Enter a 10-digit mobile number.';
    if (!/^[6-9]/.test(phone)) return 'Indian numbers start with 6, 7, 8, or 9.';
    return undefined;
  }
  if (!/^\d{6,15}$/.test(phone)) return 'Enter a valid WhatsApp number.';
  return undefined;
}

const EnquiryPopup: React.FC<Props> = ({ intent, onClose }) => {
  const { appSettings, cmsSettings } = useSiteData();
  const [name, setName] = useState('');
  const [dial, setDial] = useState('+91');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('');
  const [courseMode, setCourseMode] = useState<'Online' | 'Offline' | null>(null);
  const [pendingCourse, setPendingCourse] = useState<CourseOption | null>(null);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [openMenu, setOpenMenu] = useState<'dial' | 'country' | null>(null);
  const openMenuRef = useRef(openMenu);
  openMenuRef.current = openMenu;

  useEffect(() => {
    if (!intent) return;
    setName('');
    setDial('+91');
    setPhone('');
    setCountry('');
    setCity('');
    setErrors({});
    setSending(false);
    setDone(false);
    setOpenMenu(null);
    setPendingCourse(null);

    const matched = matchCourseWithIntent(intent);
    if (matched) {
      setProgram(matched);
      const text = `${intent.program || ''} ${intent.topic || ''}`.toLowerCase();
      if (text.includes('offline') || text.includes('studio')) {
        setCourseMode('Offline');
      } else if (text.includes('online') || text.includes('zoom')) {
        setCourseMode('Online');
      } else {
        setCourseMode(null);
      }
    } else {
      setProgram('');
      setCourseMode(null);
    }
  }, [intent]);

  useEffect(() => {
    if (!intent) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (pendingCourse) {
        setPendingCourse(null);
        return;
      }
      if (openMenuRef.current) {
        setOpenMenu(null);
        return;
      }
      onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [intent, onClose, pendingCourse]);

  useEffect(() => {
    if (!openMenu) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('.enquiry-popup__menu, .enquiry-popup__picker')) return;
      setOpenMenu(null);
    };
    const onScroll = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('.enquiry-popup__menu')) return;
      setOpenMenu(null);
    };

    document.addEventListener('mousedown', onPointer);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [openMenu]);

  if (!intent) return null;

  const selectedCourse = COURSES.find((item) => item.id === program);
  const copy = enquiryCopy(intent);

  const whatsappHref = buildWhatsAppUrl(
    appSettings?.whatsappNumber || cmsSettings?.whatsappNumber || '917838416907',
    selectedCourse
      ? `Hello! I'd like to enquire about ${selectedCourse.label}${courseMode ? ` (${courseMode} mode)` : ''}.`
      : `Hello! I'd like to know more about ${copy.subject}.`,
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    const cleanName = name.trim();
    if (cleanName.length < 2) next.name = 'Enter your full name.';
    const phoneMessage = phoneError(dial, phone);
    if (phoneMessage) next.phone = phoneMessage;
    if (!program || !selectedCourse) {
      next.program = 'Pick a course.';
    } else if (!courseMode) {
      next.program = 'Please choose Online or Offline mode.';
    }
    if (!country) next.country = 'Select your country.';
    if (country === 'Other' && city.trim().length < 2) next.city = 'Add your city.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const chosen = selectedCourse ? `${selectedCourse.label}${courseMode ? ` (${courseMode})` : ''}` : programLabel(program);
    const place = country === 'Other' ? city.trim() : country;
    const message = [
      `${copy.purposeLabel}${intent.topic ? `: ${intent.topic}` : ''}.`,
      chosen ? `Course: ${chosen}.` : '',
      courseMode ? `Mode: ${courseMode}.` : '',
      `WhatsApp: ${dial} ${phone}.`,
      `Country / city: ${place}.`,
    ].filter(Boolean).join(' ');

    setSending(true);
    try {
      await submitEnquiry({
        name: cleanName,
        email: '',
        phone,
        message,
        subject: `${copy.purposeLabel} · ${chosen || intent.topic || 'General'}`,
        whatsappConsent: true,
        source: 'contact_form',
      });
      setDone(true);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Could not send. Please try WhatsApp.';
      setErrors({ form: messageText });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="enquiry-popup" role="presentation" onClick={onClose}>
      <div
        className="enquiry-popup__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-popup-title"
        onClick={(event) => event.stopPropagation()}
        onScroll={(event) => {
          const target = event.target as HTMLElement | null;
          if (!target?.closest('.enquiry-popup__menu') && openMenu) {
            setOpenMenu(null);
          }
        }}
      >
        <button type="button" className="enquiry-popup__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <aside className="enquiry-popup__aside">
          <p className="enquiry-popup__eyebrow">{copy.eyebrow}</p>
          <h2 id="enquiry-popup-title">
            {copy.lines[0]}
            <br />
            {copy.lines[1]}
            <br />
            <span>{copy.lines[2]}</span>
          </h2>
          {copy.blurb ? <p className="enquiry-popup__blurb">{copy.blurb}</p> : null}
          <ul className="enquiry-popup__stats">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <span className={`enquiry-popup__stat-icon enquiry-popup__stat-icon--${stat.icon}`}><Icon name={stat.icon} /></span>
                <span>
                  <strong>{stat.value}</strong>
                  <em>{stat.label}</em>
                </span>
              </li>
            ))}
            <li className="enquiry-popup__stat-wide">
              <span className="enquiry-popup__stat-icon enquiry-popup__stat-icon--clock"><Icon name="clock" /></span>
              <span>
                <strong>Average Response Time</strong>
                <em className="is-green">Quick Response</em>
              </span>
            </li>
          </ul>
        </aside>

        <div className="enquiry-popup__form-wrap">
          {done ? (
            <div className="enquiry-popup__done">
              <h3>{copy.successTitle}</h3>
              <p>{copy.successText}</p>
              <button type="button" className="enquiry-popup__submit" onClick={onClose}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <p className="enquiry-popup__welcome">
                <span className="enquiry-popup__spark-icon"><Icon name="spark" /></span>
                <span>
                  Welcome to
                  <strong>Garima Dance Productions</strong>
                </span>
              </p>
              {copy.hint ? <p className="enquiry-popup__hint">{copy.hint}</p> : null}

              <label className="enquiry-popup__field">
                <span>What's your name?</span>
                <span className="enquiry-popup__control">
                  <span className="enquiry-popup__glyph enquiry-popup__glyph--user"><Icon name="user" /></span>
                  <input
                    value={name}
                    onChange={(event) => setName(sanitizeEnquiryField('name', event.target.value))}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={60}
                  />
                </span>
                {errors.name ? <em>{errors.name}</em> : null}
              </label>

              <label className="enquiry-popup__field">
                <span>WhatsApp Number</span>
                <span className="enquiry-popup__phone">
                  <button
                    type="button"
                    className="enquiry-popup__picker"
                    aria-label="Country code"
                    aria-expanded={openMenu === 'dial'}
                    onClick={() => setOpenMenu((current) => (current === 'dial' ? null : 'dial'))}
                  >
                    <span className="enquiry-popup__dial">
                      <Flag iso={DIAL_CODES.find((item) => item.code === dial)?.iso || 'IN'} />
                      {dial}
                    </span>
                    <span className="enquiry-popup__chevron" aria-hidden="true" />
                  </button>
                  {openMenu === 'dial' ? (
                    <ul className="enquiry-popup__menu enquiry-popup__menu--dial" role="listbox">
                      {DIAL_CODES.map((item) => (
                        <li key={item.code}>
                          <button
                            type="button"
                            className={dial === item.code ? 'is-on' : ''}
                            onClick={() => {
                              setDial(item.code);
                              setOpenMenu(null);
                            }}
                          >
                            <Flag iso={item.iso} />
                            {item.label} {item.code}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, dial === '+91' ? 10 : 15))}
                    placeholder="WhatsApp number"
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                </span>
                {errors.phone ? <em>{errors.phone}</em> : null}
              </label>

              <fieldset className="enquiry-popup__programs">
                <legend>Which course are you interested in?</legend>
                <div className="enquiry-popup__courses-grid">
                  {COURSES.map((item) => {
                    const isSelected = program === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`enquiry-popup__program-btn enquiry-popup__program-btn--${item.icon}${isSelected ? ' is-on' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => setPendingCourse(item)}
                      >
                        <span className={`enquiry-popup__program-icon enquiry-popup__program-icon--${item.icon}`}>
                          <Icon name={item.icon} />
                        </span>
                        <span className="enquiry-popup__course-details">
                          <span className="enquiry-popup__course-title">{item.label}</span>
                          {isSelected && courseMode ? (
                            <span className={`enquiry-popup__course-mode-badge enquiry-popup__course-mode-badge--${courseMode.toLowerCase()}`}>
                              {courseMode === 'Online' ? '💻 Online' : '📍 Offline (Studio)'}
                            </span>
                          ) : null}
                        </span>
                        {isSelected ? (
                          <span className="enquiry-popup__program-check">
                            <Icon name="check" />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
                {errors.program ? <em>{errors.program}</em> : null}
              </fieldset>

              <label className="enquiry-popup__field">
                <span>Country / City</span>
                <span className="enquiry-popup__control">
                  <span className="enquiry-popup__glyph enquiry-popup__glyph--pin"><Icon name="pin" /></span>
                  <button
                    type="button"
                    className={`enquiry-popup__picker${country ? '' : ' is-placeholder'}`}
                    aria-expanded={openMenu === 'country'}
                    onClick={() => setOpenMenu((current) => (current === 'country' ? null : 'country'))}
                  >
                    <span>{country || 'Select your country'}</span>
                    <span className="enquiry-popup__chevron" aria-hidden="true" />
                  </button>
                  {openMenu === 'country' ? (
                    <ul className="enquiry-popup__menu" role="listbox">
                      {ENQUIRY_COUNTRIES.map((item) => (
                        <li key={item}>
                          <button
                            type="button"
                            className={country === item ? 'is-on' : ''}
                            onClick={() => {
                              setCountry(item);
                              setOpenMenu(null);
                            }}
                          >
                            {COUNTRY_ISO[item] ? <Flag iso={COUNTRY_ISO[item]} /> : null}
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </span>
                {errors.country ? <em>{errors.country}</em> : null}
              </label>
              {country === 'Other' ? (
                <label className="enquiry-popup__field">
                  <span>City</span>
                  <span className="enquiry-popup__control">
                    <input value={city} onChange={(event) => setCity(event.target.value.slice(0, 60))} placeholder="Your city" />
                  </span>
                  {errors.city ? <em>{errors.city}</em> : null}
                </label>
              ) : null}

              {errors.form ? <p className="enquiry-popup__form-error">{errors.form}</p> : null}

              <button type="submit" className="enquiry-popup__submit" disabled={sending}>
                {sending ? 'Sending…' : copy.button} <span aria-hidden="true">→</span>
              </button>
              <p className="enquiry-popup__secure">
                <span className="enquiry-popup__lock-icon"><Icon name="lock" /></span> 100% Secure. Your information is safe with us.
              </p>
              <div className="enquiry-popup__or">
                <p>
                  <span className="enquiry-popup__spark-icon"><Icon name="spark" /></span>
                  <span>
                    <strong>Awesome!</strong>
                    Our team will contact you shortly.
                  </span>
                </p>
                <span>OR</span>
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  <span className="enquiry-popup__wa"><Icon name="whatsapp" /></span>
                  <span>
                    Chat instantly
                    <b>on WhatsApp</b>
                  </span>
                </a>
              </div>
            </form>
          )}
        </div>

        {pendingCourse ? (
          <div className="enquiry-popup__mode-backdrop" role="presentation" onClick={() => setPendingCourse(null)}>
            <div
              className="enquiry-popup__mode-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Select Learning Mode"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="enquiry-popup__mode-close"
                onClick={() => setPendingCourse(null)}
                aria-label="Close mode selection"
              >
                ✕
              </button>

              <div className="enquiry-popup__mode-header">
                <span className={`enquiry-popup__program-icon enquiry-popup__program-icon--${pendingCourse.icon}`}>
                  <Icon name={pendingCourse.icon} />
                </span>
                <div>
                  <h4>{pendingCourse.label}</h4>
                  <p>How would you like to attend this course?</p>
                </div>
              </div>

              <div className="enquiry-popup__mode-options">
                <button
                  type="button"
                  className={`enquiry-popup__mode-card enquiry-popup__mode-card--online ${program === pendingCourse.id && courseMode === 'Online' ? 'is-selected' : ''}`}
                  onClick={() => {
                    setProgram(pendingCourse.id);
                    setCourseMode('Online');
                    setPendingCourse(null);
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.program;
                      return next;
                    });
                  }}
                >
                  <div className="enquiry-popup__mode-icon-wrap">
                    <Icon name="monitor" />
                  </div>
                  <div className="enquiry-popup__mode-info">
                    <strong>Online Class</strong>
                    <span>Live interactive classes from anywhere in the world</span>
                  </div>
                  <span className="enquiry-popup__mode-select-pill">Online →</span>
                </button>

                <button
                  type="button"
                  className={`enquiry-popup__mode-card enquiry-popup__mode-card--offline ${program === pendingCourse.id && courseMode === 'Offline' ? 'is-selected' : ''}`}
                  onClick={() => {
                    setProgram(pendingCourse.id);
                    setCourseMode('Offline');
                    setPendingCourse(null);
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.program;
                      return next;
                    });
                  }}
                >
                  <div className="enquiry-popup__mode-icon-wrap">
                    <Icon name="pin" />
                  </div>
                  <div className="enquiry-popup__mode-info">
                    <strong>Offline (Studio)</strong>
                    <span>In-person sessions at GDP dance studio</span>
                  </div>
                  <span className="enquiry-popup__mode-select-pill">Offline →</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EnquiryPopup;
