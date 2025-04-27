import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title name is required'),
  doe: z.date({
    required_error: "When the event will happen is required.",
  }),
  description: z.string().min(1, 'Description is required'),
  venue: z.string().min(1, 'Venue is required'),
});
