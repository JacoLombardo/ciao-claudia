"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "it" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className={styles.languageButton}
      title={language === "en" ? "Cambia in Italiano" : "Switch to English"}
    >
      {language === "en" ? "🇮🇹" : "🇺🇸"}
    </button>
  );
}
