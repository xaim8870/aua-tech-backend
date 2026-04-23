import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async me(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      message: "Authenticated user fetched successfully.",
      data: {
        user: req.user,
        profile: req.profile,
      },
    });
  }

  static async bootstrapProfile(req: Request, res: Response) {
    try {
      const authenticatedUser = req.user;

      if (!authenticatedUser?.id || !authenticatedUser.email) {
        return res.status(400).json({
          success: false,
          message: "Authenticated user information is incomplete.",
        });
      }

      const profile = await AuthService.createProfileIfMissing({
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        full_name: req.body.full_name,
      });

      return res.status(200).json({
        success: true,
        message: "Profile is ready.",
        data: profile,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to prepare profile.";

      return res.status(500).json({
        success: false,
        message,
      });
    }
  }
}