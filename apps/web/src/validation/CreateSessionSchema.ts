/**
 * CreateSessionSchema
 * Validation schema for creating a simulation session
 */

import { z } from "zod";

export const CreateSessionSchema = z.object({
  jobTitle: z.string().min(1, "any title is required").max(100, "any title too long"),
  level: z.string().min(1, "Level is required").max(50, "Level too long"),
  interviewType: z.enum(["RH", "Technique", "Manager"], {
    message: "Interview type must be RH, Technique, or Manager",
  }),
  duration: z.number().int().min(1, "Duration must be at least 1 minute").max(120, "Duration cannot exceed 120 minutes"),
});

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
