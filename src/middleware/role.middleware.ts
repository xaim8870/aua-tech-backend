import { NextFunction, Request, Response } from "express";
import { UserRole } from "../modules/auth/auth.types";

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.profile) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    if (!allowedRoles.includes(req.profile.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};