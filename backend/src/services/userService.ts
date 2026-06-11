import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { db } from "../database/db";
import type { UserRole } from "../types/auth";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export function getUsers(): Promise<UserRow[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        id,
        name,
        email,
        role,
        is_active,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
      `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as UserRow[]);
      }
    );
  });
}

export function getUserByEmail(
  email: string
): Promise<UserRow | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        id,
        name,
        email,
        role,
        is_active,
        created_at,
        updated_at
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

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<void> {
  const passwordHash = await bcrypt.hash(params.password, 12);

  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO users (
        id,
        name,
        email,
        password_hash,
        role,
        is_active,
        must_change_password
        ) VALUES (?, ?, ?, ?, ?, 1, 1)
      `,
      [
        randomUUID(),
        params.name,
        params.email,
        passwordHash,
        params.role,
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function updateUserRole(params: {
  id: string;
  role: UserRole;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE users
      SET role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [params.role, params.id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function setUserActiveStatus(params: {
  id: string;
  isActive: boolean;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE users
        SET
        password_hash = ?,
        must_change_password = 1,
        password_updated_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [params.isActive ? 1 : 0, params.id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export async function resetUserPassword(params: {
  id: string;
  password: string;
}): Promise<void> {
  const passwordHash = await bcrypt.hash(params.password, 12);

  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE users
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [passwordHash, params.id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export async function changeOwnPassword(params: {
  id: string;
  newPassword: string;
}): Promise<void> {
  const passwordHash = await bcrypt.hash(
    params.newPassword,
    12
  );

  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE users
      SET
        password_hash = ?,
        must_change_password = 0,
        password_updated_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        passwordHash,
        params.id,
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}