"use client";

import { useEffect, useState } from "react";

type Priority = "Low" | "Medium" | "High";

type Task = {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Calendar() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    today.getMonth()
  );

  const [currentYear, setCurrentYear] = useState(
    today.getFullYear()
  );

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(
      "study-planner-tasks"
    );

    if (saved) {
      setTasks(JSON.parse(saved));
    }

    setIsLoaded(true);
  }, []);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonth((month) => month - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonth((month) => month + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const firstDay = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const previousMonthDays = new Date(
    currentYear,
    currentMonth,
    0
  ).getDate();

  const calendarDays = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: previousMonthDays - i,
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      currentMonth: true,
    });
  }

  let nextDay = 1;

  while (calendarDays.length < 42) {
    calendarDays.push({
      day: nextDay,
      currentMonth: false,
    });

    nextDay++;
  }

  const getDateString = (day: number) => {
    const month = String(currentMonth + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    return `${currentYear}-${month}-${date}`;
  };

  const getTasksForDay = (day: number) => {
    if (!isLoaded) return [];

    const dateString = getDateString(day);

    return tasks.filter(
      (task) => task.dueDate === dateString
    );
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Calendar
        </h1>

        <p className="mt-2 text-gray-600">
          View your study schedule and upcoming deadlines.
        </p>
      </div>

      {/* CALENDAR CARD */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        {/* MONTH CONTROLS */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              aria-label="Previous month"
              className="rounded-lg border px-3 py-2 text-lg transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ←
            </button>

            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Next month"
              className="rounded-lg border px-3 py-2 text-lg transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              →
            </button>

            <button
              type="button"
              onClick={goToToday}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Today
            </button>
          </div>

          <h2 className="text-xl font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        {/* WEEKDAYS */}
        <div className="grid grid-cols-7 border-b">
          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-semibold text-gray-500 sm:p-3 sm:text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        {/* DAYS */}
        <div className="grid grid-cols-7">
          {calendarDays.map((calendarDay, index) => {
            const dayTasks = calendarDay.currentMonth
              ? getTasksForDay(calendarDay.day)
              : [];

            return (
              <div
                key={index}
                className={`min-h-24 border-b border-r p-1.5 sm:min-h-32 sm:p-2 ${
                  calendarDay.currentMonth
                    ? "bg-white"
                    : "bg-gray-50"
                }`}
              >
                <div
                  className={`mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    isToday(calendarDay.day) &&
                    calendarDay.currentMonth
                      ? "bg-blue-600 font-bold text-white"
                      : calendarDay.currentMonth
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {calendarDay.day}
                </div>

                <div className="space-y-1">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`rounded-md p-1.5 text-xs ${
                        task.completed
                          ? "bg-gray-100 text-gray-500"
                          : task.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                      title={`${task.title} - ${task.subject}`}
                    >
                      <p
                        className={`truncate font-medium ${
                          task.completed
                            ? "line-through"
                            : ""
                        }`}
                      >
                        {task.title}
                      </p>

                      <p className="hidden truncate sm:block">
                        {task.subject}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LEGEND */}
      <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">
          Priority
        </h2>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            High
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            Medium
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            Low
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gray-400" />
            Completed
          </div>
        </div>
      </section>
    </main>
  );
}