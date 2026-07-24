import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    // App.jsx
    rescue: "Report",
    care: "Share",
    protect: "Help",
    thankYou: "Thank You!",
    supportThanks: "Your generous support helps us continue our mission.",
    cancelled: "Cancelled",
    paymentCancelled: "Your payment process was safely cancelled.",
    redirectingIn: "Redirecting in",
    rightsReserved: "Hesteka Micro-Entreprise. All rights reserved.",
    
    // PaymentPage.jsx - Intro
    helpRescueProtect: "Help us rescue & protect animals",
    contributionFuels: "Your contribution allows us to keep the app free and to provide concrete resources to the organizations that work every day on the ground for animals. 🐾",
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
    pay: "Pay",
    processing: "Processing...",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvv: "CVV",

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
    rescue: "Signale",
    care: "Partage",
    protect: "Aide",
    thankYou: "Merci !",
    supportThanks: "Votre généreux soutien nous aide à poursuivre notre mission.",
    cancelled: "Annulé",
    paymentCancelled: "Votre processus de paiement a été annulé en toute sécurité.",
    redirectingIn: "Redirection dans",
    rightsReserved: "Micro-Entreprise Hesteka. Tous droits réservés.",
    
    // PaymentPage.jsx - Intro
    helpRescueProtect: "Aidez-nous à sauver & protéger les animaux",
    contributionFuels: "Votre contribution nous permet de maintenir l'application gratuite et de donner des moyens d'action concrets aux associations qui œuvrent chaque jour sur le terrain pour les animaux. 🐾",
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
    pay: "Payer",
    processing: "Traitement...",
    cardNumber: "Numéro de carte",
    expiryDate: "Date d'expiration",
    cvv: "CVV",

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
  const [language, setLanguage] = useState(localStorage.getItem('language_pref') || 'fr');

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language_pref', lang);
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
