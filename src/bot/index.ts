import { Bot } from "grammy";
import { env } from "../schemas/env.js";

export const bot = new Bot(env.TELEGRAM_BOT_TOKEN);
