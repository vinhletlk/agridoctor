import { Header } from "@/components/agri-doctor/header";
import { DiagnosisTabs } from "@/components/agri-doctor/diagnosis-tabs";
import { DiseaseCarousel } from "@/components/agri-doctor/disease-carousel";
import { MedicationList } from "@/components/agri-doctor/medication-list";
import { HistoryDrawer } from "@/components/agri-doctor/history-drawer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
      <HistoryDrawer>
        <Header />
        <main className="flex-1 w-full">
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-10">
              <DiagnosisTabs />
              <DiseaseCarousel />
              <MedicationList />
            </div>
          </div>
        </main>
      </HistoryDrawer>
    </div>
  );
}
