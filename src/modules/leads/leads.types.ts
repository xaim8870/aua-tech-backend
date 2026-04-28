//src/modules/leads/leads.types.ts
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "closed"
  | "spam";

export interface CreateLeadInput {
  full_name: string;
  email?: string;
  phone?: string;
  company?: string;
  service_interest?: string;
  budget_range?: string;
  timeline?: string;
  message: string;
  additional_details?: string;
  source_page?: string;
  form_type: string;
}