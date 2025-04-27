import { z } from 'zod';

export const attendanceSchema = z.object({
  total_present: z.string().min(1, 'The Number is required'),
  doa: z.date({
    required_error: "Enter the date.",
  }),
  present_status:z.enum(['present','absent'])
});
