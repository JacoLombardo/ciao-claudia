"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Webcam from "react-webcam";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./page.module.css";

export default function CameraPage() {
  const webcamRef = useRef<Webcam>(null);
  const claudiaImageRef = useRef<HTMLImageElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start with loading false

  // Responsive video constraints - portrait for mobile, landscape for desktop
  const videoConstraints = {
    width: isMobile ? 720 : 1280, // Smaller width for mobile
    height: isMobile ? 1280 : 720, // Taller height for mobile
    facingMode: facingMode,
  };

  // Check if we're on mobile and update on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Debug loading state
  useEffect(() => {
    console.log("Loading state changed to:", isLoading);
  }, [isLoading]);

  // Handle camera loading state
  const handleUserMedia = useCallback(() => {
    console.log("Camera stream started");
    // Wait for the video element to actually show content
    const checkVideoReady = () => {
      const video = webcamRef.current?.video;
      if (video && video.readyState >= 2) {
        console.log("Video ready, turning off loading");
        setIsLoading(false);
      } else {
        setTimeout(checkVideoReady, 100);
      }
    };
    checkVideoReady();
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
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = `claudia-photo-${Date.now()}.jpg`;
      link.click();
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className={styles.container}>
      {/* Header */}
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
            Back to Home
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
            Take a Pic with Claudia
          </h1>
          <div className={styles.spacer}></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <LoadingSpinner isLoading={isLoading} />
      {!isLoading && (
        // Camera interface
        <div className={styles.content}>
          <div className={styles.cameraContainer}>
            {/* Camera View */}
            <div className={styles.cameraView}>
              {!capturedImage ? (
                <div className={styles.cameraView}>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className={styles.webcam}
                    onUserMedia={handleUserMedia}
                    onUserMediaError={handleUserMediaError}
                    onLoad={() => console.log("Webcam onLoad fired")}
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
                <div className={styles.buttonGroup}>
                  <button
                    onClick={toggleCamera}
                    className={styles.switchButton}
                  >
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
                    <span>Switch Camera</span>
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
                    <span>Take Photo</span>
                  </button>
                </div>
              ) : (
                <div className={styles.buttonGroup}>
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Retake</span>
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
                    <span>Download</span>
                  </button>
                </div>
              )}

              <p className={styles.helpText}>
                {!capturedImage
                  ? "Position yourself next to Claudia&apos;s photo and take a picture!"
                  : "Great shot! You can download it or take another one."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
