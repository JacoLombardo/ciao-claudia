"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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

  // Fetch all stories from the database
  const fetchAllStories = async () => {
    try {
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

  // Filter stories by current language
  const filteredStories = stories.filter(
    (story) => story.language === language
  );

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
          </>
        )}
      </div>
    </div>
  );
}
