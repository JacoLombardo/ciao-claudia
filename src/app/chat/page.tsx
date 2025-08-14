"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessageFromDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        const newMessage: Message = {
          id: Date.now().toString(),
          text: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      } else {
        console.error("Failed to fetch message");
      }
    } catch (error) {
      console.error("Error fetching message:", error);
    } finally {
      setIsLoading(false);
    }
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
            Ask Claudia
          </h1>
          <div className={styles.spacer}></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Chat Container */}
      <div className={styles.content}>
        <div className={styles.chatContainer}>
          {/* Messages Area */}
          <div className={styles.messagesArea}>
            {messages.length === 0 ? (
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
                <p className={styles.emptyTitle}>No responses yet</p>
                <p className={styles.emptySubtitle}>
                  Click the button below to ask Claudia what she did today!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={styles.messageContainer}>
                  <div className={styles.message}>
                    <p className={styles.messageText}>{message.text}</p>
                    <p className={styles.messageTime}>
                      {message.timestamp.toLocaleTimeString()}
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
                onClick={fetchMessageFromDatabase}
                disabled={isLoading}
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
                    ? "Claudia sta pensando..."
                    : "Che hai fatto oggi Claudia?"}
                </span>
              </button>
            </div>
            <p className={styles.helpText}>
              Click the button to ask Claudia what she did today and get a
              random response from her database
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
