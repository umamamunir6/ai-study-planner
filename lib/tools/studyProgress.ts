import { z } from "zod";

/*
 * FE-07: Study Progress Tool
 *
 * This tool gives the AI structured study-progress data.
 *
 * The schema defines exactly what arguments the AI can provide.
 * The execute function performs the actual server-side work.
 */

export const studyProgressTool = {
  description:
    "Get the student's current study progress, including overall completion and progress for each subject.",

  inputSchema: z.object({}),

  execute: async () => {
    /*
     * For FE-07, we use representative study-planner data.
     *
     * Later this can be replaced with a database query
     * from the student's actual tasks and subjects.
     */

    const subjects = [
      {
        name: "Data Structures & Algorithms",
        completed: 8,
        total: 10,
      },
      {
        name: "Web Development",
        completed: 6,
        total: 8,
      },
      {
        name: "Information Security",
        completed: 4,
        total: 7,
      },
    ];

    const completedTasks = subjects.reduce(
      (total, subject) => total + subject.completed,
      0
    );

    const totalTasks = subjects.reduce(
      (total, subject) => total + subject.total,
      0
    );

    const completionRate = Math.round(
      (completedTasks / totalTasks) * 100
    );

    return {
      completedTasks,
      totalTasks,
      completionRate,
      subjects,
    };
  },
};