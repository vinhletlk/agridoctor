// This is an autogenerated file from Firebase Studio.
'use server';
/**
 * @fileOverview An image-based insect identification AI agent.
 *
 * - identifyInsectFromImage - A function that handles the insect identification process from an image.
 * - IdentifyInsectFromImageInput - The input type for the identifyInsectFromImage function.
 * - IdentifyInsectFromImageOutput - The return type for the identifyInsectFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyInsectFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an insect, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyInsectFromImageInput = z.infer<typeof IdentifyInsectFromImageInputSchema>;

const ControlMethodSchema = z.object({
    name: z.string().describe('Tên của phương pháp hoặc sản phẩm.'),
    reason: z.string().describe('Giải thích ngắn gọn tại sao phương pháp này được đề xuất (ví dụ: "an toàn cho thiên địch", "phổ tác động rộng").')
});

const ControlMethodRecommendationSchema = z.object({
    suggestedMethods: z.array(ControlMethodSchema).describe('Danh sách các phương pháp hoặc sản phẩm được đề xuất, cùng với lý do ngắn gọn.'),
    instructions: z.string().describe('Hướng dẫn chi tiết cách áp dụng các phương pháp.'),
});

const IdentifyInsectFromImageOutputSchema = z.object({
  identification: z.string().describe("Tên gọi phổ biến nhất của loài côn trùng được xác định."),
  description: z.string().describe("Mô tả ngắn gọn về loài côn trùng, bao gồm các đặc điểm và tập tính chính."),
  explanation: z.string().describe("Giải thích chi tiết về lý do đưa ra nhận dạng, dựa trên các đặc điểm hình thái trong ảnh."),
  isHarmful: z.boolean().describe("Côn trùng này có hại cho cây trồng hay không."),
  controlMethods: z.object({
    biological: ControlMethodRecommendationSchema.describe('Đề xuất kiểm soát bằng phương pháp sinh học.'),
    chemical: ControlMethodRecommendationSchema.describe('Đề xuất kiểm soát bằng phương pháp hóa học.'),
  })
});
export type IdentifyInsectFromImageOutput = z.infer<typeof IdentifyInsectFromImageOutputSchema>;

export async function identifyInsectFromImage(input: IdentifyInsectFromImageInput): Promise<IdentifyInsectFromImageOutput> {
  return identifyInsectFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyInsectFromImagePrompt',
  input: {schema: IdentifyInsectFromImageInputSchema},
  output: {schema: IdentifyInsectFromImageOutputSchema},
  prompt: `Bạn là một nhà côn trùng học chuyên nhận dạng côn trùng và đề xuất các biện pháp kiểm soát chúng.

Nhiệm vụ của bạn là:
1. Xác định côn trùng trong hình ảnh. Hãy cung cấp tên gọi phổ biến nhất của nó.
2. Cung cấp một mô tả ngắn gọn về nó.
3. Cung cấp một giải thích rõ ràng và chi tiết về lý do bạn đưa ra nhận dạng đó, dựa trên các đặc điểm hình thái nhìn thấy trong ảnh (ví dụ: "Tôi xác định đây là con X vì nó có 6 chân, cánh trong suốt và râu dài...").
4. Cho biết nó có hại cho cây trồng hay không.
5. Cung cấp một kế hoạch kiểm soát **TOÀN DIỆN**. Kế hoạch này phải bao gồm **CẢ HAI** phương pháp kiểm soát 'Sinh học' và 'Hóa học'. Ưu tiên các giải pháp sinh học nếu có thể. Đối với mỗi phương pháp, hãy cung cấp danh sách các phương pháp/sản phẩm cụ thể và hướng dẫn áp dụng chi tiết. **Với mỗi phương pháp/sản phẩm, hãy cung cấp một lý do ngắn gọn cho việc đề xuất nó (trường 'reason').**

**QUAN TRỌNG: Toàn bộ phản hồi của bạn PHẢI được viết bằng tiếng Việt.**

Hình ảnh côn trùng: {{media url=photoDataUri}}
`,
});

const identifyInsectFromImageFlow = ai.defineFlow(
  {
    name: 'identifyInsectFromImageFlow',
    inputSchema: IdentifyInsectFromImageInputSchema,
    outputSchema: IdentifyInsectFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
