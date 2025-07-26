"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { handleImageDiagnosis, handleSymptomDiagnosis, handleInsectIdentification, DiagnosisResultType } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DiagnosisResult } from "./diagnosis-result";
import { Loader2, Image as ImageIcon, Stethoscope, Bug, UploadCloud, AlertCircle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Confetti } from "@/components/ui/confetti";
import { cn } from "@/lib/utils";
import { useHistory, HistoryItem } from "@/hooks/use-history";

type ActiveMode = "symptoms" | "image" | "insect" | null;

const featureCards = [
  {
    id: "symptoms" as const,
    title: "Mô tả triệu chứng",
    description: "Nhập các dấu hiệu của cây để chẩn đoán.",
    icon: Stethoscope,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "image" as const,
    title: "Chẩn đoán bệnh qua ảnh",
    description: "Tải ảnh cây của bạn để phân tích bệnh.",
    icon: ImageIcon,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: "insect" as const,
    title: "Nhận dạng côn trùng",
    description: "Tải ảnh côn trùng để xác định loài.",
    icon: Bug,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
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
        <Label htmlFor={inputId} className="sr-only">Tải ảnh lên</Label>
        <div className="relative">
            <Input id={inputId} type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed rounded-xl border-muted-foreground/30 bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all duration-300 shadow-lg">
                {imagePreview ? (
                    <div className="p-3 sm:p-4 bg-white rounded-xl shadow-xl">
                        <Image
                            src={imagePreview}
                            alt="Xem trước"
                            width={200}
                            height={200}
                            className="mx-auto rounded-lg object-contain max-h-40 sm:max-h-48 md:max-h-64 shadow-md"
                        />
                    </div>
                ) : (
                    <div className="text-center space-y-3 sm:space-y-4">
                        <div className="p-3 sm:p-4 bg-white/80 rounded-full shadow-lg backdrop-blur-sm">
                          <UploadCloud className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-base sm:text-lg text-foreground">Nhấp để tải ảnh lên</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">PNG, JPG (tối đa 5MB)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button type="button" variant="outline" onClick={() => clearForm()} disabled={isLoading} className="rounded-xl order-2 sm:order-1">
            Xóa
          </Button>
          <Button type="submit" disabled={isLoading || !imageFile} className="rounded-xl shadow-lg order-1 sm:order-2">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Nhận kết quả
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
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm sm:text-base font-semibold text-foreground">Mô tả triệu chứng của cây:</Label>
                <Textarea
                  placeholder="Ví dụ: Lá vàng có đốm nâu, thân cây bị thối, rễ có mùi hôi..."
                  value={symptoms}
                  onChange={(e) => {
                    setSymptoms(e.target.value)
                    setResult(null)
                    setError(null)
                  }}
                  rows={5}
                  className="bg-white border-2 border-muted-foreground/20 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none text-sm sm:text-base"
                />
                {symptoms.length > 0 && symptoms.length < 10 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Mô tả chi tiết hơn để có kết quả chính xác
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button type="button" variant="outline" onClick={() => clearForm()} disabled={isLoading} className="rounded-xl order-2 sm:order-1">
                    Xóa
                  </Button>
                  <Button type="submit" disabled={isLoading || !symptoms.trim()} className="rounded-xl shadow-lg order-1 sm:order-2">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Nhận chẩn đoán
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
      default:
        content = null;
    }
    
    return (
        <Card className="mt-6 w-full max-w-4xl mx-auto animate-in fade-in-50 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-xl">
            {content}
        </Card>
    )
  }
  
  const shouldShowResult = (result && !isLoading && activeMode) || (selectedHistoryItem && result);

  return (
    <section className="space-y-6">
      <Confetti active={showConfetti} />
      
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-headline">
          Chẩn đoán cây trồng
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed px-4">
          Chọn phương pháp chẩn đoán phù hợp để được tư vấn chính xác về tình trạng cây trồng của bạn
        </p>
      </div>
      
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
        {featureCards.map(card => {
            const Icon = card.icon;
            const isActive = activeMode === card.id;
            return (
                <Card 
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 rounded-xl overflow-hidden",
                        isActive 
                          ? `border-2 shadow-lg ring-2 ring-offset-2 bg-gradient-to-br ${card.bgColor} ${card.borderColor} ring-blue-500` 
                          : "border-muted-foreground/20 hover:border-blue-300 bg-white/80 backdrop-blur-sm"
                    )}
                >
                    <CardHeader className="items-center text-center p-4 sm:p-6 space-y-3 sm:space-y-4">
                        <div className={cn(
                            "flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-full transition-all duration-300 shadow-lg",
                            isActive 
                              ? `bg-gradient-to-br ${card.color} text-white shadow-xl` 
                              : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}>
                            <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-foreground">{card.title}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{card.description}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            )
        })}
      </div>
      
      <div className="mt-6">
        {renderActiveModeForm()}
      </div>

      {isLoading && (
        <Card className="mt-6 w-full max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader className="text-center p-4 sm:p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-foreground">Đang phân tích...</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">Việc này có thể mất một lát.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${diagnosisProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Đang xử lý...</span>
                  <span>{diagnosisProgress}%</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-5/6 rounded-lg" />
                  <Skeleton className="h-4 w-4/6 rounded-lg" />
                </div>
            </CardContent>
        </Card>
      )}

      {shouldShowResult && (
        <div className="mt-6 w-full max-w-4xl mx-auto">
          <div className="mb-4 flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Chẩn đoán hoàn tất</span>
          </div>
          <DiagnosisResult result={result!} type={activeMode!} />
        </div>
      )}

      {error && !isLoading && (
        <Card className="mt-6 w-full max-w-4xl mx-auto border-red-200 bg-red-50/50 shadow-xl rounded-xl">
            <CardHeader className="text-center p-4 sm:p-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <CardTitle className="text-red-600 text-lg sm:text-xl lg:text-2xl">Phân tích thất bại</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
                <p className="text-sm text-red-600/80 mt-3">Vui lòng thử lại hoặc diễn đạt lại mô tả của bạn.</p>
                <Button 
                  onClick={() => clearForm()} 
                  variant="outline" 
                  className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
                >
                  Thử lại
                </Button>
            </CardContent>
        </Card>
      )}
    </section>
  );
}
