"use client";

import { useEffect, useState } from "react";

type Subject = {
  id: number;
  name: string;
  description: string;
  color: string;
};

type Priority = "Low" | "Medium" | "High";

type Task = {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
};

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedSubjects = localStorage.getItem(
      "study-planner-subjects"
    );

    const savedTasks = localStorage.getItem(
      "study-planner-tasks"
    );

    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </main>
    );
  }

  const totalSubjects = subjects.length;
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const remainingTasks = totalTasks - completedTasks;

  const overallProgress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) =>
      a.dueDate.localeCompare(b.dueDate)
    )
    .slice(0, 5);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Study Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Track your subjects, tasks, and overall study
          progress.
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-8 flex flex-wrap gap-3">
        <a
          href="/tasks"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Task
        </a>

        <a
          href="/subjects"
          className="rounded-lg border bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          + Add Subject
        </a>

        <a
          href="/planner"
          className="rounded-lg border bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          ✨ AI Planner
        </a>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Subjects
          </p>

          <p className="mt-2 text-3xl font-bold">
            {totalSubjects}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Currently studying
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Tasks
          </p>

          <p className="mt-2 text-3xl font-bold">
            {totalTasks}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            All study tasks
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {completedTasks}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Tasks completed
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Remaining
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            {remainingTasks}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Tasks left
          </p>
        </div>
      </div>

      {/* OVERALL PROGRESS */}
      <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Overall Study Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Based on completed tasks
            </p>
          </div>

          <span className="text-2xl font-bold text-blue-600">
            {overallProgress}%
          </span>
        </div>

        <div
          className="h-4 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-valuenow={overallProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall study progress"
        >
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${overallProgress}%`,
            }}
          />
        </div>

        <p className="mt-3 text-sm text-gray-500">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </section>

      {/* SUBJECT PROGRESS */}
      <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Subject Progress
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Progress is calculated from completed tasks.
          </p>
        </div>

        {subjects.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <div className="mb-3 text-3xl">
              📚
            </div>

            <p className="font-medium">
              No subjects yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first subject to start tracking
              progress.
            </p>

            <a
              href="/subjects"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Add a subject →
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {subjects.map((subject) => {
              const subjectTasks = tasks.filter(
                (task) =>
                  task.subject === subject.name
              );

              const subjectCompleted =
                subjectTasks.filter(
                  (task) => task.completed
                ).length;

              const progress =
                subjectTasks.length === 0
                  ? 0
                  : Math.round(
                      (subjectCompleted /
                        subjectTasks.length) *
                        100
                    );

              return (
                <div key={subject.id}>

                  <div className="mb-2 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            subject.color,
                        }}
                      />

                      <span className="font-medium">
                        {subject.name}
                      </span>
                    </div>

                    <span className="text-sm font-semibold">
                      {progress}%
                    </span>
                  </div>

                  <div
                    className="h-3 overflow-hidden rounded-full bg-gray-100"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${subject.name} progress`}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor:
                          subject.color,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {subjectCompleted} of{" "}
                    {subjectTasks.length} tasks completed
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* UPCOMING TASKS */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Upcoming Tasks
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your next unfinished tasks
            </p>
          </div>

          <a
            href="/tasks"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View all →
          </a>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <div className="mb-2 text-3xl">
              🎉
            </div>

            <p className="font-medium">
              No upcoming tasks
            </p>

            <p className="mt-1 text-sm text-gray-500">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <article
                key={task.id}
                className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-medium">
                    {task.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {task.subject}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:text-right">

                  <div>
                    <p className="text-sm font-medium">
                      {task.dueDate}
                    </p>

                    <p className="text-xs text-gray-500">
                      {task.priority} priority
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>

                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}