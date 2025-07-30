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
  Sparkles,
  Camera,
  FileText,
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
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "image" as const,
    title: "Chụp ảnh cây",
    description: "Tải ảnh để phân tích bệnh",
    icon: ImageIcon,
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "insect" as const,
    title: "Nhận dạng côn trùng",
    description: "Tải ảnh côn trùng để xác định",
    icon: Bug,
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "forecast" as const,
    title: "Dự báo sâu bệnh",
    description: "Xem lịch dự báo sâu bệnh",
    icon: Calendar,
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-600 dark:text-yellow-400",
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
  const [isDragging, setIsDragging] = useState(false);
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
    setIsDragging(false);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileValidation(files[0]);
    }
  };

  const handleFileValidation = (file: File) => {
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
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileValidation(file);
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
    inputId: string,
    placeholderText: string
  ) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor={inputId} className="label-ui flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Tải ảnh lên
        </Label>
        <div className="relative">
            <Input 
              id={inputId} 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
            <div 
              className={cn(
                "flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer",
                "border-muted-foreground/30 bg-secondary/30 hover:bg-secondary/50",
                isDragging && "border-primary bg-primary/10 scale-105",
                imagePreview && "border-primary/50 bg-primary/5"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
                {imagePreview ? (
                    <div className="p-3 sm:p-4 bg-white dark:bg-card rounded-2xl shadow-soft">
                        <Image
                            src={imagePreview}
                            alt="Xem trước"
                            width={200}
                            height={200}
                            className="mx-auto rounded-xl object-contain max-h-48"
                        />
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <div className={cn(
                          "p-4 rounded-full transition-all duration-200",
                          isDragging ? "bg-primary/20 scale-110" : "bg-white/50 dark:bg-card/50"
                        )}>
                          <UploadCloud className={cn(
                            "w-12 h-12 mx-auto transition-all duration-200",
                            isDragging ? "text-primary scale-110" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground text-responsive">
                            {isDragging ? "Thả ảnh vào đây" : "Nhấp hoặc kéo thả ảnh"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {placeholderText} • PNG, JPG (tối đa 5MB)
                          </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => clearForm()} 
            disabled={isLoading} 
            className="btn-ui btn-ui-secondary"
          >
            <X className="mr-2 h-4 w-4" />
            Xóa
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || !imageFile} 
            className="btn-ui btn-ui-primary"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Sparkles className="mr-2 h-4 w-4" />
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
            <form onSubmit={handleSymptomsSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="label-ui flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Mô tả triệu chứng của cây:
                </Label>
                <Textarea
                  placeholder="Ví dụ: Lá vàng có đốm nâu, thân cây bị thối, rễ có mùi hôi..."
                  value={symptoms}
                  onChange={(e) => {
                    setSymptoms(e.target.value)
                    setResult(null)
                    setError(null)
                  }}
                  rows={5}
                  className="input-ui resize-none text-responsive"
                />
                {symptoms.length > 0 && symptoms.length < 20 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Mô tả chi tiết hơn để có kết quả chính xác
                  </p>
                )}
                {symptoms.length >= 20 && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Mô tả đã đủ chi tiết
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => clearForm()} 
                    disabled={isLoading} 
                    className="btn-ui btn-ui-secondary"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Xóa
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !symptoms.trim()} 
                    className="btn-ui btn-ui-primary"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Sparkles className="mr-2 h-4 w-4" />
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
            {renderImageForm(handleImageSubmit, "plant-image", "Chụp ảnh cây bị bệnh")}
          </CardContent>
        );
        break;
      case 'insect':
        content = (
           <CardContent className="p-4 sm:p-6">
            {renderImageForm(handleInsectSubmit, "insect-image", "Chụp ảnh côn trùng")}
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
      <Card className="mt-6 w-full max-w-4xl mx-auto animate-in fade-in-50 shadow-xl border-0 bg-card/95 backdrop-blur-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              {activeFeature && (
                <>
                  <div className={cn("p-2 rounded-lg", activeFeature.bgColor)}>
                    <activeFeature.icon className={cn("h-5 w-5", activeFeature.textColor)} />
                  </div>
                  {activeFeature.title}
                </>
              )}
            </CardTitle>
            <CardDescription className="text-responsive">{activeFeature?.description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            className="rounded-xl bg-red-500 hover:bg-red-600 text-white min-w-12 min-h-12 p-3 touch-target flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            onClick={() => clearForm(true)}
            aria-label="Đóng form"
          >
            <X className="w-6 h-6" />
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
              <h2 className="text-responsive-xl font-bold text-foreground">
                Chẩn đoán cây trồng
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto text-responsive">
                Chọn một trong các phương pháp dưới đây để AI giúp bạn chẩn đoán.
              </p>
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featureCards.map((card) => {
                const Icon = card.icon;
                const isActive = activeMode === card.id;
                return (
                  <Card
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={cn(
                      "cursor-pointer transition-all duration-300 h-full touch-target",
                      "bg-yellow-400 dark:bg-yellow-500/10 border-2 border-transparent",
                      "hover:border-yellow-500 dark:hover:border-yellow-400",
                      "hover:shadow-2xl hover:-translate-y-2",
                      isActive
                        ? "ring-2 ring-yellow-500 dark:ring-yellow-400 shadow-2xl scale-105"
                        : "shadow-lg"
                    )}
                  >
                    <CardHeader className="items-center text-center p-4">
                      <div className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-xl mb-4 transition-all duration-200",
                        "bg-white/30 dark:bg-yellow-900/40"
                      )}>
                        <Icon className={cn("h-7 w-7", "text-yellow-900 dark:text-yellow-300")} />
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-base font-bold text-yellow-900 dark:text-yellow-100">
                          {card.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-yellow-800 dark:text-yellow-200/80">
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
        <Card className="mt-6 w-full max-w-2xl mx-auto card-ui animate-in slide-in-from-bottom">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="relative">
                  <Loader2 className="w-6 h-6 animate-spin icon-ui" />
                  <div className="absolute inset-0 w-6 h-6 border-2 border-primary/20 rounded-full"></div>
                </div>
                <CardTitle className="text-lg text-foreground">Đang phân tích...</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground text-responsive">
                AI đang xử lý thông tin của bạn. Việc này có thể mất một lát.
              </d>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-emerald-500 h-2 rounded-full transition-all duration-300"
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
        <div className="mt-6 w-full max-w-4xl mx-auto animate-in slide-in-from-bottom">
          {activeMode && activeMode !== 'forecast' && (
            <DiagnosisResult result={result!} type={activeMode} />
          )}
        </div>
      )}

      {error && !isLoading && (
        <Card className="mt-6 w-full max-w-2xl mx-auto card-ui border-destructive/50 bg-destructive/10 animate-in slide-in-from-bottom">
            <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                  <CardTitle className="text-destructive text-lg">Phân tích thất bại</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-destructive/90 text-responsive mb-4">{error}</p>
                <Button 
                  onClick={() => clearForm()} 
                  variant="outline" 
                  className="btn-ui btn-ui-secondary"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>
            </CardContent>
        </Card>
      )}
    </section>
  );
}
