//src/modules/leads/leads.validation.ts
import { z } from "zod";

export const createLeadSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service_interest: z.string().optional(),
  budget_range: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(5),
  additional_details: z.string().optional(),
  source_page: z.string().optional(),
  form_type: z.string().min(1),
});