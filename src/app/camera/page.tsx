"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Webcam from "react-webcam";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./page.module.css";

export default function CameraPage() {
  const { t } = useLanguage();
  const webcamRef = useRef<Webcam>(null);
  const claudiaImageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastIsPortraitRef = useRef<boolean | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const initializedAtRef = useRef<number | null>(null);
  const [lockedConstraints, setLockedConstraints] =
    useState<MediaTrackConstraints | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const lastScrollY = useRef(0);
  const isMobileRef = useRef(false);

  // Set initial header visibility based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileScreen = window.innerWidth < 768;
      isMobileRef.current = isMobileScreen;
      // Header is always visible on the page
      setIsHeaderVisible(true);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Scroll to camera position on mobile page load
  useEffect(() => {
    const scrollToCamera = () => {
      if (isMobileRef.current) {
        // Wait a bit for the page to load, then scroll to camera
        setTimeout(() => {
          const cameraElement = document.querySelector(
            "[data-camera-container]"
          );
          if (cameraElement) {
            // Get the header height and camera position
            const header = document.querySelector(`.${styles.header}`);
            const headerHeight = header
              ? (header as HTMLElement).offsetHeight
              : 0;
            const cameraTop = (cameraElement as HTMLElement).offsetTop;

            // Calculate halfway point between header end and camera start
            const halfwayPoint = headerHeight + (cameraTop - headerHeight) / 2;

            // Scroll to the halfway point
            window.scrollTo({
              top: halfwayPoint,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    };

    scrollToCamera();
  }, []);

  // Show loading spinner for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Choose constraints once and lock to avoid flapping
  const useMobileLayout = isMobile;
  const videoConstraints = {
    ...(lockedConstraints || {
      width: useMobileLayout ? 1280 : isPortrait ? 720 : 1280,
      height: useMobileLayout ? 720 : isPortrait ? 1280 : 720,
      aspectRatio: useMobileLayout ? 16 / 9 : isPortrait ? 3 / 4 : 16 / 9,
    }),
    facingMode: facingMode, // Always use current facingMode
  };

  // Update locked constraints when facingMode changes
  useEffect(() => {
    if (lockedConstraints) {
      setLockedConstraints({
        ...lockedConstraints,
        facingMode: facingMode,
      });
    }
  }, [facingMode]); // Remove lockedConstraints from dependencies

  // Container-based orientation detection (works on mobile and resize)
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateFromContainer = () => {
      const rect = element.getBoundingClientRect();
      const ratio = rect.height / Math.max(1, rect.width);
      // Hysteresis to avoid flapping around ~1.0
      let nextIsPortrait = lastIsPortraitRef.current ?? ratio >= 1.0;
      if (ratio > 1.05) nextIsPortrait = true;
      if (ratio < 0.95) nextIsPortrait = false;

      // Debounce rapid updates
      const apply = () => {
        if (lastIsPortraitRef.current !== nextIsPortrait) {
          lastIsPortraitRef.current = nextIsPortrait;
          setIsPortrait(nextIsPortrait);
        }
        setIsMobile(rect.width < 768);

        // Lock constraints on first apply only
        if (!lockedConstraints) {
          const mobile = rect.width < 768;
          const initialConstraints: MediaTrackConstraints = mobile
            ? { width: 1280, height: 720, aspectRatio: 16 / 9, facingMode }
            : nextIsPortrait
            ? { width: 720, height: 1280, aspectRatio: 3 / 4, facingMode }
            : { width: 1280, height: 720, aspectRatio: 16 / 9, facingMode };
          setLockedConstraints(initialConstraints);
        }
      };

      if (initializedAtRef.current === null) {
        initializedAtRef.current = Date.now();
        apply();
      } else {
        if (debounceTimerRef.current)
          window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = window.setTimeout(apply, 120);
      }
    };

    // Initial measure
    updateFromContainer();

    const ro = new ResizeObserver(() => updateFromContainer());
    ro.observe(element);

    return () => {
      if (debounceTimerRef.current)
        window.clearTimeout(debounceTimerRef.current);
      ro.disconnect();
    };
  }, []);

  // Debug loading state
  useEffect(() => {
    console.log("Loading state changed to:", isLoading);
  }, [isLoading]);

  // Handle camera loading state
  const handleUserMedia = useCallback(() => {
    console.log("Camera stream started");
    // Keep spinner timing independent so camera can mount behind it
  }, []);

  const handleUserMediaError = useCallback(() => {
    console.log("Camera error - turning off loading");
    setIsLoading(false);
    console.error("Failed to access camera");
  }, []);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) return; // Exit if no screenshot was captured

      // Create a canvas to merge the camera image with Claudia's photo
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Load the camera image using native browser Image constructor
        const cameraImg = new window.Image();
        cameraImg.onload = () => {
          // Set canvas size to match camera image
          canvas.width = cameraImg.width;
          canvas.height = cameraImg.height;

          // Draw the camera image
          ctx.drawImage(cameraImg, 0, 0);

          // Load and draw Claudia's photo using native browser Image constructor
          const claudiaImg = new window.Image();
          claudiaImg.onload = () => {
            // Get the actual rendered width of the Claudia image using the ref
            let claudiaWidth = 500; // fallback

            if (claudiaImageRef.current) {
              claudiaWidth = claudiaImageRef.current.offsetWidth;
              console.log("Claudia image ref width:", claudiaWidth);
            }

            const claudiaHeight =
              (claudiaImg.height / claudiaImg.width) * claudiaWidth;

            // Debug logging
            console.log("Claudia width:", claudiaWidth);
            console.log("Camera image width:", cameraImg.width);
            console.log("Camera image height:", cameraImg.height);
            console.log("Is mobile:", isMobile);

            // Get the actual position of the Claudia image element
            let claudiaX = 0;
            const claudiaY = cameraImg.height - claudiaHeight; // Bottom

            if (claudiaImageRef.current) {
              const rect = claudiaImageRef.current.getBoundingClientRect();
              const webcamRect =
                webcamRef.current?.video?.getBoundingClientRect();

              if (webcamRect) {
                // Calculate the relative position within the webcam image
                claudiaX = rect.left - webcamRect.left;
                console.log(
                  "Claudia position - left:",
                  claudiaX,
                  "webcam left:",
                  webcamRect.left,
                  "claudia left:",
                  rect.left
                );
              } else {
                // Fallback: use percentage-based positioning (35% from center)
                const centerX = cameraImg.width / 2;
                claudiaX = centerX + cameraImg.width * 0.35 - claudiaWidth / 2;
              }
            }

            // Draw Claudia's photo
            ctx.drawImage(
              claudiaImg,
              claudiaX,
              claudiaY,
              claudiaWidth,
              claudiaHeight
            );

            // Convert canvas to data URL
            const mergedImageSrc = canvas.toDataURL("image/jpeg", 0.9);
            setCapturedImage(mergedImageSrc);
          };
          claudiaImg.src = "/claudia.png";
        };
        cameraImg.src = imageSrc;
      }
    }
  }, [webcamRef, isMobile]);

  const retake = () => {
    setCapturedImage(null);
  };

  const downloadImage = () => {
    if (capturedImage) {
      // Use Web Share API on mobile for better quality and camera roll access
      if (navigator.share && isMobile) {
        // Convert data URL to blob for better sharing
        fetch(capturedImage)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], `claudia-photo-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });

            navigator
              .share({
                files: [file],
                title: "Photo with Claudia",
                text: "Check out this photo I took with Claudia!",
              })
              .catch((err) => {
                console.log("Share failed, falling back to download:", err);
                // Fallback to regular download
                const link = document.createElement("a");
                link.href = capturedImage;
                link.download = `claudia-photo-${Date.now()}.jpg`;
                link.click();
              });
          });
      } else {
        // Fallback for desktop or when Web Share API not available
        const link = document.createElement("a");
        link.href = capturedImage;
        link.download = `claudia-photo-${Date.now()}.jpg`;
        link.click();
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => {
      const newMode = prev === "user" ? "environment" : "user";
      console.log(`Switching camera from ${prev} to ${newMode}`);
      return newMode;
    });
  };

  return (
    <div className={styles.container}>
      <LanguageSwitcher />

      {/* Header - positioned above viewport */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backLink}>
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
            {t("backToHome")}
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
          </h1>
          <div className={styles.spacer}></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <LoadingSpinner isLoading={isLoading} />
      {/* Camera interface renders immediately; spinner overlays it */}
      <div className={styles.content}>
        <div
          className={styles.cameraContainer}
          ref={containerRef}
          data-camera-container
        >
          {/* Camera View */}
          <div
            className={`${styles.cameraView} ${
              useMobileLayout ? styles.cameraViewMobile : ""
            }`}
          >
            {!capturedImage ? (
              <div className={styles.cameraView}>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className={styles.webcam}
                  mirrored={facingMode === "user"}
                  playsInline
                  onUserMedia={handleUserMedia}
                  onUserMediaError={handleUserMediaError}
                  key={`webcam-${facingMode}`} // Force re-initialization when camera changes
                />

                {/* Claudia's Photo Overlay for preview */}
                <div className={styles.overlayContainer}>
                  <div
                    className={styles.claudiaContainer}
                    style={{ marginLeft: "35%" }}
                  >
                    <Image
                      ref={claudiaImageRef}
                      src="/claudia.png"
                      alt="Claudia"
                      width={500}
                      height={750}
                      className={styles.claudiaImage}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.cameraView}>
                <Image
                  src={capturedImage}
                  alt="Captured photo with Claudia"
                  width={1280}
                  height={720}
                  className={styles.capturedImage}
                />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            {!capturedImage ? (
              <div className={styles.buttonRow}>
                <button onClick={toggleCamera} className={styles.switchButton}>
                  <svg
                    className={styles.switchIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>

                <button onClick={capture} className={styles.captureButton}>
                  <svg
                    className={styles.captureIcon}
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
                </button>

                <button aria-hidden="true" className={styles.spacerButton} />
              </div>
            ) : (
              <div className={styles.secondaryRow}>
                <button onClick={retake} className={styles.retakeButton}>
                  <svg
                    className={styles.retakeIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                </button>

                <button
                  onClick={downloadImage}
                  className={styles.downloadButton}
                >
                  <svg
                    className={styles.downloadIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>

                <button aria-hidden="true" className={styles.spacerButton} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
