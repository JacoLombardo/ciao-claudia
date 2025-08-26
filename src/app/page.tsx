"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import styles from "./page.module.css";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <LanguageSwitcher />

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t("greeting")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </div>

      {/* Cards Container */}
      <div className={styles.cardsContainer}>
        {/* Ask Claudia Card */}
        <Link href="/chat" className={styles.card}>
          <div className={styles.cardIcon}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className={styles.cardTitle}>{t("askClaudia")}</h2>
        </Link>

        {/* Take a Pic with Claudia Card */}
        <Link href="/camera" className={styles.card}>
          <div className={styles.cardIcon}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className={styles.cardTitle}>{t("takePic")}</h2>
        </Link>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>{t("madeWithLove")}</p>
      </div>
    </div>
  );
}
