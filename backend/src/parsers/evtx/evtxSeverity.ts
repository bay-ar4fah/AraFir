import type {
  TimelineEvent,
} from "../../types/timeline";

export function mapEvtxSeverity(
  eventId: string,
  message: string
): TimelineEvent["severity"] {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("mimikatz") ||
    lowerMessage.includes("sekurlsa") ||
    lowerMessage.includes("lsass") ||
    lowerMessage.includes("credential")
  ) {
    return "CRITICAL";
  }

  if (
    eventId === "4688" &&
    (
      lowerMessage.includes("powershell") ||
      lowerMessage.includes("cmd.exe") ||
      lowerMessage.includes("wscript") ||
      lowerMessage.includes("cscript")
    )
  ) {
    return "HIGH";
  }

  if (
    eventId === "4625" ||
    eventId === "4672" ||
    eventId === "7045"
  ) {
    return "HIGH";
  }

  if (
    eventId === "4624" ||
    eventId === "4688" ||
    eventId === "4697"
  ) {
    return "MEDIUM";
  }

  return "LOW";
}