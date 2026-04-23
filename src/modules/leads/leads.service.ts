import { supabaseAdmin } from "../../config/supabase";
import { CreateLeadInput, LeadStatus } from "./leads.types";
import { sendLeadEmail } from "../notifications/email.service";

export class LeadsService {
  static async createLead(data: CreateLeadInput) {
    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .insert({
        ...data,
        status: "new",
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    try {
      await sendLeadEmail(lead);
    } catch (emailError) {
      console.error("Failed to send lead email:", emailError);
    }

    return lead;
  }

  static async getLeads() {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getLeadById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateLeadStatus(id: string, status: LeadStatus) {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}