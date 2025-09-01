"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./PhotoConfirmationModal.module.css";

interface PhotoConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  imageSrc: string;
  isUploading?: boolean;
}

export default function PhotoConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  imageSrc,
  isUploading = false,
}: PhotoConfirmationModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{t("saveToGallery")}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <svg
              className={styles.closeIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img
              src={imageSrc}
              alt="Captured photo"
              className={styles.previewImage}
            />
          </div>

          <p className={styles.question}>{t("addToGalleryQuestion")}</p>

          <div className={styles.buttons}>
            <button
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={isUploading}
            >
              {t("no")}
            </button>
            <button
              className={styles.confirmButton}
              onClick={onConfirm}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinner}></div>
                  {t("saving")}
                </div>
              ) : (
                t("yes")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
