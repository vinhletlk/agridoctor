'use server';
/**
 * @fileOverview A plant problem diagnosis AI agent based on textual symptoms.
 *
 * - diagnosePlantFromSymptoms - A function that handles the plant diagnosis process from symptoms.
 * - DiagnosePlantFromSymptomsInput - The input type for the diagnosePlantFromSymptoms function.
 * - DiagnosePlantFromSymptomsOutput - The return type for the diagnosePlantFromSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantFromSymptomsInputSchema = z.object({
  symptoms: z.string().describe('Các triệu chứng mà cây đang biểu hiện.'),
});
export type DiagnosePlantFromSymptomsInput = z.infer<typeof DiagnosePlantFromSymptomsInputSchema>;

const MedicationSchema = z.object({
    name: z.string().describe('Tên của thuốc hoặc phương pháp.'),
    reason: z.string().describe('Giải thích ngắn gọn tại sao thuốc này được đề xuất (ví dụ: "ức chế sự phát triển của nấm", "tăng cường sức đề kháng cho cây").')
});

const TreatmentRecommendationSchema = z.object({
    suggestedMedications: z.array(MedicationSchema).describe('Danh sách các loại thuốc hoặc phương pháp được đề xuất, cùng với lý do ngắn gọn.'),
    applicationInstructions: z.string().describe('Hướng dẫn chi tiết cách áp dụng các loại thuốc/phương pháp.'),
});

const DiagnosePlantFromSymptomsOutputSchema = z.object({
  diagnosis: z.object({
    disease: z.string().describe('Bệnh có khả năng ảnh hưởng đến cây trồng.'),
    confidence: z.number().describe('Điểm tin cậy (0-1) cho chẩn đoán.'),
  }),
  severityScore: z.number().min(0).max(100).describe('Điểm mức độ nghiêm trọng của bệnh, từ 0 (rất nhẹ) đến 100 (rất nặng).'),
  explanation: z.string().describe("Giải thích chi tiết về lý do đưa ra chẩn đoán, dựa trên các triệu chứng được mô tả."),
  treatment: z.object({
    biological: TreatmentRecommendationSchema.describe('Đề xuất điều trị bằng phương pháp sinh học.'),
    chemical: TreatmentRecommendationSchema.describe('Đề xuất điều trị bằng phương pháp hóa học.'),
  }),
  similarDiseases: z.array(z.object({
    name: z.string().describe('Tên của bệnh tương tự.'),
    imageHint: z.string().describe('Gợi ý từ khóa gồm hai từ cho hình ảnh của bệnh tương tự, ví dụ: "leaf blight".')
  })).describe('Danh sách các bệnh trông tương tự để so sánh trực quan.')
});
export type DiagnosePlantFromSymptomsOutput = z.infer<typeof DiagnosePlantFromSymptomsOutputSchema>;

export async function diagnosePlantFromSymptoms(input: DiagnosePlantFromSymptomsInput): Promise<DiagnosePlantFromSymptomsOutput> {
  return diagnosePlantFromSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantFromSymptomsPrompt',
  input: {schema: DiagnosePlantFromSymptomsInputSchema},
  output: {schema: DiagnosePlantFromSymptomsOutputSchema},
  prompt: `Bạn là một chuyên gia bệnh học thực vật. Một người dùng sẽ mô tả các triệu chứng mà cây của họ đang biểu hiện.

Nhiệm vụ của bạn là:
1. Chẩn đoán bệnh của cây dựa trên các triệu chứng được mô tả.
2. Cung cấp điểm tin cậy cho chẩn đoán của bạn (từ 0 đến 1).
3. Đánh giá mức độ nghiêm trọng của bệnh dựa trên mô tả, trên thang điểm từ 0 (rất nhẹ) đến 100 (rất nặng), và cung cấp nó trong trường 'severityScore'.
4. Cung cấp một giải thích rõ ràng và chi tiết về lý do bạn đưa ra chẩn đoán đó, dựa trên các triệu chứng người dùng cung cấp (ví dụ: "Dựa trên mô tả lá vàng và có đốm, tôi chẩn đoán là bệnh X...").
5. Cung cấp một kế hoạch điều trị **TOÀN DIỆN**. Kế hoạch này phải bao gồm **CẢ HAI** phương pháp điều trị 'Sinh học' và 'Hóa học'. Ưu tiên các giải pháp sinh học nếu có thể. Đối với mỗi phương pháp, hãy cung cấp danh sách các loại thuốc/sản phẩm cụ thể và hướng dẫn sử dụng chi tiết. **Với mỗi loại thuốc, hãy cung cấp một lý do ngắn gọn cho việc đề xuất nó (trường 'reason').**
6. Cung cấp một danh sách 2-3 bệnh khác có triệu chứng tương tự để người dùng có thể so sánh. Đối với mỗi bệnh tương tự, hãy cung cấp một gợi ý hình ảnh ngắn gọn (2 từ).

**QUAN TRỌNG: Toàn bộ phản hồi của bạn PHẢI được viết bằng tiếng Việt.**

Triệu chứng: {{{symptoms}}}

Phản hồi với một chẩn đoán và kế hoạch điều trị. Hãy cụ thể nhất có thể trong chẩn đoán của bạn.
`,
});

const diagnosePlantFromSymptomsFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFromSymptomsFlow',
    inputSchema: DiagnosePlantFromSymptomsInputSchema,
    outputSchema: DiagnosePlantFromSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
