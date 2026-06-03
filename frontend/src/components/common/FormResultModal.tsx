import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FormResultModal.scss";

export type FormResultType = "success" | "error";

interface FormResultModalProps {
  open: boolean;
  type: FormResultType;
  title: string;
  message: string;
  onClose: () => void;
}

const FormResultModal: React.FC<FormResultModalProps> = ({
  open,
  type,
  title,
  message,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="gdp-form-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            className={`gdp-form-modal gdp-form-modal--${type}`}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gdp-form-modal-title"
          >
            <div className="gdp-form-modal__glow" aria-hidden />
            <div className={`gdp-form-modal__icon gdp-form-modal__icon--${type}`}>
              {type === "success" ? (
                <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                  <path
                    d="M12 8v5M12 16h.01"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </div>
            <h3 id="gdp-form-modal-title" className="gdp-form-modal__title">
              {title}
            </h3>
            <p className="gdp-form-modal__message">{message}</p>
            <button type="button" className="gdp-form-modal__btn" onClick={onClose}>
              {type === "success" ? "Got it" : "Try again"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormResultModal;
