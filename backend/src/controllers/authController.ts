import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "../database/db";
import { ROLE_PERMISSIONS } from "../config/permissions";
import type { UserRole } from "../types/auth";

const JWT_SECRET =
  process.env.JWT_SECRET || "arafir_dev_secret_change_this";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: number;
}

function getUserByEmail(email: string): Promise<UserRow | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT id, name, email, password_hash, role, is_active
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

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await getUserByEmail(email);

    if (!user || user.is_active !== 1) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isValidPassword) {
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

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: ROLE_PERMISSIONS[user.role],
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Login failed",
    });
  }
}

export function me(req: Request, res: Response) {
  return res.json({
    user: req.user,
  });
}