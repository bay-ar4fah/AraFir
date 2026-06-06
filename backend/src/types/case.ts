export interface Case {

  id: string;

  caseName: string;

  description: string;

  createdAt: string;

  investigator: string;

  status: "OPEN" | "CLOSED" | "ARCHIVED";

}