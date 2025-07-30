"use client";

import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { DiagnosePlantFromImageOutput } from "@/ai/flows/diagnose-plant-from-image";
import type { DiagnosePlantFromSymptomsOutput } from "@/ai/flows/diagnose-plant-from-symptoms";
import type { IdentifyInsectFromImageOutput } from "@/ai/flows/identify-insect-from-image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ClipboardList, FlaskConical, Pill, ShoppingCart, Bug, Leaf, AlertTriangle, Search, Microscope, FlaskRound, BookOpen, Lightbulb, ShieldAlert, ChevronDown, ChevronUp, Star, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Result = DiagnosePlantFromImageOutput | DiagnosePlantFromSymptomsOutput | IdentifyInsectFromImageOutput;
type Medication = { name: string; reason: string };

interface DiagnosisResultProps {
  result: Result;
  type: 'image' | 'symptoms' | 'insect';
}

function isSymptomResult(result: Result, type: 'image' | 'symptoms' | 'insect'): result is DiagnosePlantFromSymptomsOutput {
    return type === 'symptoms';
}

function isImageResult(result: Result, type: 'image' | 'symptoms' | 'insect'): result is DiagnosePlantFromImageOutput {
    return type === 'image';
}

function isInsectResult(result: Result, type: 'image' | 'symptoms' | 'insect'): result is IdentifyInsectFromImageOutput {
    return type === 'insect';
}

