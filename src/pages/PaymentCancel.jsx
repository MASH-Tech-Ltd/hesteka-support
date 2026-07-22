import React, { useState, useEffect } from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const headingFont = { fontFamily: '\"Barlow Condensed\", sans-serif' };

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/checkout');
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full animate-fade-in p-4">
      <div className="bg-white p-10 md:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col items-center" style={{ borderRadius: '2rem', border: '1px solid #ebd8c3', width: '100%', maxWidth: '32rem' }}>
        <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <XCircle size={50} className="text-red-500" strokeWidth={2} />
        </div>
        <h2 className="text-3xl md:text-4xl text-red-600 mb-4 uppercase tracking-wider drop-shadow-sm" style={headingFont}>{t('cancelled')}</h2>
        <p className="text-base md:text-lg font-medium opacity-75 mb-6 text-[#3a2a1a]">{t('paymentCancelled')}</p>
        <a href="/checkout" className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#ebd8c3] text-[#3a2a1a] rounded-full font-bold hover:bg-gray-50 hover:-translate-y-1 transition-all w-full sm:w-auto mb-4">
          <ArrowLeft size={20} /> {t('returnHome')}
        </a>
        <p className="text-sm font-semibold text-[#3a2a1a] opacity-60">
          {t('redirectingIn')} {countdown}s...
        </p>
      </div>
    </div>
  );
}
