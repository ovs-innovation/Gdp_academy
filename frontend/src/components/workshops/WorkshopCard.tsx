import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShareActions from '../common/ShareActions';

export interface WorkshopItem {
  _id?: string;
  id?: string;
  name?: string | { en?: string; [key: string]: string };
  danceStyle?: string;
  DanceStyle?: string;
  workshopDate?: string;
  workshopTime?: string;
  price?: number | string;
  description?: string | { en?: string; [key: string]: string };
  workshopBanner?: string;
  image?: string;
  zoomLink?: string;
}

export const defaultWorkshops: WorkshopItem[] = [
  {
    _id: 'default-1',
    name: 'Mastering the Stage: Professional Presence',
    danceStyle: 'Elena Volkova',
    workshopDate: 'Nov 15, 2024',
    workshopTime: '10:00 AM - 02:00 PM',
    price: 120,
    description:
      'Led by Elena Volkova. This intensive workshop focuses on advanced techniques and professional performance standards.',
    workshopBanner:
      'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80',
  },
  {
    _id: 'default-2',
    name: 'Urban Choreography Intensives',
    danceStyle: 'Jordan Knight',
    workshopDate: 'Nov 22, 2024',
    workshopTime: '03:00 PM - 07:00 PM',
    price: 95,
    description:
      'Led by Jordan Knight. This intensive workshop focuses on advanced techniques and professional performance standards.',
    workshopBanner:
      'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&q=80',
  },
  {
    _id: 'default-3',
    name: 'Contemporary Flow & Improv',
    danceStyle: 'Marcus Chen',
    workshopDate: 'Dec 05, 2024',
    workshopTime: '11:00 AM - 04:00 PM',
    price: 150,
    description:
      'Led by Marcus Chen. This intensive workshop focuses on advanced techniques and professional performance standards.',
    workshopBanner:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80',
  },
];

interface WorkshopCardProps {
  workshop: WorkshopItem;
  index?: number;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, index = 0 }) => {
  const id = workshop._id || workshop.id;
  const title =
    typeof workshop.name === 'string'
      ? workshop.name
      : workshop.name?.en || 'Workshop Title';
  const coach = workshop.danceStyle || workshop.DanceStyle || 'GDP Master';
  const formatWorkshopDate = (value?: string) => {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  const date = formatWorkshopDate(workshop.workshopDate);
  const time = (workshop.workshopTime || '').trim();
  const metaParts = [date, time].filter(Boolean);
  const meta = metaParts.length > 0 ? metaParts.join('  |  ') : 'Date to be announced';
  const priceText =
    typeof workshop.price === 'number'
      ? `$${workshop.price}`
      : workshop.price || 'Free';
  const image =
    workshop.workshopBanner ||
    workshop.image ||
    'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80';
  const desc =
    typeof workshop.description === 'string'
      ? workshop.description
      : workshop.description?.en ||
        `Led by ${coach}. This intensive workshop focuses on advanced techniques and professional performance standards.`;

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="workshop-card glass-card"
    >
      <div className="workshop-image">
        <img src={image} alt={title} />
      </div>
      <div className="workshop-details">
        <span className="workshop-meta">{meta}</span>
        <h3 className="workshop-title">{title}</h3>
        <p className="workshop-desc">{desc}</p>
        <div className="workshop-footer">
          <span className="workshop-price">{priceText}</span>
          <Link
            to={`/contact?source=workshop&workshop=${encodeURIComponent(title)}`}
            className="primary-btn join-btn"
          >
            BOOK WORKSHOP
          </Link>
        </div>
        {workshop.zoomLink && (
          <a
            href={workshop.zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="zoom-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden>
              <path
                d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Join Zoom
          </a>
        )}
        <ShareActions
          title={title}
          text={`Check out this GDP workshop: ${title}`}
          path="/workshops"
          compact
        />
      </div>
    </motion.div>
  );
};

export default WorkshopCard;
