import { convertToModelMessages, streamText } from "ai";
import { aiModel, systemPrompt } from "@/lib/ai";
import { studyProgressTool } from "@/lib/tools/studyProgress";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: aiModel,

      system: `${systemPrompt}

You have access to a study progress tool.

When the student asks about their current study progress,
completed tasks, subject progress, or overall completion,
use the getStudyProgress tool instead of guessing.

Do not invent study progress information.`,

      messages: await convertToModelMessages(messages),

      tools: {
        getStudyProgress: studyProgressTool,
      },

      /*
       * Allow the model to call the tool and then continue
       * responding with the tool result.
       */
      stopWhen: ({ steps }) => steps.length >= 3,
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