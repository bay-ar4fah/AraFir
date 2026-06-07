export function mapEvtxEventType(
  eventId: string,
  message: string
): string {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("mimikatz") ||
    lowerMessage.includes("sekurlsa")
  ) {
    return "CREDENTIAL_DUMPING";
  }

  if (
    eventId === "4688" &&
    lowerMessage.includes("powershell")
  ) {
    return "POWERSHELL_EXECUTION";
  }

  if (eventId === "4688") {
    return "PROCESS_CREATE";
  }

  if (eventId === "4624") {
    return "LOGON_SUCCESS";
  }

  if (eventId === "4625") {
    return "LOGON_FAILURE";
  }

  if (eventId === "4672") {
    return "SPECIAL_PRIVILEGES_ASSIGNED";
  }

  if (eventId === "7045") {
    return "SERVICE_INSTALLED";
  }

  return `WINDOWS_EVENT_${eventId}`;
}