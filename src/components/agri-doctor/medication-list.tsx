"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Shield, Droplets, Zap, FlaskConical, SprayCan } from "lucide-react";

const medications = [
  {
    name: "Thuốc diệt nấm sinh học",
    usage: "Kiểm soát hiệu quả bệnh phấn trắng và sương mai. An toàn cho cây trồng và môi trường.",
    icon: Leaf,
    gradient: "from-green-400 to-green-600",
    hint: "organic fungicide",
    type: "Sinh học",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  {
    name: "Dầu Neem",
    usage: "Một loại thuốc trừ sâu và diệt nấm phổ rộng hữu cơ, hiệu quả chống lại rệp và bệnh gỉ sắt.",
    icon: Droplets,
    gradient: "from-emerald-400 to-emerald-600",
    hint: "neem oil bottle",
    type: "Hữu cơ",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    name: "Thuốc trừ sâu Pyrethrin",
    usage: "Thuốc trừ sâu tự nhiên có nguồn gốc từ hoa cúc, hiệu quả chống lại nhiều loại côn trùng.",
    icon: Zap,
    gradient: "from-yellow-400 to-yellow-600",
    hint: "pyrethrin insecticide",
    type: "Tự nhiên",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  {
    name: "Đồng sunfat",
    usage: "Được sử dụng để ngăn ngừa bệnh bạc lá và các bệnh nấm khác trên rau và trái cây.",
    icon: Shield,
    gradient: "from-blue-400 to-blue-600",
    hint: "copper sulfate",
    type: "Hóa học",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    name: "Xà phòng diệt côn trùng",
    usage: "Kiểm soát các loài côn trùng thân mềm như rệp, nhện và ruồi trắng khi tiếp xúc.",
    icon: SprayCan,
    gradient: "from-emerald-400 to-emerald-600",
    hint: "insecticidal soap",
    type: "Hữu cơ",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
   {
    name: "Lưu huỳnh",
    usage: "Một loại thuốc diệt nấm và thuốc trừ sâu tự nhiên, được sử dụng để kiểm soát bệnh phấn trắng, bệnh gỉ sắt và ve.",
    icon: FlaskConical,
    gradient: "from-yellow-500 to-yellow-700",
    hint: "sulfur powder",
    type: "Tự nhiên",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
];

export function MedicationList() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-headline">
          Các loại thuốc phổ biến
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mx-auto leading-relaxed px-4">
          Khám phá các phương pháp điều trị hiệu quả. Luôn đọc kỹ nhãn và hướng dẫn sử dụng.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {medications.map((med, index) => {
          const Icon = med.icon;
          return (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 border-muted-foreground/20 bg-white/80 backdrop-blur-sm rounded-xl group">
              <div className="relative">
                <div className={`aspect-[4/3] w-full bg-gradient-to-br ${med.gradient} flex items-center justify-center`}>
                  <div className="text-white text-center space-y-3 sm:space-y-4 p-4 sm:p-6">
                    <div className="bg-white/20 rounded-full p-3 sm:p-4 backdrop-blur-sm">
                      <Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-lg">
                        {med.name}
                      </h3>
                      <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                        {med.usage}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <Badge className={`${med.color} border font-medium text-xs rounded-lg shadow-lg flex items-center gap-1`}>
                    <Icon className="h-3 w-3" />
                    {med.type}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3 sm:p-4">
                <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                  <Badge variant="outline" className="text-xs font-medium border-muted-foreground/30 text-muted-foreground rounded-lg">
                    Tham khảo ý kiến chuyên gia
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center space-y-4">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 sm:p-6 max-w-4xl mx-auto">
          <h3 className="font-bold text-amber-800 text-base sm:text-lg lg:text-xl mb-2">
            ⚠️ Lưu ý quan trọng
          </h3>
          <p className="text-amber-700 text-sm sm:text-base leading-relaxed">
            Luôn đọc kỹ hướng dẫn sử dụng và tuân thủ liều lượng khuyến nghị. 
            Sử dụng thiết bị bảo hộ khi phun thuốc và tránh phun trong điều kiện gió mạnh.
          </p>
        </div>
        
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
          *Thông tin chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến chuyên gia nông nghiệp trước khi sử dụng.
        </p>
      </div>
    </section>
  );
}
