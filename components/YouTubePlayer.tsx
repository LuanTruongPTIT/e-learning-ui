"use client";

import { useEffect, useRef } from "react";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  onComplete?: () => void;
  autoMarkComplete?: boolean;
  autoMarkCompleteThreshold?: number;
  lectureId?: string;
  onProgressUpdate?: (
    watchPosition: number,
    progressPercentage: number
  ) => void;
}

// Helper function to extract YouTube video ID from URL
export const extractYouTubeVideoId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Helper function to check if URL is a YouTube URL
export const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

export default function YouTubePlayer({
  videoId,
  title,
  onComplete,
  autoMarkComplete = true,
  autoMarkCompleteThreshold = 80,
  lectureId,
  onProgressUpdate,
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${
          typeof window !== "undefined" ? window.location.origin : ""
        }`}
        title={title}
        style={{ border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />

      {/* Simple overlay for title */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <h2 className="text-white font-medium truncate">{title}</h2>
      </div>
    </div>
  );
}

// Declare YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
