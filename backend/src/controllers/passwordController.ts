import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { db } from "../database/db";
import { changeOwnPassword } from "../services/userService";
import { validatePasswordPolicy } from "../utils/passwordPolicy";

interface PasswordRow {
  password_hash: string;
}

function getUserPasswordHash(
  userId: string
): Promise<PasswordRow | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT password_hash
      FROM users
      WHERE id = ?
      `,
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row as PasswordRow | undefined);
      }
    );
  });
}

export async function changePassword(
  req: Request,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "currentPassword and newPassword are required",
      });
    }

    const policy = validatePasswordPolicy(newPassword);

    if (!policy.valid) {
      return res.status(400).json({
        error: "Password policy failed",
        details: policy.errors,
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: "New password must be different from current password",
      });
    }

    const row = await getUserPasswordHash(req.user.id);

    if (!row) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      row.password_hash
    );

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: "Current password is incorrect",
      });
    }

    await changeOwnPassword({
      id: req.user.id,
      newPassword,
    });

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to change password",
    });
  }
}