import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  FIREWORKS_API_KEY: z.string().min(1),
  FIRECRAWL_API_KEY: z.string().min(1),
  MONGODB_URI: z.string().url(),
  WEBHOOK_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
