"use client";

interface LoadingSpinnerProps {
  isLoading: boolean;
}

export default function LoadingSpinner({ isLoading }: LoadingSpinnerProps) {
  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="text-center">
        <div className="animate-spin-reverse mb-4">
          <img
            src="/duck3.png"
            alt="Loading..."
            className="w-32 h-32 mx-auto"
          />
        </div>
        <p className="text-gray-700 text-xl font-semibold">Loading camera...</p>
      </div>
    </div>
  );
}
