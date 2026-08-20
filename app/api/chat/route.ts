import { convertToModelMessages, streamText } from "ai";
import { aiModel, systemPrompt } from "@/lib/ai";
import { createStudyProgressTool } from "@/lib/tools/studyProgress";

export async function POST(req: Request) {
  try {
    const { messages, studyData } = await req.json();

    const result = streamText({
      model: aiModel,

      system: `${systemPrompt}

You are an AI Study Assistant.

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
Use the returned tool data to answer the student.

You also have access to the student's actual subjects and tasks through the study progress tool.

Use the real data when answering questions about their studies.`,

      messages: await convertToModelMessages(messages),

      tools: {
        getStudyProgress: createStudyProgressTool(
          studyData ?? {
            subjects: [],
            tasks: [],
          }
        ),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI chat error:", error);

    return new Response(
      JSON.stringify({
        error:
          "The AI service is temporarily unavailable. Please try again.",
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