import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? 'gpt-4o-mini'),
    system: 'You are a helpful AI assistant for mapii.ai.',
    messages,
  })

  return result.toDataStreamResponse()
}
