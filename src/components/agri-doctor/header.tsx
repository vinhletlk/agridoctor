"use client";

import { Leaf, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";

export function Header() {
  const { setOpen } = useHistory();

  return (
    <header className="w-full bg-gradient-to-r from-primary to-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm">
              <Leaf className="h-6 w-6 text-emerald-100" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Bác sĩ Nông nghiệp
              </h1>
              <p className="text-xs text-emerald-100/90 font-medium">
                AI chăm sóc cây trồng
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/15 px-3 py-2 rounded-xl backdrop-blur-sm transition-all duration-200"
            onClick={() => setOpen(true)}
          >
            <History className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline font-medium">Lịch sử</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
