"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  isLoading: boolean;
}

export default function LoadingSpinner({ isLoading }: LoadingSpinnerProps) {
  const { t } = useLanguage();

  if (!isLoading) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.spinner}>
          <Image
            src="/claudia-duck.png"
            alt="Loading..."
            width={192}
            height={192}
            className={styles.image}
          />
        </div>
        <p className={styles.text}>{t("loading")}</p>
      </div>
    </div>
  );
}
