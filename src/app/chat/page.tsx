"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./page.module.css";

interface Story {
  id: string;
  text: string;
  language: "en" | "it";
}

export default function ChatPage() {
  const { t, language } = useLanguage();
  const [stories, setStories] = useState<Story[]>([]);
  const [displayedStories, setDisplayedStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [hasLoadedAll, setHasLoadedAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all stories from the database
  const fetchAllStories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        setStories(data.messages || []);
        setHasLoadedAll(true);
      } else {
        console.error("Failed to fetch stories");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show the next story in random order without repetition
  const showNextStory = () => {
    // Filter stories by current language
    const filteredStories = stories.filter(
      (story) => story.language === language
    );

    if (filteredStories.length === 0) return;

    // If we've shown all stories, reset the displayed list
    if (displayedStories.length === 0) {
      // Create a shuffled copy of filtered stories
      const shuffled = [...filteredStories].sort(() => Math.random() - 0.5);
      setDisplayedStories(shuffled);
      setCurrentStoryIndex(0);
    } else {
      // Move to the next story
      setCurrentStoryIndex((prev) => (prev + 1) % displayedStories.length);
    }
  };

  // Fetch stories on component mount
  useEffect(() => {
    fetchAllStories();
  }, []);

  // Reset displayed stories when language changes
  useEffect(() => {
    setDisplayedStories([]);
    setCurrentStoryIndex(0);
  }, [language]);

  // Handle form submission
  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyText.trim()) return;

    setIsSubmitting(true);
    try {
      // EmailJS configuration
      const templateParams = {
        to_email: "your-email@example.com", // Replace with your email
        from_name: "Claudia Story Submission",
        message: storyText,
        language: language,
      };

      // You'll need to configure EmailJS with your service ID, template ID, and public key
      // For now, we'll use a simple fetch to your API endpoint
      const response = await fetch("/api/submit-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateParams),
      });

      if (response.ok) {
        const result = await response.json();
        setStoryText("");
        setShowForm(false);
        alert("Story submitted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit story");
      }
    } catch (error) {
      console.error("Error submitting story:", error);
      alert(
        `Failed to submit story: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter stories by current language
  const filteredStories = stories.filter(
    (story) => story.language === language
  );

  // Show loading spinner while fetching stories
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {t("claudiaStories")}
          </h1>
          <div className={styles.spacer}></div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {!hasLoadedAll ? (
          <p className={styles.loading}>{t("loading")}</p>
        ) : filteredStories.length === 0 ? (
          <p className={styles.noStories}>{t("noStories")}</p>
        ) : (
          <>
            {/* Story Display */}
            {displayedStories.length > 0 && (
              <div className={styles.storyCard}>
                <p className={styles.storyText}>
                  {displayedStories[currentStoryIndex]?.text}
                </p>
              </div>
            )}

            {/* Ask Button */}
            <button
              onClick={showNextStory}
              className={styles.askButton}
              disabled={filteredStories.length === 0}
            >
              {t("tellMeStory")}
            </button>

            {/* Email Link for More Stories */}
            <button
              onClick={() => setShowForm(true)}
              className={styles.emailLink}
            >
              {t("sendMoreStories")}
            </button>
          </>
        )}
      </div>

      {/* Story Submission Popup */}
      {showForm && (
        <div className={styles.popupOverlay} onClick={() => setShowForm(false)}>
          <div
            className={styles.popupForm}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.popupHeader}>
              <button
                onClick={() => setShowForm(false)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
            <p className={styles.popupDescription}>
              {t("storyPopupDescription")}
            </p>
            <form onSubmit={handleSubmitStory} className={styles.storyForm}>
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder={t("storyPlaceholder")}
                className={styles.storyTextarea}
                rows={6}
                required
              />
              <div className={styles.formButtons}>
                <button
                  type="submit"
                  disabled={isSubmitting || !storyText.trim()}
                  className={styles.submitButton}
                >
                  {isSubmitting ? "Sending..." : t("submitStory")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
