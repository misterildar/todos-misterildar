import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "@/entities/todo/ui/TodoItem/TodoItem";
import type { Todo } from "@/entities/todo/model/types";
import { setupUnitTest, createTestTodoWithId } from "@/__tests__/test-utils";

setupUnitTest();

vi.mock("@/shared", () => ({
  HighlightedText: ({
    text,
    highlight,
    className,
  }: {
    text: string;
    highlight?: string;
    className?: string;
  }) => (
    <span className={className} data-testid="highlighted-text">
      {text} {highlight && `[${highlight}]`}
    </span>
  ),
}));

describe("TodoItem", () => {
  let onToggleMock: ReturnType<typeof vi.fn>;
  let onRemoveMock: ReturnType<typeof vi.fn>;
  let testTodo: Todo;

  beforeEach(() => {
    const { clearStore } = setupUnitTest();
    clearStore();
    onToggleMock = vi.fn();
    onRemoveMock = vi.fn();
    testTodo = createTestTodoWithId("test-123", "Тестовая задача", false);
  });

  it("должен правильно отображать все элементы задачи", () => {
    render(
      <TodoItem
        todo={testTodo}
        onToggle={onToggleMock}
        onRemove={onRemoveMock}
      />
    );
    expect(screen.getByText("Тестовая задача")).toBeInTheDocument();
    const checkbox = screen.getByRole("button", {
      name: "Mark as not completed",
    });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("aria-label", "Mark as not completed");
    const removeButton = screen.getByRole("button", { name: "Remove task" });
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toHaveTextContent("✕");
    const highlightedText = screen.getByTestId("highlighted-text");
    expect(highlightedText).toBeInTheDocument();
    expect(highlightedText).toHaveTextContent("Тестовая задача");
  });

  it("должен правильно обрабатывать клики и вызывать колбэки", async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={testTodo}
        onToggle={onToggleMock}
        onRemove={onRemoveMock}
      />
    );
    const checkbox = screen.getByRole("button", {
      name: "Mark as not completed",
    });
    await user.click(checkbox);
    expect(onToggleMock).toHaveBeenCalledWith("test-123");
    const removeButton = screen.getByRole("button", { name: "Remove task" });
    await user.click(removeButton);
    expect(onRemoveMock).toHaveBeenCalledWith("test-123");
  });

  it("должен правильно отображать завершенную задачу", () => {
    const completedTodo = { ...testTodo, completed: true };
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={onToggleMock}
        onRemove={onRemoveMock}
      />
    );
    const checkbox = screen.getByRole("button", { name: "Mark as completed" });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("aria-label", "Mark as completed");
    const svg = checkbox.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "12");
    expect(svg).toHaveAttribute("height", "12");
  });

  it("должен правильно отображать незавершенную задачу", () => {
    render(
      <TodoItem
        todo={testTodo}
        onToggle={onToggleMock}
        onRemove={onRemoveMock}
      />
    );
    const checkbox = screen.getByRole("button", {
      name: "Mark as not completed",
    });
    expect(checkbox).toHaveAttribute("aria-label", "Mark as not completed");
    const svg = checkbox.querySelector("svg");
    expect(svg).not.toBeInTheDocument();
  });
});
