import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import EnquiryPopup from '../components/common/EnquiryPopup';
import type { EnquiryIntent } from '../lib/trialEnquiry';

type EnquiryPopupContextValue = {
  openEnquiry: (intent: EnquiryIntent) => void;
};

const EnquiryPopupContext = createContext<EnquiryPopupContextValue | null>(null);

export function EnquiryPopupProvider({ children }: { children: React.ReactNode }) {
  const [intent, setIntent] = useState<EnquiryIntent | null>(null);

  const openEnquiry = useCallback((next: EnquiryIntent) => {
    setIntent(next);
  }, []);

  const close = useCallback(() => setIntent(null), []);

  const value = useMemo(() => ({ openEnquiry }), [openEnquiry]);

  return (
    <EnquiryPopupContext.Provider value={value}>
      {children}
      <EnquiryPopup intent={intent} onClose={close} />
    </EnquiryPopupContext.Provider>
  );
}

export function useEnquiryPopup(): EnquiryPopupContextValue {
  const context = useContext(EnquiryPopupContext);
  if (!context) {
    throw new Error('useEnquiryPopup must be used within EnquiryPopupProvider');
  }
  return context;
}
