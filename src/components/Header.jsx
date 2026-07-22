import React from "react";
import { useLanguage } from "../LanguageContext";

export default function Header() {
  const { t, language, toggleLanguage } = useLanguage();
  const headingFont = { fontFamily: '\"Barlow Condensed\", sans-serif' };

  return (
    <header className="relative z-20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-b border-white/10 bg-[#a44026]">
      <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between relative z-10">
        {/* Logo area */}
        <a
          href={import.meta.env.VITE_HESTEKA_WEBSITE_URL}
          target="_blank"
          className="flex items-center justify-center transition-transform duration-500 hover:scale-105 hover:-translate-y-0.5 cursor-pointer"
        >
          <img
            src="/hestekalogo.png"
            alt="Hesteka Logo"
            className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
          />
        </a>

        {/* Decorative Tagline & Lang Toggle */}
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 relative z-20">
          <div
            className="flex items-center gap-3 sm:gap-6 text-white/95 text-sm sm:text-base tracking-[0.25em] uppercase"
            style={headingFont}
          >
            <span className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all cursor-default transform hover:scale-110">
              {t("rescue")}
            </span>
            <span className="text-[#facc15] opacity-90 animate-pulse text-[10px] sm:text-xs">
              ◆
            </span>
            <span className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all cursor-default transform hover:scale-110">
              {t("care")}
            </span>
            <span
              className="text-[#facc15] opacity-90 animate-pulse text-[10px] sm:text-xs"
              style={{ animationDelay: "0.5s" }}
            >
              ◆
            </span>
            <span className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all cursor-default transform hover:scale-110">
              {t("protect")}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full border border-white/10 mt-2 sm:mt-0">
            <button
              onClick={() => toggleLanguage("en")}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${language === "en" ? "bg-white text-[#C2512F] shadow-sm" : "text-white hover:bg-white/20"}`}
            >
              EN
            </button>
            <button
              onClick={() => toggleLanguage("fr")}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${language === "fr" ? "bg-white text-[#C2512F] shadow-sm" : "text-white hover:bg-white/20"}`}
            >
              FR
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
