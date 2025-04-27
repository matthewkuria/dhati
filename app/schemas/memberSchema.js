import { z } from 'zod';

export const memberSchema = z.object({
  user:z.string().optional(),
  full_name: z.string().min(1, 'Full name is required'),
  member_number: z.string().min(1, 'Member number is required'),
  membership: z.enum(['regular', 'associate', 'guest']),
  baptism_status: z.enum(['no', 'yes']),
  baptism_date: z.date({ 
    required_error:"Baptism date required"
  }).optional(),
  marital_status: z.enum(['single', 'married', 'widowed', 'divorced']),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.enum(['male', 'female']),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits').max(10,"Mobile number should not be more than 10"),
  residence: z.string().min(1, 'Residence is required'),
  postal_address: z.string().optional(),
  date_joined: z.date({
    required_error: "A date  is required.",
  }).optional(),
  date_left: z.date().optional(),
});
