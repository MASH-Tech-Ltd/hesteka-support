import React from 'react';
import { useLanguage } from '../LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-3 text-center text-xs font-semibold opacity-50 mt-auto" style={{ borderTop: '1px solid #ebd8c3' }}>
      &copy; {new Date().getFullYear()} {t('rightsReserved')}
    </footer>
  );
}
