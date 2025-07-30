"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Leaf, Bug, Droplets, AlertTriangle, Shield, Zap } from "lucide-react";

const diseases = [
  {
    name: "Bệnh phấn trắng",
    icon: Leaf,
    gradient: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-50",
    hint: "powdery mildew",
    description: "Một bệnh nấm ảnh hưởng đến nhiều loại cây trồng, tạo ra lớp phấn trắng trên lá.",
    severity: "Trung bình",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  {
    name: "Đốm đen",
    icon: AlertTriangle,
    gradient: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-50",
    hint: "leaf spot",
    description: "Thường gặp trên hoa hồng, gây ra các đốm đen trên lá và làm lá rụng sớm.",
    severity: "Nhẹ",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  {
    name: "Bệnh gỉ sắt",
    icon: Shield,
    gradient: "from-red-400 to-red-600",
    bgColor: "bg-red-50",
    hint: "plant rust",
    description: "Bệnh nấm tạo ra các mụn mủ màu đỏ hoặc nâu trên lá và thân cây.",
    severity: "Nặng",
    color: "bg-red-100 text-red-800 border-red-300",
  },
  {
    name: "Sự phá hoại của rệp",
    icon: Bug,
    gradient: "from-orange-400 to-orange-600",
    bgColor: "bg-orange-50",
    hint: "plant pests",
    description: "Côn trùng nhỏ hút nhựa cây có thể gây hại cho cây trồng và truyền bệnh.",
    severity: "Trung bình",
    color: "bg-orange-100 text-orange-800 border-orange-300",
  },
  {
    name: "Bệnh cháy lá",
    icon: Zap,
    gradient: "from-red-500 to-red-700",
    bgColor: "bg-red-50",
    hint: "leaf blight",
    description: "Gây ra sự chuyển màu nâu nhanh chóng và chết của các mô thực vật.",
    severity: "Nặng",
    color: "bg-red-100 text-red-800 border-red-300",
  },
  {
    name: "Thối rễ",
    icon: Droplets,
    gradient: "from-brown-400 to-brown-600",
    bgColor: "bg-brown-50",
    hint: "root rot",
    description: "Thường do tưới quá nhiều nước và thoát nước kém, làm rễ bị thối đen.",
    severity: "Nặng",
    color: "bg-red-100 text-red-800 border-red-300",
  }
];

export function DiseaseCarousel() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-headline">
          Các bệnh thường gặp
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mx-auto leading-relaxed px-4">
          So sánh triệu chứng của cây với hướng dẫn trực quan về các bệnh và sâu bệnh phổ biến.
        </p>
      </div>

      <Carousel 
        className="w-full max-w-6xl mx-auto"
        opts={{
          align: "start",
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {diseases.map((disease, index) => {
            const Icon = disease.icon;
            return (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="card-ui h-full p-6 flex flex-col bg-card border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-secondary">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{disease.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground flex-grow mb-4">{disease.description}</p>
                  <Badge variant="secondary" className="self-start">{disease.severity}</Badge>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      </Carousel>
    </section>
  );
}
