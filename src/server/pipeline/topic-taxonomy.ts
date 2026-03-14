import type { ContentPresetId } from "@/server/settings/presets";
import type { FeedItem, SourceItem } from "@/types/feed";

const AI_KEYWORDS = [
  "artificial intelligence",
  "generative ai",
  "llm",
  "language model",
  "agent",
  "agents",
  "openai",
  "anthropic",
  "claude",
  "chatgpt",
  "gemini",
  "llama",
  "hugging face",
  "diffusion",
  "rag",
  "prompt",
  "fine-tuning",
  "fine tuning",
  "inference"
];

const QUANTUM_KEYWORDS = [
  "quantum",
  "qubit",
  "qubits",
  "quantum computing",
  "quantum computer",
  "quantum processor",
  "quantum hardware",
  "quantum algorithm",
  "quantum circuit",
  "qiskit",
  "cirq",
  "pennylane",
  "braket",
  "q#",
  "superconducting",
  "trapped ion",
  "neutral atom",
  "photonic",
  "annealing",
  "fault tolerant",
  "fault-tolerant",
  "surface code",
  "logical qubit",
  "error correction",
  "qec",
  "ionq",
  "rigetti",
  "psiquantum",
  "xanadu",
  "d-wave",
  "quantinuum",
  "quera",
  "quant-ph"
];

const PRESET_TOPIC_OPTIONS: Record<ContentPresetId, string[]> = {
  ai: ["models", "agents", "tooling", "research", "product", "workflow", "evaluation"],
  quantum: ["hardware", "algorithms", "research", "industry", "software", "error_correction"]
};

const AI_TOPIC_KEYWORDS: Record<string, string[]> = {
  models: ["model", "models", "llm", "benchmark", "weights", "checkpoint", "inference"],
  agents: ["agent", "agents", "tool use", "tool-use", "browser use", "autonomous"],
  tooling: ["sdk", "framework", "api", "tooling", "playground", "platform", "integration"],
  research: ["paper", "research", "study", "preprint", "arxiv", "benchmark"],
  product: ["launch", "release", "pricing", "plan", "available", "beta", "enterprise"],
  workflow: ["workflow", "automation", "prompting", "ops", "stack", "playbook"],
  evaluation: ["eval", "evaluation", "hallucination", "reliability", "safety", "guardrail"]
};

const QUANTUM_TOPIC_KEYWORDS: Record<string, string[]> = {
  hardware: [
    "qubit",
    "processor",
    "chip",
    "hardware",
    "superconducting",
    "trapped ion",
    "neutral atom",
    "photonic",
    "cryogenic"
  ],
  algorithms: ["algorithm", "algorithms", "qaoa", "vqe", "grover", "shor", "annealing", "simulation"],
  research: ["paper", "research", "study", "preprint", "arxiv", "experiment", "demonstration"],
  industry: [
    "startup",
    "funding",
    "partnership",
    "roadmap",
    "enterprise",
    "commercial",
    "ionq",
    "rigetti",
    "psiquantum",
    "xanadu",
    "d-wave",
    "quantinuum",
    "quera",
    "ibm quantum",
    "aws braket",
    "google quantum"
  ],
  software: ["qiskit", "cirq", "pennylane", "braket", "q#", "sdk", "compiler", "runtime", "software"],
  error_correction: [
    "error correction",
    "qec",
    "logical qubit",
    "surface code",
    "fault tolerant",
    "fault-tolerant",
    "decoder"
  ]
};

function normalizeText(input: string): string {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function buildHaystack(feedItem: FeedItem, sourceItem?: SourceItem): string {
  return normalizeText(
    [
      feedItem.title,
      feedItem.summaryExcerpt,
      feedItem.normalizedText,
      sourceItem?.title,
      sourceItem?.rawText,
      feedItem.sourceAttribution.sourceUrl
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function includesAny(haystack: string, keywords: string[]): boolean {
  return keywords.some((keyword) => haystack.includes(keyword));
}

export function getPresetTopicOptions(presetId: ContentPresetId): string[] {
  return PRESET_TOPIC_OPTIONS[presetId];
}

export function inferTopicTags(params: {
  feedItem: FeedItem;
  sourceItem?: SourceItem;
  existingTags?: string[];
}): string[] {
  const haystack = buildHaystack(params.feedItem, params.sourceItem);
  const tags = new Set(params.existingTags ?? []);

  if (includesAny(haystack, AI_KEYWORDS)) {
    tags.add("ai");
  }

  if (includesAny(haystack, QUANTUM_KEYWORDS)) {
    tags.add("quantum");
  }

  for (const [topic, keywords] of Object.entries(AI_TOPIC_KEYWORDS)) {
    if (includesAny(haystack, keywords)) {
      tags.add(topic);
    }
  }

  for (const [topic, keywords] of Object.entries(QUANTUM_TOPIC_KEYWORDS)) {
    if (includesAny(haystack, keywords)) {
      tags.add(topic);
    }
  }

  return Array.from(tags);
}

export function isRelevantToPreset(
  presetId: ContentPresetId,
  params: { feedItem: FeedItem; sourceItem?: SourceItem; existingTags?: string[] }
): boolean {
  const tags = inferTopicTags(params);

  if (presetId === "quantum") {
    return tags.includes("quantum");
  }

  return tags.includes("ai") || !tags.includes("quantum");
}
