import { Header } from "@/components/agri-doctor/header";
import { DiagnosisTabs } from "@/components/agri-doctor/diagnosis-tabs";
import { DiseaseCarousel } from "@/components/agri-doctor/disease-carousel";
import { MedicationList } from "@/components/agri-doctor/medication-list";
import { HistoryDrawer } from "@/components/agri-doctor/history-drawer";
import { PestForecast } from "@/components/agri-doctor/pest-forecast";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 text-foreground overflow-x-hidden">
      <HistoryDrawer>
        <Header />
        <main className="flex-1 w-full">
          <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:py-10">
            <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
              <DiagnosisTabs />
              <PestForecast />
              <DiseaseCarousel />
              <MedicationList />
            </div>
          </div>
        </main>
        <footer className="w-full p-4 sm:p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white border-t-4 border-green-700">
          <div className="container mx-auto text-center">
            <p className="text-sm sm:text-base font-medium">
              &copy; {new Date().getFullYear()} AgriDoctor. Đối tác AI của bạn trong việc chăm sóc cây trồng.
            </p>
            <p className="text-xs sm:text-sm text-green-100 mt-2">
              Chăm sóc nông nghiệp thông minh, bền vững
            </p>
          </div>
        </footer>
      </HistoryDrawer>
    </div>
  );
}
