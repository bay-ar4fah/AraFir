import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { changePasswordRequest } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function ForceChangePassword() {
  const navigate = useNavigate();
  const { markPasswordChanged } = useAuth();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    try {
      setIsLoading(true);

      await changePasswordRequest({
        currentPassword,
        newPassword,
      });

      markPasswordChanged();
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to change password"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <h1 className="text-2xl font-bold">
          Change Password Required
        </h1>

        <p className="text-sm text-zinc-400 mt-2 mb-6">
          Your account is using a temporary password.
          Please create a new password before continuing.
        </p>

        {error && (
          <div className="mb-4 rounded border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <input
          type="password"
          className="w-full mb-4 rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
        />

        <input
          type="password"
          className="w-full mb-4 rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        <input
          type="password"
          className="w-full mb-4 rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <div className="mb-6 text-xs text-zinc-400">
          Password must contain at least 10 characters,
          uppercase, lowercase, number, and special character.
        </div>

        <button
          disabled={isLoading}
          className="w-full rounded bg-cyan-600 py-2 font-medium hover:bg-cyan-700 disabled:opacity-60"
        >
          {isLoading
            ? "Updating..."
            : "Change Password"}
        </button>
      </form>
    </div>
  );
}