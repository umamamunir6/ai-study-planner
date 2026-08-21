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
    "Get the student's current study progress, including overall completion and progress for every subject that has tasks. This includes tasks belonging to subjects that may have been deleted.",

  inputSchema: z.object({}),

  execute: async () => {
    const { subjects, tasks } = studyData;

    // Start with currently active subjects.
    const subjectNames = new Set(
      subjects.map((subject) => subject.name)
    );

    // Also include subjects that still have tasks but are no longer
    // present in the current subjects list.
    tasks.forEach((task) => {
      if (task.subject.trim()) {
        subjectNames.add(task.subject);
      }
    });

    const subjectProgress = Array.from(subjectNames).map(
      (subjectName) => {
        const subjectTasks = tasks.filter(
          (task) => task.subject === subjectName
        );

        const completed = subjectTasks.filter(
          (task) => task.completed
        ).length;

        return {
          name: subjectName,
          completed,
          total: subjectTasks.length,
          remaining: subjectTasks.length - completed,
        };
      }
    );

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
