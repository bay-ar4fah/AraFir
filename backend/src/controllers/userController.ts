import { Request, Response } from "express";
import type { UserRole } from "../types/auth";

import {
  getUsers,
  getUserByEmail,
  createUser,
  updateUserRole,
  setUserActiveStatus,
  resetUserPassword,
} from "../services/userService";

import { validatePasswordPolicy } from "../utils/passwordPolicy";

const VALID_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "DFIR_MANAGER",
  "INVESTIGATOR",
  "ANALYST",
  "AUDITOR",
  "READ_ONLY",
];

export async function listUsers(
  _req: Request,
  res: Response
) {
  try {
    const users = await getUsers();

    return res.json(users);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load users",
    });
  }
}

export async function addUser(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "name, email, password, and role are required",
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        error: "Invalid role",
      });
    }

    const policy = validatePasswordPolicy(password);

    if (!policy.valid) {
    return res.status(400).json({
        error: "Password policy failed",
        details: policy.errors,
    });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    await createUser({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to create user",
    });
  }
}

export async function changeUserRole(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid user id",
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        error: "Invalid role",
      });
    }

    await updateUserRole({
      id,
      role,
    });

    return res.json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to update user role",
    });
  }
}

export async function disableUser(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid user id",
      });
    }

    if (req.user?.id === id) {
      return res.status(400).json({
        error: "You cannot disable your own account",
      });
    }

    await setUserActiveStatus({
      id,
      isActive: false,
    });

    return res.json({
      success: true,
      message: "User disabled successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to disable user",
    });
  }
}

export async function enableUser(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid user id",
      });
    }

    await setUserActiveStatus({
      id,
      isActive: true,
    });

    return res.json({
      success: true,
      message: "User enabled successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to enable user",
    });
  }
}

export async function resetPassword(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid user id",
      });
    }

    if (!password) {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    const policy = validatePasswordPolicy(password);

    if (!policy.valid) {
    return res.status(400).json({
        error: "Password policy failed",
        details: policy.errors,
    });
    }

    await resetUserPassword({
      id,
      password,
    });

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to reset password",
    });
  }
}