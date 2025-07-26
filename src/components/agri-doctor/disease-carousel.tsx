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
      
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {diseases.map((disease, index) => {
              const Icon = disease.icon;
              return (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 border-muted-foreground/20 bg-white/80 backdrop-blur-sm rounded-xl group">
                      <div className="relative">
                        <div className={`aspect-[4/3] w-full bg-gradient-to-br ${disease.gradient} flex items-center justify-center`}>
                          <div className="text-white text-center space-y-3 sm:space-y-4 p-4 sm:p-6">
                            <div className="bg-white/20 rounded-full p-4 sm:p-6 backdrop-blur-sm">
                              <Icon className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">
                                {disease.name}
                              </h3>
                              <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                                {disease.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                          <Badge className={`${disease.color} border font-medium text-xs rounded-lg shadow-lg`}>
                            {disease.severity}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="pt-2">
                          <Badge variant="outline" className="text-xs font-medium border-muted-foreground/30 text-muted-foreground rounded-lg">
                            Nhấp để xem chi tiết
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex left-2 bg-white/80 backdrop-blur-sm border-2 border-muted-foreground/20 hover:bg-white shadow-lg rounded-full w-10 h-10" />
          <CarouselNext className="hidden sm:flex right-2 bg-white/80 backdrop-blur-sm border-2 border-muted-foreground/20 hover:bg-white shadow-lg rounded-full w-10 h-10" />
        </Carousel>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
          *Hình ảnh chỉ mang tính chất minh họa. Để chẩn đoán chính xác, vui lòng sử dụng tính năng chẩn đoán AI.
        </p>
      </div>
    </section>
  );
}
