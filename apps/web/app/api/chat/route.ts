import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? "gpt-4o"),
    system: `You are a helpful AI assistant for mapii.ai, a Local Map and Google Business intelligence platform.
You help users understand local business data, SEO insights, competitor analysis, and map-based intelligence.
Be concise, data-driven, and actionable.`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
