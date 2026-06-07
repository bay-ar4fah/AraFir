import { execFile } from "child_process";
import { promisify } from "util";

import type {
  ParsedEvtxEvent,
} from "./evtxTypes";

const execFileAsync = promisify(execFile);

function escapePowerShellPath(
  value: string
): string {
  return value.replace(/'/g, "''");
}

function parseJsonSafe(
  value: string
): ParsedEvtxEvent[] {
  if (!value.trim()) {
    return [];
  }

  const parsed = JSON.parse(value);

  if (Array.isArray(parsed)) {
    return parsed as ParsedEvtxEvent[];
  }

  return [parsed as ParsedEvtxEvent];
}

export async function parseEvtxFile(
  filePath: string
): Promise<ParsedEvtxEvent[]> {
  const safePath = escapePowerShellPath(filePath);

  const script = `
    $events = Get-WinEvent -Path '${safePath}' -ErrorAction Stop |
      Select-Object -First 200 |
      ForEach-Object {
        [PSCustomObject]@{
          eventId = "$($_.Id)"
          provider = "$($_.ProviderName)"
          computer = "$($_.MachineName)"
          timestamp = "$($_.TimeCreated.ToUniversalTime().ToString("o"))"
          level = "$($_.LevelDisplayName)"
          recordId = "$($_.RecordId)"
          message = "$($_.Message)"
          rawXml = "$($_.ToXml())"
        }
      }

    $events | ConvertTo-Json -Depth 5
  `;

  const { stdout } = await execFileAsync(
    "powershell.exe",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      script,
    ],
    {
      maxBuffer: 1024 * 1024 * 20,
    }
  );

  return parseJsonSafe(stdout);
}