import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StudyProgressCard from "../../app/components/StudyProgressCard";

const progressData = {
  completedTasks: 8,
  totalTasks: 10,
  completionRate: 80,
  subjects: [
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
  ],
};

describe("StudyProgressCard", () => {
  it("renders the study progress heading", () => {
    render(<StudyProgressCard data={progressData} />);

    expect(
      screen.getByRole("heading", { name: /study progress/i })
    ).toBeInTheDocument();
  });

  it("renders the overall completion rate", () => {
    render(<StudyProgressCard data={progressData} />);

    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("renders completed and total tasks", () => {
    render(<StudyProgressCard data={progressData} />);

    expect(screen.getByText("tasks completed")).toBeInTheDocument();

    const summary = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === "strong" &&
        content.replace(/\s/g, "") === "8/10"
      );
    });

    expect(summary).toBeInTheDocument();
  });

  it("renders Data Structures subject progress", () => {
    render(<StudyProgressCard data={progressData} />);

    expect(
      screen.getByText("Data Structures & Algorithms")
    ).toBeInTheDocument();
  });

  it("renders Web Development subject progress", () => {
    render(<StudyProgressCard data={progressData} />);

    expect(
      screen.getByText("Web Development")
    ).toBeInTheDocument();
  });

  it("renders the subject progress section", () => {
    render(<StudyProgressCard data={progressData} />);

    expect(
      screen.getByRole("heading", { name: "Subject Progress" })
    ).toBeInTheDocument();
  });
});

