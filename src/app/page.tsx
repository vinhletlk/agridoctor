import React from "react";
import { Header } from "@/components/agri-doctor/header";
import { DiagnosisTabs } from "@/components/agri-doctor/diagnosis-tabs";
import { DiseaseCarousel } from "@/components/agri-doctor/disease-carousel";
import { MedicationList } from "@/components/agri-doctor/medication-list";
import { HistoryDrawer } from "@/components/agri-doctor/history-drawer";

export default function Home() {
  const children = (
    <>
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="space-y-8 sm:space-y-12">
            <DiagnosisTabs />
            <DiseaseCarousel />
            <MedicationList />
          </div>
        </div>
      </main>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HistoryDrawer children={children}>
      </HistoryDrawer>
    </div>
  );
}
