export const CONTENT_PRESETS = {
  ai: {
    id: "ai",
    label: "AI",
    appTitle: "AI Feed",
    homeTitle: "AI updates, turned into actions.",
    homeDescription:
      "This app collects useful AI news, workflows, launches, and experiments into one feed and explains what they mean in practical terms.",
    feedTitle: "One feed for AI workflows, launches, and signal.",
    feedDescription:
      "Persisted AI updates with source attribution and structured explanation previews across RSS/blogs, Reddit, YouTube, and X.",
    digestTitle: "Today in AI Feed",
    digestIntro:
      "A short catch-up on the most useful AI updates, workflows, and launches surfaced today.",
    defaults: {
      rssFeedUrls: "https://huggingface.co/blog/feed.xml,https://openai.com/news/rss.xml",
      redditSubreddits: "singularity,artificial,LocalLLaMA",
      youtubeChannelIds: "",
      youtubeFeedUrls: "",
      xSearchQuery: "AI OR LLM OR agent OR model OR generative AI"
    }
  },
  quantum: {
    id: "quantum",
    label: "Quantum",
    appTitle: "Quantum Feed",
    homeTitle: "Quantum updates, gathered into one working feed.",
    homeDescription:
      "This app tracks quantum computing research, hardware, software, algorithms, business moves, and community discussion across one product experience.",
    feedTitle: "One feed for quantum research, hardware, software, and industry signal.",
    feedDescription:
      "Persisted quantum updates with source attribution and structured explanation previews, designed for staying current on papers, platforms, companies, and debates.",
    digestTitle: "Today in Quantum Feed",
    digestIntro:
      "A short catch-up on the most useful quantum computing research, hardware, software, and industry developments surfaced today.",
    defaults: {
      rssFeedUrls:
        "https://export.arxiv.org/rss/quant-ph,https://aws.amazon.com/blogs/quantum-computing/feed/",
      redditSubreddits: "QuantumComputing,Qiskit,Physics",
      youtubeChannelIds: "",
      youtubeFeedUrls: "",
      xSearchQuery:
        "(quantum computing) OR qubit OR qubits OR Qiskit OR Cirq OR PennyLane OR IonQ OR Rigetti OR PsiQuantum OR Xanadu OR D-Wave OR Quantinuum OR QuEra OR quantum error correction"
    }
  }
} as const;

export type ContentPresetId = keyof typeof CONTENT_PRESETS;

export function getContentPreset(presetId: string | null | undefined) {
  if (!presetId || !(presetId in CONTENT_PRESETS)) {
    return CONTENT_PRESETS.ai;
  }

  return CONTENT_PRESETS[presetId as ContentPresetId];
}
