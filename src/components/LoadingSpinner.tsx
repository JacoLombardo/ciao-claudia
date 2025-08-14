"use client";

import Image from "next/image";
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  isLoading: boolean;
}

export default function LoadingSpinner({ isLoading }: LoadingSpinnerProps) {
  if (!isLoading) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.spinner}>
          <Image
            src="/duck3.png"
            alt="Loading..."
            width={128}
            height={128}
            className={styles.image}
          />
        </div>
        <p className={styles.text}>Loading camera...</p>
      </div>
    </div>
  );
}
