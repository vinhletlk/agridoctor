"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { handleImageDiagnosis, handleSymptomDiagnosis, handleInsectIdentification, DiagnosisResultType } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DiagnosisResult } from "./diagnosis-result";
import {
  Loader2,
  Image as ImageIcon,
  Stethoscope,
  Bug,
  UploadCloud,
  AlertCircle,
  CheckCircle,
  X,
  Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Confetti } from "@/components/ui/confetti";
import { cn } from "@/lib/utils";
import { useHistory, HistoryItem } from "@/hooks/use-history";
import { PestForecast } from "./pest-forecast";

type ActiveMode = "symptoms" | "image" | "insect" | "forecast" | null;

const featureCards = [
  {
    id: "symptoms" as const,
    title: "Mô tả triệu chứng",
    description: "Nhập triệu chứng để chẩn đoán",
    icon: Stethoscope,
  },
  {
    id: "image" as const,
    title: "Chụp ảnh cây",
    description: "Tải ảnh để phân tích bệnh",
    icon: ImageIcon,
  },
  {
    id: "insect" as const,
    title: "Nhận dạng côn trùng",
    description: "Tải ảnh côn trùng để xác định",
    icon: Bug,
  },
  {
    id: "forecast" as const,
    title: "Dự báo sâu bệnh",
    description: "Xem lịch dự báo sâu bệnh",
    icon: Calendar,
  },
];

