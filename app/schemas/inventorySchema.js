import { z } from 'zod';

export const inventorySchema = z.object({
  qty: z.string().min(1, 'Quantity is required'),
  serial_number: z.string().optional(),
  item_name: z.string().min(1, "Item name is required"),
  issued_to:z.enum(['church','bible school']),
  description:z.string().min(1,"Item description is missing").max(50),
  date_received: z.date().optional(),
  current_condition: z.enum(['good','poor','faulty'])
});
