import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Tasks from "@/app/tasks/page";

const testSubject = {
  id: 1,
  name: "Data Structures & Algorithms",
  description: "Algorithms and data structures",
};

const testTask = {
  id: 1,
  title: "Review Binary Search",
  subject: "Data Structures & Algorithms",
  dueDate: "2026-08-25",
  priority: "Medium",
  completed: false,
};

describe("Tasks", () => {
  beforeEach(() => {
    localStorage.clear();

    localStorage.setItem(
      "subjects",
      JSON.stringify([testSubject])
    );
  });

  it("renders the Tasks page", () => {
    render(<Tasks />);

    expect(
      screen.getByRole("heading", {
        name: "Study Tasks",
        level: 1,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", () => {
    render(<Tasks />);

    fireEvent.click(
      screen.getByRole("button", { name: /add task/i })
    );

    expect(
      screen.getByText(/title is required/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/subject is required/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/due date is required/i)
    ).toBeInTheDocument();
  });

  it("adds a task when valid information is submitted", () => {
    render(<Tasks />);

    fireEvent.change(
      screen.getByLabelText(/task title/i),
      {
        target: {
          value: "Study Binary Search",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText(/subject/i),
      {
        target: {
          value: "Data Structures & Algorithms",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText(/due date/i),
      {
        target: {
          value: "2026-08-25",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /add task/i,
      })
    );

    const newTask = screen.getByRole("heading", {
      name: "Study Binary Search",
    });

    expect(newTask).toBeInTheDocument();

    const taskCard = newTask.closest("article");

    expect(taskCard).not.toBeNull();

    expect(
      within(taskCard!).getByText(
        "Data Structures & Algorithms"
      )
    ).toBeInTheDocument();
  });

  it("marks a task as completed", () => {
    localStorage.setItem(
  "study-planner-tasks",
  JSON.stringify([testTask])
);;

    render(<Tasks />);

    const checkbox =
      screen.getAllByRole("checkbox")[0];

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("deletes a task", () => {
    localStorage.setItem(
  "study-planner-tasks",
  JSON.stringify([testTask])
);

    render(<Tasks />);

    const deleteButton =
      screen.getByRole("button", {
        name: /delete/i,
      });

    expect(
      screen.getByText("Review Binary Search")
    ).toBeInTheDocument();

    fireEvent.click(deleteButton);

    expect(
      screen.queryByText("Review Binary Search")
    ).not.toBeInTheDocument();
  });
});