import type { Request } from "express";

export function getAuditActor(req: Request) {
  return {
    actorUserId: req.user?.id ?? null,
    actorName: req.user?.name ?? null,
    actorEmail: req.user?.email ?? null,
    actorRole: req.user?.role ?? null,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] ?? null,
  };
}