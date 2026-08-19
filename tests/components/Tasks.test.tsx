import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Tasks from "@/app/tasks/page";

describe("Tasks", () => {
  beforeEach(() => {
    localStorage.clear();
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
        target: { value: "Study Binary Search" },
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
        target: { value: "2026-08-25" },
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
    render(<Tasks />);

    const checkbox =
      screen.getAllByRole("checkbox")[0];

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("deletes a task", () => {
    render(<Tasks />);

    const deleteButtons =
      screen.getAllByRole("button", {
        name: /delete/i,
      });

    const firstTaskTitle =
      screen.getByText("Review Binary Search");

    expect(firstTaskTitle).toBeInTheDocument();

    fireEvent.click(deleteButtons[0]);

    expect(
      screen.queryByText("Review Binary Search")
    ).not.toBeInTheDocument();
  });
});