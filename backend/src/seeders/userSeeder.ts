import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

import { db } from "../database/db";

function getUserByEmail(
  email: string
): Promise<{ id: string } | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id FROM users WHERE email = ?",
      [email],
      (err, row) => {
        if (err) reject(err);
        else resolve(row as { id: string } | undefined);
      }
    );
  });
}

function insertAdmin(params: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO users (
        id,
        name,
        email,
        password_hash,
        role
      ) VALUES (?, ?, ?, ?, ?)
      `,
      [
        params.id,
        params.name,
        params.email,
        params.passwordHash,
        params.role,
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export async function seedDefaultAdmin() {
  const email = "admin@arafir.local";
  const password = "Admin@12345";

  const existing = await getUserByEmail(email);

  if (existing) {
    console.log("Default admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await insertAdmin({
    id: randomUUID(),
    name: "AraFir Super Admin",
    email,
    passwordHash,
    role: "SUPER_ADMIN",
  });

  console.log("Default admin created");
}