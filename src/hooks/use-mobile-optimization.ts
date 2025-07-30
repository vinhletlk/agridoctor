"use client";

import { useEffect, useCallback, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface MobileOptimizationOptions {
  enableHapticFeedback?: boolean;
  enablePullToRefresh?: boolean;
  optimizeAnimations?: boolean;
}

export function useMobileOptimization(options: MobileOptimizationOptions = {}) {
  const isMobile = useIsMobile();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const {
    enableHapticFeedback = true,
    enablePullToRefresh = true,
    optimizeAnimations = true,
  } = options;

  // Haptic feedback simulation
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!isMobile || !enableHapticFeedback) return;
    
    // Use navigator.vibrate if available
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate([25, 10, 25]);
          break;
      }
    }
  }, [isMobile, enableHapticFeedback]);

  // Optimize animations for mobile
  useEffect(() => {
    if (!isMobile || !optimizeAnimations) return;

    // Reduce animations for better performance on mobile
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
    
    if (!mediaQuery.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }

    return () => {
      document.documentElement.style.removeProperty('--animation-duration');
      document.documentElement.style.removeProperty('--transition-duration');
    };
  }, [isMobile, optimizeAnimations]);

  // Pull to refresh functionality
  const setupPullToRefresh = useCallback((onRefresh: () => Promise<void>) => {
    if (!isMobile || !enablePullToRefresh) return () => {};

    let startY = 0;
    let currentY = 0;
    let isScrolledToTop = true;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isScrolledToTop = window.scrollY === 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolledToTop) return;
      
      currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY);
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, 100));
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 60 && !isRefreshing) {
        setIsRefreshing(true);
        triggerHapticFeedback('medium');
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
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
  }, [isMobile, enablePullToRefresh, pullDistance, isRefreshing, triggerHapticFeedback]);

  // Image optimization for mobile
  const optimizeImageLoading = useCallback(() => {
    if (!isMobile) return;

    // Add intersection observer for lazy loading
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  }, [isMobile]);

  // Touch gesture helpers
  const addTouchGestures = useCallback((element: HTMLElement, handlers: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onTap?: () => void;
  }) => {
    if (!isMobile) return () => {};

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      
      const diffX = endX - startX;
      const diffY = endY - startY;
      const diffTime = endTime - startTime;
      
      // Tap detection (short duration, small movement)
      if (diffTime < 300 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
        handlers.onTap?.();
        triggerHapticFeedback('light');
        return;
      }
      
      // Swipe detection (minimum distance and reasonable speed)
      if (diffTime < 1000 && (Math.abs(diffX) > 50 || Math.abs(diffY) > 50)) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          // Horizontal swipe
          if (diffX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (diffY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
        triggerHapticFeedback('medium');
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, triggerHapticFeedback]);

  return {
    isMobile,
    isRefreshing,
    pullDistance,
    triggerHapticFeedback,
    setupPullToRefresh,
    optimizeImageLoading,
    addTouchGestures,
  };
} 