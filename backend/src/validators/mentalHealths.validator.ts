import { z } from "zod";

export const createMoodLogSchema = z.object({
  moodScore: z.number().int().min(1).max(5), // 1 (Awful) to 5 (Awesome)
  emotions: z.array(z.string()).min(1, "Select at least one emotion"),
  journalText: z.string().max(2000).optional(),
});

export type CreateMoodLogInput = z.infer<typeof createMoodLogSchema>;