export function DiagnosisTabs() {
  const [activeMode, setActiveMode] = useState<ActiveMode>(null);
  const [symptoms, setSymptoms] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [diagnosisProgress, setDiagnosisProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  const { addHistory, selectedHistoryItem, setSelectedHistoryItem } = useHistory();

  useEffect(() => {
    if (selectedHistoryItem) {
      setResult(selectedHistoryItem.result);
      setActiveMode(selectedHistoryItem.type);
      
      // Clear form states
      setSymptoms('');
      setImageFile(null);
      setImagePreview(null);
      setError(null);
    }
  }, [selectedHistoryItem]);

  const clearForm = (fullClear: boolean = false) => {
    setResult(null);
    setError(null);
    setSymptoms('');
    setImageFile(null);
    setImagePreview(null);
    setDiagnosisProgress(0);
    setShowConfetti(false);
    if(fullClear) {
      setActiveMode(null);
    }
    if (selectedHistoryItem) {
        setSelectedHistoryItem(null);
    }
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => (input as HTMLInputElement).value = '');
  }

  const handleCardClick = (mode: ActiveMode) => {
    if (activeMode === mode && !selectedHistoryItem) {
        clearForm(true);
    } else {
        clearForm();
        setActiveMode(mode);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng chọn file hình ảnh hợp lệ.",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
      setSelectedHistoryItem(null);
    }
  };
  
  const handleSymptomsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập mô tả triệu chứng.",
      });
      return;
    }
    await submitDiagnosis('symptoms', symptoms.trim());
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn hình ảnh để phân tích.",
      });
      return;
    }
    await submitDiagnosis('image', imagePreview);
  };

  const handleInsectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn hình ảnh côn trùng để phân tích.",
      });
      return;
    }
    await submitDiagnosis('insect', imagePreview);
  };
  
  const getResultTitle = (result: DiagnosisResultType, type: ActiveMode): string => {
    if (!type) return "Kết quả chẩn đoán";
    switch (type) {
        case 'symptoms':
            return (result as any).diagnosis.disease || "Chẩn đoán triệu chứng";
        case 'image':
            return (result as any).diagnosis || "Chẩn đoán hình ảnh";
        case 'insect':
            return (result as any).identification || "Nhận dạng côn trùng";
        default:
            return "Kết quả chẩn đoán";
    }
  };

  const submitDiagnosis = async (type: "symptoms" | "image" | "insect", data: string) => {
    if (!type) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    setDiagnosisProgress(0);
    setShowConfetti(false);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setDiagnosisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    let response;
    try {
      if (type === 'symptoms') {
        response = await handleSymptomDiagnosis(data);
      } else if (type === 'image') {
        response = await handleImageDiagnosis(data);
      } else {
        response = await handleInsectIdentification(data);
      }

      clearInterval(progressInterval);
      setDiagnosisProgress(100);

      if (response.success && response.data) {
        setResult(response.data);
        const title = getResultTitle(response.data, type);
        addHistory({
            id: new Date().toISOString(),
            title: title,
            type: type,
            input: data,
            result: response.data,
            timestamp: new Date().toISOString(),
        });
        
        // Show success feedback
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        toast({
          title: "🎉 Chẩn đoán thành công!",
          description: "Kết quả đã được hiển thị bên dưới.",
        });
      } else {
        setError(response.error ?? "Đã xảy ra lỗi không mong muốn.");
        toast({
          variant: "destructive",
          title: "Lỗi chẩn đoán",
          description: response.error,
        });
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError("Lỗi kết nối. Vui lòng thử lại.");
      toast({
        variant: "destructive",
        title: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setDiagnosisProgress(0), 1000);
    }
  }

  const renderImageForm = (
    onSubmit: (e: React.FormEvent) => Promise<void>,
    inputId: string
  ) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-3">
        <Label htmlFor={inputId} className="label-ui">Tải ảnh lên</Label>
        <div className="relative">
            <Input id={inputId} type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed rounded-2xl border-muted-foreground/30 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300">
                {imagePreview ? (
                    <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-soft">
                        <Image
                            src={imagePreview}
                            alt="Xem trước"
                            width={200}
                            height={200}
                            className="mx-auto rounded-xl object-contain max-h-48"
                        />
                    </div>
                ) : (
                    <div className="text-center space-y-3">
                        <div className="p-3 bg-white/50 rounded-full shadow-sm">
                          <UploadCloud className="w-10 h-10 mx-auto icon-ui" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">Nhấp để tải ảnh lên</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG (tối đa 5MB)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" onClick={() => clearForm()} disabled={isLoading} className="btn-ui btn-ui-secondary">
            Xóa
          </Button>
          <Button type="submit" disabled={isLoading || !imageFile} className="btn-ui btn-ui-primary">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Phân tích
          </Button>
      </div>
    </form>
  );

  const renderActiveModeForm = () => {
    if (!activeMode || selectedHistoryItem) return null;

    let content;
    switch(activeMode) {
      case 'symptoms':
        content = (
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSymptomsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="label-ui">Mô tả triệu chứng của cây:</Label>
                <Textarea
                  placeholder="Ví dụ: Lá vàng có đốm nâu, thân cây bị thối..."
                  value={symptoms}
                  onChange={(e) => {
                    setSymptoms(e.target.value)
                    setResult(null)
                    setError(null)
                  }}
                  rows={5}
                  className="input-ui resize-none"
                />
                {symptoms.length > 0 && symptoms.length < 10 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Mô tả chi tiết hơn để có kết quả chính xác
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" onClick={() => clearForm()} disabled={isLoading} className="btn-ui btn-ui-secondary">
                    Xóa
                  </Button>
                  <Button type="submit" disabled={isLoading || !symptoms.trim()} className="btn-ui btn-ui-primary">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Chẩn đoán
                  </Button>
              </div>
            </form>
          </CardContent>
        );
        break;
      case 'image':
        content = (
          <CardContent className="p-4 sm:p-6">
            {renderImageForm(handleImageSubmit, "plant-image")}
          </CardContent>
        );
        break;
      case 'insect':
        content = (
           <CardContent className="p-4 sm:p-6">
            {renderImageForm(handleInsectSubmit, "insect-image")}
          </CardContent>
        );
        break;
      case 'forecast':
        content = (
          <CardContent className="p-4 sm:p-6">
            <PestForecast />
          </CardContent>
        );
        break;
      default:
        content = null;
    }

    const activeFeature = featureCards.find((f) => f.id === activeMode);

    return (
      <Card className="mt-6 w-full max-w-4xl mx-auto animate-in fade-in-50 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl">
              {activeFeature?.title}
            </CardTitle>
            <CardDescription>{activeFeature?.description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            className="rounded-xl bg-red-500 hover:bg-red-600 text-white min-w-16 min-h-16 p-4 touch-target flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            onClick={() => clearForm(true)}
          >
            <X className="w-8 h-8" />
            <span className="sr-only">Đóng</span>
          </Button>
        </CardHeader>
        {content}
      </Card>
    );
  };
  
  const shouldShowResult = (result && !isLoading && activeMode) || (selectedHistoryItem && result);

  return (
    <section className="space-y-6">
      <Confetti active={showConfetti} />

      {activeMode === null && !selectedHistoryItem && (
        <div className="animate-in fade-in-50 space-y-8">
          <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Chẩn đoán cây trồng
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Chọn một trong các phương pháp dưới đây để AI giúp bạn chẩn đoán.
              </p>
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featureCards.map((card) => {
                const Icon = card.icon;
                const isActive = activeMode === card.id;
                return (
                  <Card
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={cn(
                      "card-ui cursor-pointer transition-all duration-200 h-full",
                      "bg-white border border-border shadow-lg hover:shadow-xl",
                      isActive
                        ? "ring-2 ring-primary shadow-xl bg-secondary"
                        : "hover:-translate-y-1"
                    )}
                  >
                    <CardHeader className="items-center text-center p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-3 bg-secondary">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-base font-bold text-foreground">
                          {card.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          {card.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        {(activeMode !== null || selectedHistoryItem) && renderActiveModeForm()}
      </div>

      {isLoading && (
        <Card className="mt-6 w-full max-w-2xl mx-auto card-ui">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Loader2 className="w-5 h-5 animate-spin icon-ui" />
                <CardTitle className="text-lg text-foreground">Đang phân tích...</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground text-sm">Việc này có thể mất một lát.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${diagnosisProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Đang xử lý...</span>
                  <span>{diagnosisProgress}%</span>
                </div>
            </CardContent>
        </Card>
      )}

      {shouldShowResult && (
        <div className="mt-6 w-full max-w-4xl mx-auto">
          {activeMode && activeMode !== 'forecast' && (
            <DiagnosisResult result={result!} type={activeMode} />
          )}
        </div>
      )}

      {error && !isLoading && (
        <Card className="mt-6 w-full max-w-2xl mx-auto card-ui border-destructive/50 bg-destructive/10">
            <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <CardTitle className="text-destructive text-lg">Phân tích thất bại</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-destructive/90 text-sm">{error}</p>
                <Button 
                  onClick={() => clearForm()} 
                  variant="outline" 
                  className="btn-ui btn-ui-secondary mt-4"
                >
                  Thử lại
                </Button>
            </CardContent>
        </Card>
      )}
    </section>
  );
}
