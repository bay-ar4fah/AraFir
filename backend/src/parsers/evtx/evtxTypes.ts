export interface ParsedEvtxEvent {
  eventId: string;
  provider: string;
  computer: string;
  timestamp: string;
  level: string;
  recordId: string;
  message: string;
  rawXml: string;
}