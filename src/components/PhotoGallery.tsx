"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import LoadingSpinner from "./LoadingSpinner";
import styles from "./PhotoGallery.module.css";

interface Photo {
  id: string;
  url: string;
  createdAt: string;
}

export default function PhotoGallery() {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/photos");
      const data = await response.json();

      if (response.ok) {
        setPhotos(data.photos || []);
      } else {
        setError(data.error || "Failed to load photos");
      }
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Failed to load photos");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.loadingContainer}>
          <LoadingSpinner isLoading={true} />
          <p className={styles.loadingText}>{t("loadingPhotos")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <button onClick={fetchPhotos} className={styles.retryButton}>
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className={styles.emptyIconSvg}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>{t("noPhotosYet")}</h3>
          <p className={styles.emptyText}>{t("noPhotosDescription")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryHeader}>
        <h2 className={styles.galleryTitle}>{t("photoGallery")}</h2>
        <p className={styles.photoCount}>
          {photos.length} {photos.length === 1 ? t("photo") : t("photos")}
        </p>
      </div>

      <div className={styles.photoGrid}>
        {photos.map((photo) => (
          <div key={photo.id} className={styles.photoCard}>
            <div className={styles.photoContainer}>
              <Image
                src={photo.url}
                alt="Photo with Claudia"
                fill
                className={styles.photo}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            <div className={styles.photoInfo}>
              <p className={styles.photoDate}>{formatDate(photo.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
