import { useEffect, useState } from "react";
import type { AppUser } from "../../types/user";
import type { UserRole } from "../../types/auth";

import {
  getUsers,
  createUser,
  updateUserRole,
  disableUser,
  enableUser,
  resetUserPassword,
} from "../../services/userService";

const ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "DFIR_MANAGER",
  "INVESTIGATOR",
  "ANALYST",
  "AUDITOR",
  "READ_ONLY",
];

export default function UserManagement() {
  const [users, setUsers] =
    useState<AppUser[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "User@12345",
    role: "INVESTIGATOR" as UserRole,
  });

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please complete all fields");
      return;
    }

    await createUser(form);

    setForm({
      name: "",
      email: "",
      password: "User@12345",
      role: "INVESTIGATOR",
    });

    await loadUsers();
  };

  const handleRoleChange = async (
    userId: string,
    role: UserRole
  ) => {
    await updateUserRole(userId, role);
    await loadUsers();
  };

  const handleResetPassword = async (
    userId: string
  ) => {
    const password = window.prompt(
      "New temporary password",
      "User@12345"
    );

    if (!password) return;

    await resetUserPassword(userId, password);
    alert("Password reset successfully");
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white space-y-6">
      <div className="bg-black border border-zinc-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold">
          User Management
        </h1>

        <p className="text-zinc-400 text-sm mt-1">
          Manage AraFir users, roles, and account status.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Create User
        </h2>

        <div className="grid grid-cols-4 gap-3">
          <input
            className="bg-black border border-zinc-700 rounded px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            className="bg-black border border-zinc-700 rounded px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            className="bg-black border border-zinc-700 rounded px-3 py-2"
            placeholder="Temporary Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <select
            className="bg-black border border-zinc-700 rounded px-3 py-2"
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value as UserRole,
              })
            }
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreateUser}
          className="mt-4 px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700"
        >
          Create User
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Users
        </h2>

        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-black border border-zinc-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">
                  {user.name}
                </p>

                <p className="text-sm text-zinc-400">
                  {user.email}
                </p>

                <p className="text-xs text-zinc-500">
                  Created:{" "}
                  {new Date(
                    user.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-sm"
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(
                      user.id,
                      e.target.value as UserRole
                    )
                  }
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>

                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.is_active
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {user.is_active ? "Active" : "Disabled"}
                </span>

                <button
                  onClick={() =>
                    handleResetPassword(user.id)
                  }
                  className="px-3 py-1 rounded border border-zinc-700 text-sm"
                >
                  Reset Password
                </button>

                {user.is_active ? (
                  <button
                    onClick={async () => {
                      await disableUser(user.id);
                      await loadUsers();
                    }}
                    className="px-3 py-1 rounded border border-red-500/30 text-red-400 text-sm"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      await enableUser(user.id);
                      await loadUsers();
                    }}
                    className="px-3 py-1 rounded border border-green-500/30 text-green-400 text-sm"
                  >
                    Enable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}