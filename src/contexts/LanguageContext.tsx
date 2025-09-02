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
    subtitle: "Choose what you'd like to do with Claudia today!",
    askClaudia: "Ask Claudia\na Story",
    askClaudiaDesc: "Get a random story from Claudia about her day",
    takePic: "Take a Pic\nwith Claudia",
    takePicDesc: "Take a photo with Claudia's silhouette",
    madeWithLove: "Made with ❤️ for Claudia",

    // Chat page
    claudiaStories: "Claudia's Stories",
    tellMeStory: "Tell me a story, Claudia!",
    loadingCamera: "Loading camera...",
    noStories: "No stories available",
    sendMoreStories: "Do you know one too?",
    submitStory: "Send Story",
    storyPlaceholder: "Write your story here...",
    closeForm: "Close",
    storyPopupDescription:
      "Do you know another story about Claudia and would you like to tell us? Write it below and send it!",

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

    // Gallery page
    gallery: "Gallery",
    backToCamera: "Back To Camera",
    saveToGallery: "Save to Gallery",
    saveToGalleryConfirm:
      "Would you like to save the photo\nto the app's gallery?",
    yes: "Yes",
    no: "No",
    saving: "Saving...",
    saved: "Saved!",
    error: "Error",
    noPhotos: "No photos in gallery yet",
    takeFirstPhoto: "Take your first photo with Claudia!",
    retry: "Retry",
    close: "Close",
    previous: "Previous",
    next: "Next",

    // Common
    loading: "Loading...",
  },
  it: {
    // Landing page
    greeting: "Ciao Claudia! 👋",
    subtitle: "Scegli cosa vuoi fare con Claudia oggi!",
    askClaudia: "Chiedi a Claudia\nuna Storia",
    askClaudiaDesc: "Ricevi una storia casuale da Claudia sulla sua giornata",
    takePic: "Fai una Foto\ncon Claudia",
    takePicDesc: "Scatta una foto con la silhouette di Claudia",
    madeWithLove: "Fatto con ❤️ per Claudia",

    // Chat page
    claudiaStories: "Le Storie di Claudia",
    tellMeStory: "Raccontami una storia, Claudia!",
    loadingCamera: "Caricamento fotocamera...",
    noStories: "Nessuna storia disponibile",
    sendMoreStories: "Ne conosci una anche te?",
    submitStory: "Invia Storia",
    storyPlaceholder: "Scrivi la tua storia qui...",
    closeForm: "Chiudi",
    storyPopupDescription:
      "Conosci un'altra storia di Claudia e vorresti raccontarcela? Scrivi qua sotto ed inviala!",

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

    // Gallery page
    gallery: "Galleria",
    backToCamera: "Torna Alla Fotocamera",
    saveToGallery: "Salva in Galleria",
    saveToGalleryConfirm: "Vuoi salvare la foto\nnella galleria dell'app?",
    yes: "Sì",
    no: "No",
    saving: "Salvataggio...",
    saved: "Salvato!",
    error: "Errore",
    noPhotos: "Nessuna foto in galleria ancora",
    takeFirstPhoto: "Scatta la tua prima foto con Claudia!",
    retry: "Riprova",
    close: "Chiudi",
    previous: "Precedente",
    next: "Successivo",

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
