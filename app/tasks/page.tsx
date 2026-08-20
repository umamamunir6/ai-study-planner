"use client";

import { FormEvent, useEffect, useState } from "react";

type Priority = "Low" | "Medium" | "High";

type Task = {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
};
type Subject = {
  id: number;
  name: string;
  description: string;
  color: string;
};

const initialTasks: Task[] = [];

export default function Tasks() {
const [tasks, setTasks] = useState<Task[]>([]);
const [subjects, setSubjects] = useState<Subject[]>([]);
const [isLoaded, setIsLoaded] = useState(false);
const [title, setTitle] = useState("");
const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const [errors, setErrors] = useState<Record<string, string>>({});

useEffect(() => {
  const saved = localStorage.getItem("study-planner-tasks");

  if (saved) {
    setTasks(JSON.parse(saved));
  }

  setIsLoaded(true);
}, []);

useEffect(() => {
  const savedSubjects = localStorage.getItem(
    "study-planner-subjects"
  );

  if (savedSubjects) {
    setSubjects(JSON.parse(savedSubjects));
  }
}, []);

useEffect(() => {
  if (!isLoaded) return;

  localStorage.setItem(
    "study-planner-tasks",
    JSON.stringify(tasks)
  );
}, [tasks, isLoaded]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Task title is required.";
    }

    if (!subject.trim()) {
      newErrors.subject = "Subject is required.";
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      subject: subject.trim(),
      dueDate,
      priority,
      completed: false,
    };

    setTasks((current) => [...current, newTask]);

    setTitle("");
    setSubject("");
    setDueDate("");
    setPriority("Medium");
    setErrors({});
  };

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Study Tasks</h1>

        <p className="mt-2 text-gray-600">
          Manage assignments, deadlines, and study tasks.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        {/* ADD TASK FORM */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            Add Study Task
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label
                htmlFor="task-title"
                className="mb-2 block text-sm font-medium"
              >
                Task title
              </label>

              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete DSA assignment"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                aria-invalid={!!errors.title}
                aria-describedby={
                  errors.title ? "title-error" : undefined
                }
              />

              {errors.title && (
                <p
                  id="title-error"
                  role="alert"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.title}
                </p>
              )}
            </div>

            <div className="mb-4">
  <label
    htmlFor="task-subject"
    className="mb-2 block text-sm font-medium"
  >
    Subject
  </label>

  {subjects.length === 0 ? (
    <p className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
      No subjects available. Please add a subject first.
    </p>
  ) : (
    <select
      id="task-subject"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      aria-invalid={!!errors.subject}
      aria-describedby={
        errors.subject ? "subject-error" : undefined
      }
    >
      <option value="">Select a subject</option>

      {subjects.map((item) => (
        <option key={item.id} value={item.name}>
          {item.name}
        </option>
      ))}
    </select>
  )}

  {errors.subject && (
    <p
      id="subject-error"
      role="alert"
      className="mt-1 text-sm text-red-600"
    >
      {errors.subject}
    </p>
  )}
</div>

            <div className="mb-4">
              <label
                htmlFor="task-date"
                className="mb-2 block text-sm font-medium"
              >
                Due date
              </label>

              <input
                id="task-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                aria-invalid={!!errors.dueDate}
                aria-describedby={
                  errors.dueDate ? "date-error" : undefined
                }
              />

              {errors.dueDate && (
                <p
                  id="date-error"
                  role="alert"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.dueDate}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="task-priority"
                className="mb-2 block text-sm font-medium"
              >
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as Priority)
                }
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Task
            </button>
          </form>
        </section>

        {/* TASK LIST */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Your Tasks
            </h2>

            <span className="text-sm text-gray-500">
              {tasks.filter((task) => !task.completed).length}{" "}
              remaining
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <div className="mb-3 text-4xl">📝</div>

              <h3 className="font-semibold">
                No tasks yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add your first study task using the form.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <article
                  key={task.id}
                  className={`rounded-xl border bg-white p-4 shadow-sm transition ${
                    task.completed
                      ? "opacity-60"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`Mark ${task.title} as ${
                        task.completed
                          ? "incomplete"
                          : "complete"
                      }`}
                      className="mt-1 h-5 w-5"
                    />

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-semibold ${
                          task.completed
                            ? "line-through"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {task.subject}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-gray-100 px-3 py-1">
                          Due: {task.dueDate}
                        </span>

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete ${task.title}`}
                      className="rounded-lg px-2 py-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      ✕
                    </button>
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