import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { db } from "../database/db";
import type { AuthUser, UserRole } from "../types/auth";

const JWT_SECRET =
  process.env.JWT_SECRET || "arafir_dev_secret_change_this";

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

function getActiveUserById(id: string): Promise<AuthUser | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT id, name, email, role
      FROM users
      WHERE id = ? AND is_active = 1
      `,
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row as AuthUser | undefined);
      }
    );
  });
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await getActiveUserById(payload.id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = user;

    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}