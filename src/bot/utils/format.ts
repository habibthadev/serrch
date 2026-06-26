import type { ResearchOutput } from "../../schemas/research.js";

export function formatOutput(output: ResearchOutput): string {
  const lines: string[] = [];

  lines.push(`**${output.topic}**`);
  lines.push("");
  lines.push(output.summary);
  lines.push("");

  lines.push("**Key Points:**");
  for (const point of output.keyPoints) {
    lines.push(`- ${point}`);
  }
  lines.push("");

  if (output.sources.length > 0) {
    lines.push("**Sources:**");
    for (const source of output.sources) {
      const urlPart = source.url ? ` <${source.url}>` : "";
      lines.push(`- ${source.title}${urlPart}`);
    }
    lines.push("");
  }

  lines.push(`Confidence: ${output.confidence}`);

  return lines.join("\n");
}

export function chunkMessage(text: string, size: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}
