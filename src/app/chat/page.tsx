"use client";

import { useState } from "react";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
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
          <h1 className="text-2xl font-bold text-purple-800 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
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
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-300"
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
                <p className="text-lg">No responses yet</p>
                <p className="text-sm">
                  Click the button below to ask Claudia what she did today!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex justify-start">
                  <div className="bg-purple-100 rounded-2xl px-4 py-3 max-w-xs lg:max-w-md">
                    <p className="text-gray-800">{message.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-purple-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchMessageFromDatabase}
                disabled={isLoading}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
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
            <p className="text-sm text-gray-500 mt-3 text-center">
              Click the button to ask Claudia what she did today and get a
              random response from her database
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
