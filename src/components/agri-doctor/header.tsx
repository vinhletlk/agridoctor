"use client";

import { Leaf, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";

export function Header() {
  const { setOpen } = useHistory();

  return (
    <header className="w-full bg-gradient-to-r from-green-600 via-green-700 to-blue-600 text-white shadow-lg border-b-2 border-green-800 sticky top-0 z-50 safe-area-padding mobile-backdrop-blur">
      <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 landscape-header">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg shadow-md backdrop-blur-sm touch-optimized">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-green-100" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-headline tracking-tight text-white truncate">
                  Bác sĩ Nông nghiệp
              </h1>
              <p className="text-xs sm:text-sm text-green-100/90 font-medium truncate">
                Chuyên gia sức khỏe cây trồng bởi AI
              </p>
            </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hover:text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all duration-300 shadow-md backdrop-blur-sm flex-shrink-0 touch-optimized haptic-feedback"
              onClick={() => setOpen(true)}
            >
              <History className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="ml-1.5 hidden sm:inline font-medium text-sm">Lịch sử</span>
              <span className="sr-only sm:hidden">Xem lịch sử</span>
            </Button>
        </div>
      </div>
    </header>
  );
}
