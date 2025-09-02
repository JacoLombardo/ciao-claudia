"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./FullScreenGallery.module.css";

interface GalleryImage {
  id: string;
  url: string;
  createdAt: string;
}

interface FullScreenGalleryProps {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function FullScreenGallery({
  images,
  initialIndex,
  onClose,
}: FullScreenGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goToPrevious, goToNext]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const currentImage = images[currentIndex];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={handleImageClick}>
        {/* Close button */}
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button className={styles.navButton} onClick={goToPrevious}>
              <svg
                className={styles.navIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button className={styles.navButton} onClick={goToNext}>
              <svg
                className={styles.navIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image */}
        <div className={styles.imageContainer}>
          <Image
            src={currentImage.url}
            alt="Gallery photo with Claudia"
            fill
            className={styles.fullScreenImage}
            sizes="100vw"
            priority
          />
        </div>

        {/* Image info */}
        <div className={styles.imageInfo}>
          <span className={styles.imageDate}>
            {new Date(currentImage.createdAt).toLocaleDateString()}
          </span>
          <span className={styles.imageCounter}>
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}
