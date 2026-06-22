import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "../database/db";
import { ROLE_PERMISSIONS } from "../config/permissions";
import type { UserRole } from "../types/auth";

import {
  createAuditLog,
} from "../services/auditService";

import { formatRoleLabel } from "../utils/roleUtils";

const JWT_SECRET =
  process.env.JWT_SECRET || "arafir_dev_secret_change_this";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: number;
  must_change_password: number;
}

function getUserByEmail(
  email: string
): Promise<UserRow | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        id,
        name,
        email,
        password_hash,
        role,
        is_active,
        must_change_password
      FROM users
      WHERE email = ?
      `,
      [email],
      (err, row) => {
        if (err) reject(err);
        else resolve(row as UserRow | undefined);
      }
    );
  });
}

export async function login(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      await createAuditLog({
        action: "LOGIN_FAILED",
        actorEmail: email,
        status: "FAILED",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        message: "Account not found",
        metadata: {
          email,
          reason: "ACCOUNT_NOT_FOUND",
        },
      });

      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (user.is_active !== 1) {
      await createAuditLog({
        action: "LOGIN_FAILED",
        actorUserId: user.id,
        actorName: user.name,
        actorEmail: user.email,
        actorRole: user.role,
        status: "FAILED",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        message: "Account disabled",
        metadata: {
          email: user.email,
          reason: "ACCOUNT_DISABLED",
        },
      });

      return res.status(401).json({
        message: "Account is disabled",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isValidPassword) {
      await createAuditLog({
        action: "LOGIN_FAILED",
        actorUserId: user.id,
        actorName: user.name,
        actorEmail: user.email,
        actorRole: user.role,
        status: "FAILED",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        message: "Invalid password",
        metadata: {
          email: user.email,
          reason: "INVALID_PASSWORD",
        },
      });

      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    await createAuditLog({
      actorUserId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      actorRole: user.role,
      action: "LOGIN_SUCCESS",
      entityType: "USER",
      entityId: user.id,
      entityName: user.name,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      message: "User logged in successfully",
    });

    return res.json({
      token,
      user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          roleLabel: formatRoleLabel(user.role),
          permissions: ROLE_PERMISSIONS[user.role],
          mustChangePassword:
            user.must_change_password === 1,
        },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Login failed",
    });
  }
}

export function me(
  req: Request,
  res: Response
) {
  return res.json({
    user: req.user,
  });
}