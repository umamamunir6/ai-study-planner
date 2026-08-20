"use client";

import { useEffect, useState } from "react";

type Subject = {
  id: number;
  name: string;
};

type Task = {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
};

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

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
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const remainingTasks = tasks.length - completedTasks;

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="border-b bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Study smarter.
              <br />
              Stay organized.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              AI Study Planner helps you organize subjects,
              manage assignments, track your progress, and
              create personalized study plans in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/planner"
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                ✨ Create Study Plan
              </a>

              <a
                href="/dashboard"
                className="rounded-lg border bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Subjects
            </p>

            <p className="mt-2 text-3xl font-bold">
              {subjects.length}
            </p>

            <a
              href="/subjects"
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Manage subjects →
            </a>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Remaining Tasks
            </p>

            <p className="mt-2 text-3xl font-bold">
              {remainingTasks}
            </p>

            <a
              href="/tasks"
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              View tasks →
            </a>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Completed Tasks
            </p>

            <p className="mt-2 text-3xl font-bold">
              {completedTasks}
            </p>

            <span className="mt-3 block text-sm text-gray-500">
              Keep going! 🎯
            </span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Everything you need to study effectively
          </h2>

          <p className="mt-2 text-gray-600">
            Plan, organize, and track your academic work
            from one place.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <a
            href="/subjects"
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 text-3xl">📚</div>

            <h3 className="font-semibold">
              Subjects
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Manage the subjects you are currently studying.
            </p>
          </a>

          <a
            href="/tasks"
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 text-3xl">✅</div>

            <h3 className="font-semibold">
              Tasks
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Track assignments, deadlines, and study tasks.
            </p>
          </a>

          <a
            href="/calendar"
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 text-3xl">📅</div>

            <h3 className="font-semibold">
              Calendar
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              See your upcoming study tasks and deadlines.
            </p>
          </a>

          <a
            href="/ai-assistant"
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 text-3xl">🤖</div>

            <h3 className="font-semibold">
              AI Assistant
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Get personalized help with your studies.
            </p>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h2 className="text-2xl font-bold">
            Ready to organize your studies?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Create an AI-powered study plan and turn it
            into real tasks on your calendar.
          </p>

          <a
            href="/planner"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Start Planning →
          </a>
        </div>
      </section>
    </main>
  );
}