const SeverityProgress = ({ value }: { value: number }) => {
  const getColor = (value: number) => {
    if (value < 40) return "bg-green-500";
    if (value < 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getLabel = (value: number) => {
    if (value < 40) return "Nhẹ";
    if (value < 70) return "Trung bình";
    return "Nặng";
  };

  const getIconColorClass = (value: number) => {
    if (value < 40) return "text-green-600 dark:text-green-400";
    if (value < 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };
  
  return (
    <div className="space-y-3 p-4 rounded-lg bg-muted/30 border">
      <div className="flex justify-between items-center text-sm font-medium">
          <h4 className="flex items-center gap-2 text-primary">
              <ShieldAlert className={cn("h-4 w-4", getIconColorClass(value))}/> 
              Mức độ nghiêm trọng
          </h4>
          <span className={cn(
              "font-bold text-responsive",
              getIconColorClass(value)
          )}>
              {getLabel(value)} ({value}/100)
          </span>
      </div>
      <Progress value={value} className="h-3" indicatorClassName={getColor(value)} />
    </div>
  );
};

const SuggestedMedications = ({ medications }: { medications: Medication[] }) => {
    return (
        <div className="space-y-3">
            {(medications || []).map((med, index) => (
                <div key={med.name} className={cn(
                  "p-4 border-l-4 rounded-r-lg transition-all duration-200 hover:shadow-md",
                  "border-primary/50 bg-primary/5 dark:bg-primary/10"
                )}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                        <Pill className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary text-responsive">{med.name}</p>
                        <p className="text-xs text-muted-foreground italic mt-1">"{med.reason}"</p>
                      </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const InstructionAccordion = ({ instructions }: { instructions: string }) => {
  return (
      <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="instructions" className="border-b-0">
              <AccordionTrigger className="group text-sm font-semibold hover:no-underline p-3 rounded-lg bg-card hover:bg-muted/50 border justify-center transition-all duration-200">
                  <div className="flex items-center justify-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="group-data-[state=closed]:block group-data-[state=open]:hidden">Xem hướng dẫn</span>
                      <span className="group-data-[state=closed]:hidden group-data-[state=open]:block">Ẩn hướng dẫn</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </div>
              </AccordionTrigger>
              <AccordionContent>
                  <div className="p-4 bg-muted/30 rounded-lg mt-2">
                    <p className="text-muted-foreground whitespace-pre-wrap prose prose-sm max-w-none text-responsive">
                      {instructions}
                    </p>
                  </div>
              </AccordionContent>
          </AccordionItem>
      </Accordion>
  );
}

const TreatmentSection = ({ 
  title, 
  icon: Icon, 
  iconColor, 
  bgColor, 
  medications, 
  instructions 
}: {
  title: string;
  icon: any;
  iconColor: string;
  bgColor: string;
  medications: Medication[];
  instructions: string;
}) => (
  <div className={cn("p-4 rounded-lg border transition-all duration-200 hover:shadow-md", bgColor)}>
    <h4 className="font-semibold text-base md:text-lg flex items-center gap-2 mb-4">
      <div className={cn("p-2 rounded-lg", iconColor)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      {title}
    </h4>
    <div className="space-y-3">
      <h5 className="font-semibold mb-2 text-responsive">Phương pháp được đề xuất:</h5>
      <SuggestedMedications medications={medications} />
    </div>
    <InstructionAccordion instructions={instructions} />
  </div>
);

export function DiagnosisResult({ result, type }: DiagnosisResultProps) {
  const { toast } = useToast();

  const handlePurchase = () => {
    toast({
      title: "Tính năng sắp ra mắt!",
      description: "Chức năng thương mại điện tử và thanh toán sẽ được triển khai trong bản cập nhật sau.",
    });
  };
  
  if (isInsectResult(result, type)) {
    return (
        <Card className="shadow-lg animate-in fade-in-50">
          <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                      <Bug className="text-orange-500" /> 
                      Báo cáo nhận dạng côn trùng
                  </CardTitle>
                  <CardDescription className="text-responsive">Dựa trên hình ảnh được tải lên.</CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="mr-1 h-3 w-3" />
                  Vừa phân tích
                </Badge>
              </div>
          </CardHeader>
          <CardContent className="space-y-6 text-responsive">
              <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <Leaf className="text-orange-600 dark:text-orange-400"/> 
                  Côn trùng được xác định
                </h3>
                <p className="text-xl text-orange-700 dark:text-orange-300 font-bold">{result.identification}</p>
                {result.isHarmful ? (
                    <Badge variant="destructive" className="mt-2">
                      <AlertTriangle className="mr-1 h-3 w-3" /> 
                      Gây hại
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="mt-2">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Không gây hại
                    </Badge>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="text-blue-600 dark:text-blue-400"/> 
                  Giải thích nhận dạng
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap prose prose-sm max-w-none bg-muted/30 p-4 rounded-lg">
                  {result.explanation}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mô tả</h3>
                <p className="text-muted-foreground whitespace-pre-wrap prose prose-sm max-w-none bg-muted/30 p-4 rounded-lg">
                  {result.description}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Pill className="text-primary" /> 
                  Biện pháp kiểm soát được đề xuất
                </h3>
                
                <div className="space-y-4">
                  <TreatmentSection
                    title="Phương pháp Sinh học"
                    icon={Microscope}
                    iconColor="bg-emerald-600"
                    bgColor="bg-emerald-50/50 dark:bg-emerald-900/20"
                    medications={result.controlMethods.biological.suggestedMethods}
                    instructions={result.controlMethods.biological.instructions}
                  />

                  <TreatmentSection
                    title="Phương pháp Hóa học"
                    icon={FlaskRound}
                    iconColor="bg-rose-600"
                    bgColor="bg-rose-50/50 dark:bg-rose-900/20"
                    medications={result.controlMethods.chemical.suggestedMethods}
                    instructions={result.controlMethods.chemical.instructions}
                  />
                </div>
              </div>
          </CardContent>
          <CardFooter className="bg-muted/50 p-4 flex justify-end">
              <Button onClick={handlePurchase} className="btn-ui btn-ui-primary">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Mua sản phẩm
              </Button>
          </CardFooter>
        </Card>
    )
  }

  let diagnosisText: string = '';
  let explanationText: string = '';
  let confidenceBadge: React.ReactNode = null;
  let biologicalTreatment: { suggestedMedications: Medication[]; applicationInstructions: string; } | null = null;
  let chemicalTreatment: { suggestedMedications: Medication[]; applicationInstructions: string; } | null = null;
  let plantIdentification: string | null = null;
  let similarDiseases: { name: string; imageHint: string }[] = [];
  let severityScore: number | undefined = undefined;

  if (isSymptomResult(result, type)) {
    const confidencePercentage = (result.diagnosis.confidence * 100).toFixed(0);
    const confidenceLevel = result.diagnosis.confidence;
    const badgeVariant = confidenceLevel > 0.8 ? "default" : confidenceLevel > 0.5 ? "secondary" : "destructive";
    
    diagnosisText = result.diagnosis.disease;
    explanationText = result.explanation;
    biologicalTreatment = result.treatment.biological;
    chemicalTreatment = result.treatment.chemical;
    similarDiseases = result.similarDiseases || [];
    severityScore = result.severityScore;
    confidenceBadge = (
        <Badge variant={badgeVariant} className="text-xs md:text-sm shrink-0">
            <Star className="mr-1 h-3 w-3" />
            Độ tin cậy: {confidencePercentage}%
        </Badge>
    );
  } else if (isImageResult(result, type)) {
    diagnosisText = result.diagnosis;
    explanationText = result.explanation;
    biologicalTreatment = result.treatment.biological;
    chemicalTreatment = result.treatment.chemical;
    plantIdentification = result.plantIdentification;
    similarDiseases = result.similarDiseases || [];
    severityScore = result.severityScore;
  }

  return (
    <Card className="shadow-lg animate-in fade-in-50">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="text-primary" /> 
              Báo cáo chẩn đoán
            </CardTitle>
            <CardDescription className="text-responsive">
              Dựa trên {type === 'symptoms' ? 'các triệu chứng' : 'hình ảnh'}.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {confidenceBadge}
            <Badge variant="secondary" className="text-xs">
              <Clock className="mr-1 h-3 w-3" />
              Vừa phân tích
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-responsive">
        {plantIdentification && (
             <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <Leaf className="text-green-600 dark:text-green-400"/> 
                  Cây được xác định
                </h3>
                <p className="text-xl text-green-700 dark:text-green-300 font-bold">{plantIdentification}</p>
            </div>
        )}

        <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-800">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <FlaskConical className="text-red-600 dark:text-red-400"/> 
            Bệnh được xác định
          </h3>
          <p className="text-xl text-red-700 dark:text-red-300 font-bold">{diagnosisText}</p>
        </div>

        {severityScore !== undefined && (
             <SeverityProgress value={severityScore} />
        )}

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="text-blue-600 dark:text-blue-400"/> 
            Giải thích chẩn đoán
          </h3>
          <p className="text-muted-foreground whitespace-pre-wrap prose prose-sm max-w-none bg-muted/30 p-4 rounded-lg">
            {explanationText}
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Pill className="text-primary" /> 
            Điều trị được đề xuất
          </h3>
          
          <div className="space-y-4">
            {biologicalTreatment && (
              <TreatmentSection
                title="Phương pháp Sinh học"
                icon={Microscope}
                iconColor="bg-emerald-600"
                bgColor="bg-emerald-50/50 dark:bg-emerald-900/20"
                medications={biologicalTreatment.suggestedMedications}
                instructions={biologicalTreatment.applicationInstructions}
              />
            )}

            {chemicalTreatment && (
              <TreatmentSection
                title="Phương pháp Hóa học"
                icon={FlaskRound}
                iconColor="bg-rose-600"
                bgColor="bg-rose-50/50 dark:bg-rose-900/20"
                medications={chemicalTreatment.suggestedMedications}
                instructions={chemicalTreatment.applicationInstructions}
              />
            )}
          </div>
        </div>

        {similarDiseases && similarDiseases.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Search className="text-blue-600 dark:text-blue-400"/> 
                So sánh với các bệnh tương tự
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Sử dụng các hình ảnh này để so sánh trực quan với cây của bạn.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {similarDiseases.map((disease, index) => (
                  <div key={disease.name} className="border rounded-lg p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105">
                    <div className="relative aspect-[4/3] mb-3">
                      <Image
                        src={`https://source.unsplash.com/400x300/?${encodeURIComponent(disease.imageHint)}`}
                        data-ai-hint={disease.imageHint}
                        alt={`Hình ảnh của ${disease.name}`}
                        fill
                        className="object-cover rounded-md bg-muted"
                      />
                    </div>
                    <p className="text-xs md:text-sm font-medium truncate">{disease.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex justify-end">
        <Button onClick={handlePurchase} className="btn-ui btn-ui-primary">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Mua đơn thuốc
        </Button>
      </CardFooter>
    </Card>
  );
}
