"use client";

import { FormEvent, useEffect, useState } from "react";

type Subject = {
  id: number;
  name: string;
  description: string;
  color: string;
};

const defaultSubjects: Subject[] = [];

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [error, setError] = useState("");

useEffect(() => {
  const saved = localStorage.getItem("study-planner-subjects");

  if (saved) {
    setSubjects(JSON.parse(saved));
  } else {
    setSubjects(defaultSubjects);
  }

  setIsLoaded(true);
}, []);

useEffect(() => {
  if (!isLoaded) return;

  localStorage.setItem(
    "study-planner-subjects",
    JSON.stringify(subjects)
  );
}, [subjects, isLoaded]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Subject name is required.");
      return;
    }

    const alreadyExists = subjects.some(
      (subject) =>
        subject.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (alreadyExists) {
      setError("This subject already exists.");
      return;
    }

    const newSubject: Subject = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      color,
    };

    setSubjects((current) => [...current, newSubject]);

    setName("");
    setDescription("");
    setColor("#3b82f6");
    setError("");
  };

  const deleteSubject = (id: number) => {
    setSubjects((current) =>
      current.filter((subject) => subject.id !== id)
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Subjects</h1>

        <p className="mt-2 text-gray-600">
          Add and manage the subjects you are currently studying.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">

        {/* ADD SUBJECT */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            Add Subject
          </h2>

          <form onSubmit={handleSubmit} noValidate>

            <div className="mb-4">
              <label
                htmlFor="subject-name"
                className="mb-2 block text-sm font-medium"
              >
                Subject name
              </label>

              <input
                id="subject-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Data Structures"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="subject-description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="subject-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you studying?"
                rows={3}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="subject-color"
                className="mb-2 block text-sm font-medium"
              >
                Color
              </label>

              <input
                id="subject-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-lg border p-1"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="mb-4 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Subject
            </button>
          </form>
        </section>

        {/* SUBJECT LIST */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Your Subjects
            </h2>

            <span className="text-sm text-gray-500">
              {subjects.length} subject
              {subjects.length !== 1 ? "s" : ""}
            </span>
          </div>

          {subjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <div className="mb-3 text-4xl">📚</div>

              <h3 className="font-semibold">
                No subjects yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add your first subject using the form.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {subjects.map((subject) => (
                <article
                  key={subject.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{
                          backgroundColor: subject.color,
                        }}
                      />

                      <h3 className="font-semibold">
                        {subject.name}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteSubject(subject.id)
                      }
                      aria-label={`Delete ${subject.name}`}
                      className="rounded-lg px-2 py-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-sm text-gray-600">
                    {subject.description ||
                      "No description added."}
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-500">
                        Progress
                      </span>

                      <span className="font-medium">
                        0%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "0%",
                          backgroundColor: subject.color,
                        }}
                      />
                    </div>
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