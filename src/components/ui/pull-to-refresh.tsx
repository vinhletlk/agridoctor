"use client";

import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
  threshold?: number;
  disabled?: boolean;
}

export function PullToRefresh({
  children,
  onRefresh,
  className,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    if (disabled) return;

    let startY = 0;
    let currentY = 0;
    let isScrolledToTop = true;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isScrolledToTop = window.scrollY === 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolledToTop || isRefreshing) return;
      
      currentY = e.touches[0].clientY;
      const distance = Math.max(0, (currentY - startY) * 0.5); // Reduce pull distance
      
      if (distance > 5) {
        e.preventDefault();
        setIsPulling(true);
        setPullDistance(Math.min(distance, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > threshold && !isRefreshing) {
        setIsRefreshing(true);
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setIsPulling(false);
      setPullDistance(0);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, onRefresh, pullDistance, threshold, isRefreshing]);

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = pullDistance > threshold;

  return (
    <div className={cn("relative", className)}>
      {/* Pull to refresh indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 z-50 flex items-center justify-center",
          "bg-white/90 backdrop-blur-sm border-b border-gray-200",
          "transition-all duration-300 ease-out",
          isPulling || isRefreshing ? "opacity-100" : "opacity-0"
        )}
        style={{
          height: `${Math.min(pullDistance, 60)}px`,
          transform: `translateY(-${60 - Math.min(pullDistance, 60)}px)`,
        }}
      >
        <div className="flex items-center space-x-2 text-gray-600">
          <RefreshCw
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              isRefreshing ? "animate-spin" : "",
              shouldTrigger ? "text-green-600" : "text-gray-400"
            )}
            style={{
              transform: `rotate(${pullProgress * 180}deg)`,
            }}
          />
          <span className={cn(
            "text-sm font-medium transition-colors duration-300",
            shouldTrigger ? "text-green-600" : "text-gray-500"
          )}>
            {isRefreshing 
              ? "Đang tải mới..." 
              : shouldTrigger 
                ? "Thả để làm mới" 
                : "Kéo để làm mới"
            }
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "transition-transform duration-300 ease-out",
          isPulling || isRefreshing ? "transform" : ""
        )}
        style={{
          transform: isPulling || isRefreshing 
            ? `translateY(${Math.min(pullDistance, 60)}px)` 
            : 'translateY(0)',
        }}
      >
        {children}
      </div>
    </div>
  );
} 