import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    // App.jsx
    rescue: "Rescue",
    care: "Care",
    protect: "Protect",
    thankYou: "Thank You!",
    supportThanks: "Your generous support helps us continue our mission.",
    cancelled: "Cancelled",
    paymentCancelled: "Your payment process was safely cancelled.",
    rightsReserved: "Hesteka Association. All rights reserved.",
    
    // PaymentPage.jsx - Intro
    helpRescueProtect: "Help Us Rescue & Protect Animals",
    contributionFuels: "Your contribution fuels our community-driven ecosystem dedicated to animal welfare. Every donation empowers everyday heroes on the ground.",
    urgentRescue: "Urgent Rescue",
    urgentRescueDesc: "Funding emergency local rescue missions.",
    animalTracking: "Animal Tracking",
    animalTrackingDesc: "Supporting real-time community reporting.",
    communityCare: "Community Care",
    communityCareDesc: "Providing continuous protection and shelter.",
    
    // PaymentPage.jsx - Form
    selectAmount: "SELECT AMOUNT",
    manualInput: "Manual Input field",
    yourDetails: "YOUR DETAILS",
    fullName: "Full Name",
    emailAddress: "Email Address",
    paymentMethod: "PAYMENT METHOD",
    securelyPayWith: "Securely Pay With",
    supportNow: "SUPPORT NOW",
    cancel: "Cancel",
    completePayment: "Complete Payment",
    secureStripe: "Secure credit card payment via Stripe",
    securePayPal: "Secure payment via PayPal",
    donationText: "Donation",

    // Errors
    failedInitiate: "Failed to initiate payment",
    failedPayPalOrder: "Failed to create PayPal order",
    paymentCaptureFailed: "Payment capture failed.",
    paypalError: "PayPal encountered an error.",
    somethingWentWrong: "Something went wrong. Please try again.",
    returnHome: "Return Home",
    pageNotFound: "Page Not Found",
    pageNotFoundDesc: "The page you are looking for does not exist or has been moved."
  },
  fr: {
    // App.jsx
    rescue: "Sauver",
    care: "Soigner",
    protect: "Protéger",
    thankYou: "Merci !",
    supportThanks: "Votre généreux soutien nous aide à poursuivre notre mission.",
    cancelled: "Annulé",
    paymentCancelled: "Votre processus de paiement a été annulé en toute sécurité.",
    rightsReserved: "Association Hesteka. Tous droits réservés.",
    
    // PaymentPage.jsx - Intro
    helpRescueProtect: "Aidez-Nous à Sauver & Protéger les Animaux",
    contributionFuels: "Votre contribution alimente notre écosystème communautaire dédié au bien-être animal. Chaque don donne des moyens d'action aux héros de tous les jours sur le terrain.",
    urgentRescue: "Sauvetage Urgent",
    urgentRescueDesc: "Financement des missions d'urgence de sauvetage local.",
    animalTracking: "Suivi des Animaux",
    animalTrackingDesc: "Soutien aux signalements communautaires en temps réel.",
    communityCare: "Soins Communautaires",
    communityCareDesc: "Fourniture continue de protection et de refuge.",
    
    // PaymentPage.jsx - Form
    selectAmount: "CHOISIR LE MONTANT",
    manualInput: "Champ de saisie manuelle",
    yourDetails: "VOS COORDONNÉES",
    fullName: "Nom Complet",
    emailAddress: "Adresse Email",
    paymentMethod: "MÉTHODE DE PAIEMENT",
    securelyPayWith: "Payez en toute sécurité avec",
    supportNow: "SOUTENIR MAINTENANT",
    cancel: "Annuler",
    completePayment: "Finaliser le Paiement",
    secureStripe: "Paiement sécurisé par carte de crédit via Stripe",
    securePayPal: "Paiement sécurisé via PayPal",
    donationText: "Don",

    // Errors
    failedInitiate: "Échec de l'initiation du paiement",
    failedPayPalOrder: "Échec de la création de la commande PayPal",
    paymentCaptureFailed: "Échec de la capture du paiement.",
    paypalError: "PayPal a rencontré une erreur.",
    somethingWentWrong: "Un problème est survenu. Veuillez réessayer.",
    returnHome: "Retour à l'accueil",
    pageNotFound: "Page introuvable",
    pageNotFoundDesc: "La page que vous recherchez n'existe pas ou a été déplacée."
  }
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    document.title = language === 'fr' ? 'Soutenir Hesteka' : 'Support Hesteka';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
