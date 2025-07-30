"use client";

import { Leaf, History, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const { setOpen } = useHistory();
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <header className={cn(
      "w-full text-white shadow-lg sticky top-0 z-50 transition-all duration-300",
      isDark ? "bg-slate-900/95 backdrop-blur-md" : "bg-green-600/95 backdrop-blur-md",
      isScrolled && "shadow-xl"
    )}>
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl backdrop-blur-sm transition-all duration-200",
              isDark ? "bg-white/10" : "bg-white/15"
            )}>
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-100" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Bác sĩ Nông nghiệp
              </h1>
              <p className="text-xs text-emerald-100/90 font-medium">
                AI chăm sóc cây trồng
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-white">
                AgriDoctor
              </h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={cn(
                "text-white hover:bg-white/15 px-2.5 py-2 rounded-xl backdrop-blur-sm transition-all duration-200 touch-target",
                isDark ? "hover:bg-white/10" : "hover:bg-white/15"
              )}
              aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {isDark ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            {/* History Button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-white hover:bg-white/15 px-3 py-2 rounded-xl backdrop-blur-sm transition-all duration-200 touch-target",
                isDark ? "hover:bg-white/10" : "hover:bg-white/15"
              )}
              onClick={() => setOpen(true)}
              aria-label="Xem lịch sử chẩn đoán"
            >
              <History className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="ml-2 hidden md:inline font-medium">Lịch sử</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-white hover:bg-white/15 px-2.5 py-2 rounded-xl backdrop-blur-sm transition-all duration-200 touch-target md:hidden",
                isDark ? "hover:bg-white/10" : "hover:bg-white/15"
              )}
              aria-label="Mở menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
