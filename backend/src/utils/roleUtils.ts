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