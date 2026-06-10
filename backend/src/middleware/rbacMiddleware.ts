import { NextFunction, Request, Response } from "express";
import type { Permission } from "../types/auth";
import { ROLE_PERMISSIONS } from "../config/permissions";

export function requirePermission(permission: Permission) {
  return function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permission",
        requiredPermission: permission,
      });
    }

    next();
  };
}