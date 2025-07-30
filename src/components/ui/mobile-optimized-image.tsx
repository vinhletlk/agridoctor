"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2, ZoomIn, Download, Share2 } from "lucide-react";
import { Button } from "./button";

interface MobileOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  showActions?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function MobileOptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  priority = false,
  showActions = false,
  onLoad,
  onError,
}: MobileOptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
    onError?.();
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hình ảnh từ AgriDoctor',
          text: alt,
          url: src,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(src);
        // You could show a toast here
      } catch (error) {
        console.error('Copy failed:', error);
      }
    }
  };

  if (isError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted rounded-lg",
        className
      )}>
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-muted-foreground text-lg">!</span>
          </div>
          <p className="text-sm text-muted-foreground">Không thể tải hình ảnh</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        ref={imageRef}
        className={cn(
          "relative overflow-hidden rounded-lg bg-muted",
          isZoomed && "fixed inset-0 z-50 bg-black/90 flex items-center justify-center",
          className
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}
        
        <Image
          src={src}
          alt={alt}
          width={isZoomed ? 800 : width}
          height={isZoomed ? 600 : height}
          className={cn(
            "transition-all duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            isZoomed ? "max-w-full max-h-full object-contain" : "w-full h-full object-cover",
            "hover:scale-105"
          )}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
        />

        {showActions && !isLoading && !isError && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleZoom}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isZoomed && (
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4 h-10 w-10 p-0 bg-white/90 hover:bg-white"
            onClick={handleZoom}
          >
            <span className="text-lg">×</span>
          </Button>
        )}
      </div>
    </div>
  );
} 