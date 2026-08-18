import { convertToModelMessages, streamText } from "ai";
import { aiModel, systemPrompt } from "@/lib/ai";
import { studyProgressTool } from "@/lib/tools/studyProgress";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const result = streamText({
      model: aiModel,

      system: `${systemPrompt}

You have access to a study progress tool called getStudyProgress.

When the student asks about:
- current study progress
- completed tasks
- subject progress
- overall completion
- study status

you MUST use getStudyProgress.

Do NOT say that you cannot access the student's study progress.
Do NOT invent study progress information.
Use the returned tool data to answer the student.`,

      messages: await convertToModelMessages(messages),

      tools: {
        getStudyProgress: studyProgressTool,
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI chat error:", error);

    return new Response(
      JSON.stringify({
        error: "The AI service is temporarily unavailable. Please try again.",
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}