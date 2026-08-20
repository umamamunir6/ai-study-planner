import { generateText } from "ai";
import { aiModel } from "@/lib/ai";
import { z } from "zod";

const planSchema = z.object({
  sessions: z.array(
    z.object({
      title: z.string(),
      subject: z.string(),
      day: z.number(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const { subjects, days, hours } = await req.json();

    if (!subjects || subjects.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No subjects were provided.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const prompt = `
Create a realistic study plan for a student.

Subjects:
${subjects.map((subject: string) => `- ${subject}`).join("\n")}

Number of days: ${days}
Study hours per day: ${hours}

Distribute the subjects reasonably across the available days.

Create study sessions that are specific and useful.
For example:
- Review Binary Search
- Practice Merge Sort
- Study React Components
- Revise AES Encryption

Return ONLY valid JSON in this exact structure:

{
  "sessions": [
    {
      "title": "Review Binary Search",
      "subject": "Data Structures & Algorithms",
      "day": 1
    }
  ]
}

The "day" must be a number from 1 to ${days}.
`;

    const result = await generateText({
      model: aiModel,
      prompt,
    });

    let parsed;

    try {
      parsed = JSON.parse(result.text);
    } catch {
      return new Response(
        JSON.stringify({
          error: "AI returned an invalid study plan.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const validated = planSchema.safeParse(parsed);

    if (!validated.success) {
      return new Response(
        JSON.stringify({
          error: "AI returned an invalid study plan.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return Response.json(validated.data);
  } catch (error) {
    console.error("Planner AI error:", error);

    return new Response(
      JSON.stringify({
        error:
          "The AI planner is temporarily unavailable. Please try again.",
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