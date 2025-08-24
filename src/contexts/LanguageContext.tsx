"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "it";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation keys
const translations = {
  en: {
    // Landing page
    greeting: "Hello Claudia! 👋",
    askClaudia: "Ask Claudia",
    askClaudiaDesc: "Get a random story from Claudia about her day",
    takePic: "Take a Pic with Claudia",
    takePicDesc: "Take a photo with Claudia's silhouette",
    madeWithLove: "Made with ❤️ for Claudia",

    // Chat page
    claudiaStories: "Claudia's Stories",
    tellMeStory: "Tell me a story, Claudia!",
    loadingCamera: "Loading camera...",
    noStories: "No stories available",
    loading: "Loading...",

    // Camera page
    takePicWithClaudia: "Take a Pic with Claudia",
    backToHome: "Back to Home",
    switchCamera: "Switch Camera",
    takePhoto: "Take Photo",
    retake: "Retake",
    download: "Download",
    positionYourself:
      "Position yourself next to Claudia's photo and take a picture!",
    greatShot: "Great shot! You can download it or take another one.",

    // Common
    loading: "Loading...",
  },
  it: {
    // Landing page
    greeting: "Ciao Claudia! 👋",
    askClaudia: "Chiedi a Claudia",
    askClaudiaDesc: "Ricevi una storia casuale da Claudia sulla sua giornata",
    takePic: "Fai una Foto con Claudia",
    takePicDesc: "Scatta una foto con la silhouette di Claudia",
    madeWithLove: "Fatto con ❤️ per Claudia",

    // Chat page
    claudiaStories: "Le Storie di Claudia",
    tellMeStory: "Raccontami una storia, Claudia!",
    loadingCamera: "Caricamento fotocamera...",
    noStories: "Nessuna storia disponibile",
    loading: "Caricamento...",

    // Camera page
    takePicWithClaudia: "Fai una Foto con Claudia",
    backToHome: "Torna alla Home",
    switchCamera: "Cambia Fotocamera",
    takePhoto: "Scatta Foto",
    retake: "Riscatta",
    download: "Scarica",
    positionYourself:
      "Posizionati accanto alla foto di Claudia e scatta una foto!",
    greatShot: "Ottimo scatto! Puoi scaricarla o farne un'altra.",

    // Common
    loading: "Caricamento...",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
