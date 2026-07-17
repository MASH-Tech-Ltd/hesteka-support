import React from 'react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function PaymentSuccess() {
  const { t } = useLanguage();
  const headingFont = { fontFamily: '"Lilita One", cursive' };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full animate-fade-in p-4">
      <div className="bg-white p-10 md:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col items-center" style={{ borderRadius: '2rem', border: '1px solid #ebd8c3', width: '100%', maxWidth: '32rem' }}>
        <div className="absolute top-0 left-0 right-0 h-2 bg-green-500"></div>
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle2 size={50} className="text-green-500" strokeWidth={2} />
        </div>
        <h2 className="text-3xl md:text-4xl text-green-600 mb-4 uppercase tracking-wider drop-shadow-sm" style={headingFont}>{t('thankYou')}</h2>
        <p className="text-base md:text-lg font-medium opacity-75 mb-8 text-[#3a2a1a]">{t('supportThanks')}</p>
        <a href="/checkout" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#C2512F] text-white rounded-full font-bold hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto">
          <ArrowLeft size={20} /> {t('returnHome')}
        </a>
      </div>
    </div>
  );
}
