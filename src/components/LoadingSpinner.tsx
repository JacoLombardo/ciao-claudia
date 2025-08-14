"use client";

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
          <img src="/duck3.png" alt="Loading..." className={styles.image} />
        </div>
        <p className={styles.text}>Loading camera...</p>
      </div>
    </div>
  );
}
