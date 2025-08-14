"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Story {
  id: string;
  text: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [displayedStories, setDisplayedStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedAll, setHasLoadedAll] = useState(false);

  // Fetch all stories on first load
  useEffect(() => {
    fetchAllStories();
  }, []);

  const fetchAllStories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        const allStories: Story[] = data.messages.map(
          (msg: string, index: number) => ({
            id: `story-${index}`,
            text: msg,
            timestamp: new Date(),
          })
        );
        setStories(allStories);
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

  const showNextStory = () => {
    if (stories.length === 0) return;

    // Get remaining stories that haven't been displayed yet
    const remainingStories = stories.filter(
      (story) =>
        !displayedStories.some((displayed) => displayed.id === story.id)
    );

    if (remainingStories.length === 0) {
      // All stories have been shown, reset and start over
      setDisplayedStories([]);
      return;
    }

    // Pick a random story from remaining ones
    const randomIndex = Math.floor(Math.random() * remainingStories.length);
    const nextStory = remainingStories[randomIndex];

    setDisplayedStories((prev) => [...prev, nextStory]);
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Claudia&apos;s Stories
          </h1>
          <div className={styles.spacer}></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Chat Container */}
      <div className={styles.content}>
        <div className={styles.chatContainer}>
          {/* Stories Area */}
          <div className={styles.messagesArea}>
            {!hasLoadedAll ? (
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className={styles.emptyTitle}>
                  Loading Claudia&apos;s stories...
                </p>
                <p className={styles.emptySubtitle}>
                  Please wait while we gather her adventures
                </p>
              </div>
            ) : displayedStories.length === 0 ? (
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className={styles.emptyTitle}>Ready for stories!</p>
                <p className={styles.emptySubtitle}>
                  Click the button below to hear Claudia&apos;s adventures
                </p>
              </div>
            ) : (
              displayedStories.map((story) => (
                <div key={story.id} className={styles.messageContainer}>
                  <div className={styles.message}>
                    <p className={styles.messageText}>{story.text}</p>
                    <p className={styles.messageTime}>
                      {story.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingMessage}>
                  <div className={styles.loadingDots}>
                    <div className={styles.loadingDot}></div>
                    <div
                      className={styles.loadingDot}
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className={styles.loadingDot}
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className={styles.inputArea}>
            <div className={styles.inputGroup}>
              <button
                onClick={showNextStory}
                disabled={isLoading || !hasLoadedAll}
                className={styles.askButton}
              >
                <svg
                  className={styles.askIcon}
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
                <span>
                  {isLoading
                    ? "Loading stories..."
                    : "Tell me a story, Claudia!"}
                </span>
              </button>
            </div>
            <p className={styles.helpText}>
              Click the button to hear Claudia&apos;s stories one by one. Each
              story will appear only once until all have been told!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
