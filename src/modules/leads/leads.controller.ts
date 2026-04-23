import { Request, Response } from "express";
import { LeadsService } from "./leads.service";
import { createLeadSchema } from "./leads.validation";
import { LeadStatus } from "./leads.types";

const getSingleParam = (value: string | string[] | undefined): string | null => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return null;
};

const isLeadStatus = (value: unknown): value is LeadStatus => {
  return (
    value === "new" ||
    value === "contacted" ||
    value === "qualified" ||
    value === "closed" ||
    value === "spam"
  );
};

export class LeadsController {
  static async createLead(req: Request, res: Response) {
    try {
      const parsed = createLeadSchema.parse(req.body);

      const lead = await LeadsService.createLead(parsed);

      return res.status(201).json({
        success: true,
        message: "Lead submitted successfully.",
        data: lead,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Invalid request data",
      });
    }
  }

  static async getLeads(_req: Request, res: Response) {
    try {
      const leads = await LeadsService.getLeads();

      return res.status(200).json({
        success: true,
        data: leads,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch leads",
      });
    }
  }

  static async getLeadById(req: Request, res: Response) {
    try {
      const id = getSingleParam(req.params.id);

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Lead id is required.",
        });
      }

      const lead = await LeadsService.getLeadById(id);

      return res.status(200).json({
        success: true,
        data: lead,
      });
    } catch {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const id = getSingleParam(req.params.id);

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Lead id is required.",
        });
      }

      const { status } = req.body;

      if (!isLeadStatus(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid lead status.",
        });
      }

      const updated = await LeadsService.updateLeadStatus(id, status);

      return res.status(200).json({
        success: true,
        data: updated,
      });
    } catch {
      return res.status(400).json({
        success: false,
        message: "Failed to update status",
      });
    }
  }
}