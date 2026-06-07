export interface AttackStorySection {
  title: string;
  content: string;
}

export interface AttackStory {
  caseId: string;
  executiveSummary: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  attackPath: AttackStorySection[];
  detectedTechniques: AttackStorySection[];
  recommendedActions: string[];
  generatedAt: string;
}