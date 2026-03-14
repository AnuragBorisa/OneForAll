import { z } from "zod";

export const explanationBlockSchema = z.object({
  simpleExplanation: z.string().min(1),
  whyItMatters: z.string().min(1),
  example: z.string().nullable().optional(),
  useCases: z.array(z.string()).default([]),
  whoShouldCare: z.array(z.string()).default([]),
  tryItNext: z.string().min(1),
  credibilityNotes: z.string().nullable().optional()
});

export type ExplanationPayload = z.infer<typeof explanationBlockSchema>;

export function validateExplanationPayload(input: unknown): ExplanationPayload {
  return explanationBlockSchema.parse(input);
}

export function isPublishableExplanation(input: unknown): boolean {
  const result = explanationBlockSchema.safeParse(input);
  return result.success;
}
