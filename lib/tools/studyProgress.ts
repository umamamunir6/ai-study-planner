import { z } from "zod";

type StudyData = {
  subjects: {
    id: number;
    name: string;
    description: string;
    color: string;
  }[];

  tasks: {
    id: number;
    title: string;
    subject: string;
    dueDate: string;
    priority: "Low" | "Medium" | "High";
    completed: boolean;
  }[];
};

export const createStudyProgressTool = (
  studyData: StudyData
) => ({
  description:
    "Get the student's current study progress, including overall completion and progress for each subject.",

  inputSchema: z.object({}),

  execute: async () => {
    const { subjects, tasks } = studyData;

    const subjectProgress = subjects.map((subject) => {
      const subjectTasks = tasks.filter(
        (task) => task.subject === subject.name
      );

      const completed = subjectTasks.filter(
        (task) => task.completed
      ).length;

      return {
        name: subject.name,
        completed,
        total: subjectTasks.length,
      };
    });

    const completedTasks = tasks.filter(
      (task) => task.completed
    ).length;

    const totalTasks = tasks.length;

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    return {
      completedTasks,
      totalTasks,
      completionRate,
      subjects: subjectProgress,
    };
  },
});