"use client";

import { Leaf, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";

export function Header() {
  const { setOpen } = useHistory();

  return (
    <header className="w-full bg-green-600 text-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Bác sĩ Nông nghiệp
              </h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 px-3 py-2 rounded-lg"
            onClick={() => setOpen(true)}
          >
            <History className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline">Lịch sử</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
