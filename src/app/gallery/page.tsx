"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LoadingSpinner from "@/components/LoadingSpinner";
import FullScreenGallery from "@/components/FullScreenGallery";
import styles from "./page.module.css";

interface GalleryImage {
  id: string;
  url: string;
  createdAt: string;
}

export default function GalleryPage() {
  const { t } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullScreenIndex, setFullScreenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/gallery");
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const openFullScreen = (index: number) => {
    setFullScreenIndex(index);
  };

  const closeFullScreen = () => {
    setFullScreenIndex(null);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LanguageSwitcher />
        <LoadingSpinner isLoading={true} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <LanguageSwitcher />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/camera" className={styles.backLink}>
            <svg
              className={styles.backIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("backToCamera")}
          </Link>
          <h1 className={styles.title}>
            <svg
              className={styles.titleIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {t("gallery")}
          </h1>
          <div className={styles.spacer}></div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {error && (
          <div className={styles.errorMessage}>
            <p>
              {t("error")}: {error}
            </p>
          </div>
        )}

        {images.length === 0 && !error ? (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2>{t("noPhotos")}</h2>
            <p>{t("takeFirstPhoto")}</p>
            <Link href="/camera" className={styles.cameraLink}>
              <svg
                className={styles.cameraIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              {t("takePicWithClaudia")}
            </Link>
          </div>
        ) : (
          <div className={styles.galleryGrid}>
            {images.map((image, index) => (
              <div key={image.id} className={styles.imageCard}>
                <div
                  className={styles.imageContainer}
                  onClick={() => openFullScreen(index)}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={image.url}
                    alt="Gallery photo with Claudia"
                    fill
                    className={styles.galleryImage}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />

                  <span className={styles.imageDate}>
                    {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Screen Gallery */}
      {fullScreenIndex !== null && (
        <FullScreenGallery
          images={images}
          initialIndex={fullScreenIndex}
          onClose={closeFullScreen}
        />
      )}
    </div>
  );
}
