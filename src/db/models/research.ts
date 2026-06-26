import mongoose from "mongoose";
import type { ResearchSession } from "../../schemas/research.js";

const schema = new mongoose.Schema<ResearchSession>(
  {
    telegramUserId: { type: Number, required: true, index: true },
    chatId: { type: Number, required: true, index: true },
    query: { type: String, required: true },
    output: {
      summary: String,
      keyPoints: [String],
      sources: [{ url: String, title: String, relevance: String }],
      topic: String,
      confidence: String,
    },
  },
  { timestamps: true }
);

schema.index({ "output.topic": "text", query: "text", "output.summary": "text" });

export const ResearchModel = mongoose.model("Research", schema);
