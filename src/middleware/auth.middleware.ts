import { NextFunction, Request, Response } from "express";
import { AuthService } from "../modules/auth/auth.service";

export const requireAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is invalid.",
      });
    }

    const user = await AuthService.verifyAccessToken(token);

    req.user = {
      id: user.id,
      email: user.email,
    };
    req.token = token;

    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Authentication failed.";

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is invalid.",
      });
    }

    const user = await AuthService.verifyAccessToken(token);
    const profile = await AuthService.getProfileById(user.id);

    if (!profile) {
      return res.status(403).json({
        success: false,
        message: "Profile not found. Ask admin to set up your account.",
      });
    }

    if (profile.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
    };
    req.profile = profile;
    req.token = token;

    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Authentication failed.";

    return res.status(401).json({
      success: false,
      message,
    });
  }
};