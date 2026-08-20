"use client";

import { FormEvent, useEffect, useState } from "react";

type Subject = {
  id: number;
  name: string;
  description: string;
  color: string;
};


type StudySession = {
  id: number;
  title: string;
  subject: string;
  date: string;
};

export default function Planner() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [days, setDays] = useState("7");
  const [hours, setHours] = useState("2");
  const [plan, setPlan] = useState<StudySession[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const savedSubjects = localStorage.getItem(
    "study-planner-subjects"
  );

  if (savedSubjects) {
    const parsedSubjects = JSON.parse(savedSubjects);

    setSubjects(parsedSubjects);

    if (parsedSubjects.length > 0) {
      setSelectedSubject(parsedSubjects[0].name);
    }
  }
}, []);
  const generatePlan = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedSubject) {
      setMessage("Please select a subject first.");
      return;
    }

    const numberOfDays = Number(days);
    const dailyHours = Number(hours);

    if (
      numberOfDays < 1 ||
      numberOfDays > 30 ||
      dailyHours < 1 ||
      dailyHours > 12
    ) {
      setMessage(
        "Please enter between 1-30 days and 1-12 hours per day."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjects: [selectedSubject],
          days: numberOfDays,
          hours: dailyHours,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate plan."
        );
      }

      const today = new Date();

      const generatedSessions: StudySession[] =
        data.sessions.map(
          (
            session: {
              title: string;
              subject: string;
              day: number;
            },
            index: number
          ) => {
            const date = new Date(today);

            date.setDate(
              date.getDate() + session.day - 1
            );

            return {
              id: Date.now() + index,
              title: session.title,
              subject: session.subject,
              date: date.toISOString().split("T")[0],
            };
          }
        );

      setPlan(generatedSessions);

      setMessage(
        "Your AI study plan has been generated successfully."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

const addPlanToTasks = () => {
  if (plan.length === 0) {
    setMessage("Generate a study plan first.");
    return;
  }

  const savedTasks = localStorage.getItem(
    "study-planner-tasks"
  );

  const existingTasks = savedTasks
    ? JSON.parse(savedTasks)
    : [];

  const newTasks = plan.map((session, index) => ({
    id: Date.now() + index,
    title: session.title,
    subject: session.subject,
    dueDate: session.date,
    priority: "Medium",
    completed: false,
  }));

  const updatedTasks = [
    ...existingTasks,
    ...newTasks,
  ];

  localStorage.setItem(
    "study-planner-tasks",
    JSON.stringify(updatedTasks)
  );

  setMessage(
    `${newTasks.length} AI-generated task(s) added successfully.`
  );
};
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          AI Study Planner
        </h1>

        <p className="mt-2 text-gray-600">
          Generate a personalized study plan using AI.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        {/* FORM */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            Create Study Plan
          </h2>

          {subjects.length === 0 ? (
            <div className="rounded-xl border border-dashed p-5 text-center">
              <p className="font-medium">
                No subjects available
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add a subject first from the Subjects page.
              </p>
            </div>
          ) : (
            <form onSubmit={generatePlan}>
              <div className="mb-4">
                <label
                  htmlFor="planner-subject"
                  className="mb-2 block text-sm font-medium"
                >
                  Subject
                </label>

                <select
                  id="planner-subject"
                  value={selectedSubject}
                  onChange={(e) =>
                    setSelectedSubject(e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {subjects.map((subject) => (
                    <option
                      key={subject.id}
                      value={subject.name}
                    >
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="planner-days"
                  className="mb-2 block text-sm font-medium"
                >
                  Number of days
                </label>

                <input
                  id="planner-days"
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) =>
                    setDays(e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="planner-hours"
                  className="mb-2 block text-sm font-medium"
                >
                  Study hours per day
                </label>

                <input
                  id="planner-hours"
                  type="number"
                  min="1"
                  max="12"
                  value={hours}
                  onChange={(e) =>
                    setHours(e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "🤖 Generating..."
                  : "✨ Generate AI Plan"}
              </button>
            </form>
          )}

          {message && (
            <p
              role="status"
              className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700"
            >
              {message}
            </p>
          )}
        </section>

        {/* PLAN */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Your AI Study Plan
            </h2>

            {plan.length > 0 && (
              <button
                type="button"
                onClick={addPlanToTasks}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
              >
                Add to Tasks
              </button>
            )}
          </div>

          {plan.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <div className="mb-3 text-4xl">🤖</div>

              <h3 className="font-semibold">
                No AI study plan yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Choose your subject and study duration to
                generate a personalized plan.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {plan.map((session) => (
                <article
                  key={session.id}
                  className="rounded-xl border bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">
                        {session.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {session.subject}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {session.date}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}