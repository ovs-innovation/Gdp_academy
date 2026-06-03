import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/app-preloader.css';

export type AppPreloaderVariant = 'default' | 'session';

type Props = {
  variant?: AppPreloaderVariant;
};

const STATUS_COPY: Record<AppPreloaderVariant, string> = {
  default: 'Loading',
  session: 'Authenticating',
};

const ease = [0.22, 1, 0.36, 1] as const;

const AppPreloader: React.FC<Props> = ({ variant = 'default' }) => (
  <div className="app-preloader" role="status" aria-live="polite" aria-busy="true">
    <div className="app-preloader__ambient" aria-hidden />

    <motion.div
      className="app-preloader__inner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease }}
    >
      <motion.div
        className="app-preloader__brand"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.04, ease }}
      >
        <img src="/logo.png" alt="" className="app-preloader__logo" width={88} height={88} />

        <div className="app-preloader__lockup">
          <div className="app-preloader__site-text">
            <span>Garima</span>
            <span>Dance</span>
            <span>Productions</span>
          </div>
          <p className="app-preloader__studio-mark">
            <span>GDP</span>
            <span className="app-preloader__studio-mark-accent">Studio</span>
          </p>
        </div>
      </motion.div>

      <motion.div
        className="app-preloader__loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35, ease }}
        aria-hidden
      >
        <div className="app-preloader__bar">
          <span className="app-preloader__bar-indeterminate" />
        </div>
        <p className="app-preloader__status">{STATUS_COPY[variant]}</p>
      </motion.div>
    </motion.div>
  </div>
);

export default AppPreloader;
