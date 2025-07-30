"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(distance);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return;

      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, pullDistance, threshold, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Pull indicator */}
      {isPulling && (
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 z-10 flex items-center justify-center transition-all duration-200",
            "bg-gradient-to-b from-primary/10 to-transparent"
          )}
          style={{
            height: `${Math.min(pullDistance, 120)}px`,
            transform: `translateY(${Math.min(pullDistance - 60, 0)}px)`,
          }}
        >
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
            shouldTrigger 
              ? "bg-primary text-white shadow-lg" 
              : "bg-white/90 text-muted-foreground shadow-md"
          )}>
            <RefreshCw 
              className={cn(
                "h-5 w-5 transition-all duration-200",
                shouldTrigger && "animate-spin",
                progress > 0.5 && "text-primary"
              )}
              style={{
                transform: `rotate(${progress * 180}deg)`,
              }}
            />
            <span className="text-sm font-medium">
              {shouldTrigger ? "Thả để làm mới" : "Kéo xuống để làm mới"}
            </span>
          </div>
        </div>
      )}

      {/* Refreshing indicator */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-primary/10 py-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white shadow-lg">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Đang làm mới...</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        ref={containerRef}
        className={cn(
          "transition-transform duration-200",
          isPulling && "transform translate-y-2"
        )}
        style={{
          transform: isPulling ? `translateY(${Math.min(pullDistance * 0.3, 20)}px)` : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
} 