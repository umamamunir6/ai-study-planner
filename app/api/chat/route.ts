import { convertToModelMessages, streamText } from "ai";
import { aiModel, systemPrompt } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: aiModel,
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI chat error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate AI response.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}