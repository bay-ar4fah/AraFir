import {
  useEffect,
  useState,
} from "react";

import type {
  AppUser,
} from "../../types/user";

import {
  getCaseAssignableUsers,
} from "../../services/userService";

interface Props {
  currentInvestigatorId?: string;
  onClose: () => void;
  onSubmit: (
    investigatorId: string,
    reason: string
  ) => Promise<void>;
}

export default function ReassignCaseModal({
  currentInvestigatorId,
  onClose,
  onSubmit,
}: Props) {
  const [users, setUsers] =
    useState<AppUser[]>([]);

  const [investigatorId, setInvestigatorId] =
    useState("");

  const [reason, setReason] =
    useState("Workload balancing");

  const [isLoadingUsers, setIsLoadingUsers] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoadingUsers(true);

        const data =
          await getCaseAssignableUsers();

        setUsers(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load investigator list");
      } finally {
        setIsLoadingUsers(false);
      }
    }

    loadUsers();
  }, []);

  async function handleSubmit() {
    if (!investigatorId) {
      alert("Please select new investigator");
      return;
    }

    if (
      currentInvestigatorId &&
      investigatorId === currentInvestigatorId
    ) {
      alert(
        "Selected investigator is already assigned to this case"
      );
      return;
    }

    if (!reason.trim()) {
      alert("Reassignment reason is required");
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit(
        investigatorId,
        reason.trim()
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-[520px] p-6 shadow-xl shadow-black/50">
        <h2 className="text-2xl font-bold">
          Reassign Investigator
        </h2>

        <p className="text-sm text-zinc-400 mt-2 mb-6">
          Assign this case to another active DFIR Manager
          or Investigator.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              New Investigator
            </label>

            <select
              value={investigatorId}
              onChange={(e) =>
                setInvestigatorId(
                  e.target.value
                )
              }
              disabled={
                isLoadingUsers ||
                isSubmitting
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 outline-none"
            >
              <option value="">
                {isLoadingUsers
                  ? "Loading investigators..."
                  : "Select investigator"}
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                  disabled={
                    user.id === currentInvestigatorId
                  }
                >
                  {user.name} ({user.role})
                  {user.id === currentInvestigatorId
                    ? " — Current"
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Reason
            </label>

            <textarea
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              disabled={isSubmitting}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 outline-none h-24"
              placeholder="Reason for reassignment"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Reassigning..."
              : "Reassign"}
          </button>
        </div>
      </div>
    </div>
  );
}