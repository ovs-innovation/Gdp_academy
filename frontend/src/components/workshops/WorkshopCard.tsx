import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShareActions from '../common/ShareActions';
import LazyImage from '../common/LazyImage';

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
    name: 'Bollywood Masterclass',
    danceStyle: 'Bollywood',
    workshopDate: '2026-04-15',
    workshopTime: '10:00 AM - 02:00 PM',
    price: 999,
    description:
      'High-energy Bollywood choreography, expressions, and stage presence with GDP mentors.',
    workshopBanner:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=85',
  },
  {
    _id: 'default-2',
    name: 'Wedding Choreography Intensive',
    danceStyle: 'Wedding',
    workshopDate: '2026-04-22',
    workshopTime: '03:00 PM - 07:00 PM',
    price: 1499,
    description:
      'Custom sangeet routines, couple choreography, and family performance prep.',
    workshopBanner:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  },
  {
    _id: 'default-3',
    name: 'Contemporary Flow Workshop',
    danceStyle: 'Contemporary',
    workshopDate: '2026-05-05',
    workshopTime: '11:00 AM - 04:00 PM',
    price: 1299,
    description:
      'Fluid movement, floorwork, improvisation, and emotive choreography.',
    workshopBanner:
      'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=85',
  },
];

const imageFallback =
  'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&w=1200&q=85';

interface WorkshopCardProps {
  workshop: WorkshopItem;
  index?: number;
  variant?: 'default' | 'cw';
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({
  workshop,
  index = 0,
  variant = 'default',
}) => {
  const title =
    typeof workshop.name === 'string'
      ? workshop.name
      : workshop.name?.en || 'Workshop';
  const style = workshop.danceStyle || workshop.DanceStyle || 'Workshop';
  const formatDate = (value?: string) => {
    if (!value) return 'TBA';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  const date = formatDate(workshop.workshopDate);
  const time = (workshop.workshopTime || '').trim() || 'TBA';
  const priceText =
    typeof workshop.price === 'number'
      ? new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(workshop.price)
      : workshop.price || 'Free';
  const image = workshop.workshopBanner || workshop.image || imageFallback;
  const desc =
    typeof workshop.description === 'string'
      ? workshop.description
      : workshop.description?.en || 'Join this live session with GDP mentors.';

  if (variant === 'cw') {
    return (
      <motion.article
        className="wsh-cw-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.15) }}
      >
        <div className="wsh-cw-card__media">
          <LazyImage
            src={image}
            alt={title}
            rootMargin="200px"
            onError={(e) => {
              e.currentTarget.src = imageFallback;
            }}
          />
          <span className="wsh-cw-card__price">{priceText}</span>
        </div>

        <div className="wsh-cw-card__body">
          <span className="wsh-cw-card__tag">{style}</span>
          <h3 className="wsh-cw-card__title">{title}</h3>
          <p className="wsh-cw-card__desc">{desc}</p>
          <div className="wsh-cw-card__meta">
            <span>{date}</span>
            <span>{time}</span>
          </div>
          <Link
            to={`/contact?source=workshop&workshop=${encodeURIComponent(title)}`}
            className="wsh-cw-card__btn"
          >
            Book Now
          </Link>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      className="wsh-event-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.2) }}
    >
      <div className="wsh-event-card__media">
        <LazyImage
          src={image}
          alt={title}
          rootMargin="200px"
          onError={(e) => {
            e.currentTarget.src = imageFallback;
          }}
        />
        <div className="wsh-event-card__shade" aria-hidden="true" />
        <span className="wsh-event-card__price">{priceText}</span>
        <span className="wsh-event-card__live">
          <span className="wsh-event-card__live-dot" />
          Live Session
        </span>
      </div>

      <div className="wsh-event-card__body">
        <span className="wsh-event-card__tag">{style}</span>
        <h3 className="wsh-event-card__title">{title}</h3>
        <p className="wsh-event-card__desc">{desc}</p>

        <div className="wsh-event-card__meta">
          <div className="wsh-event-card__meta-item">
            <span className="wsh-event-card__meta-label">Date</span>
            <strong>{date}</strong>
          </div>
          <div className="wsh-event-card__meta-item">
            <span className="wsh-event-card__meta-label">Time</span>
            <strong>{time}</strong>
          </div>
        </div>

        <div className="wsh-event-card__actions">
          <Link
            to={`/contact?source=workshop&workshop=${encodeURIComponent(title)}`}
            className="wsh-event-card__btn"
          >
            Book Your Spot
          </Link>
          {workshop.zoomLink && (
            <a
              href={workshop.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="wsh-event-card__btn-outline"
            >
              Join on Zoom
            </a>
          )}
        </div>

        <ShareActions
          title={title}
          text={`Check out this GDP workshop: ${title}`}
          path="/workshops"
          compact
        />
      </div>
    </motion.article>
  );
};

export default WorkshopCard;
