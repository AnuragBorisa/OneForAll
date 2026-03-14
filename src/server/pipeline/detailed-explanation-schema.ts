import { z } from "zod";

export const detailedExplanationSchema = z.object({
  whatHappened: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).min(3).max(6),
  whyItMatters: z.string().min(1),
  practicalTakeaways: z.array(z.string().min(1)).min(2).max(5),
  risksAndUnknowns: z.array(z.string().min(1)).min(2).max(5),
  nextSteps: z.array(z.string().min(1)).min(2).max(5),
  sourceLimits: z.string().min(1).nullable().optional()
});

export type DetailedExplanationPayload = z.infer<typeof detailedExplanationSchema>;

export function validateDetailedExplanationPayload(input: unknown): DetailedExplanationPayload {
  return detailedExplanationSchema.parse(input);
}
