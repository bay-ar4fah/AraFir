export function formatRoleLabel(role: string): string {
  const roleMap: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    DFIR_MANAGER: "DFIR Manager",
    INVESTIGATOR: "Investigator",
    ANALYST: "Analyst",
    AUDITOR: "Auditor",
    READ_ONLY: "Read Only",
  };

  return roleMap[role] || role;
}

export function getInitials(name?: string | null): string {
  if (!name) return "AF";

  const parts = name
    .trim()
    .split(" ")
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}