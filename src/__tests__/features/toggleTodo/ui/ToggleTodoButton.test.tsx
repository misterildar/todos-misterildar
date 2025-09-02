import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleTodoButton } from "@/features/toggleTodo/ui/ToggleTodoButton/ToggleTodoButton";

const mockToggleTodo = vi.fn();
vi.mock("@/entities/todo", () => ({
  useTodoActions: () => ({
    toggleTodo: mockToggleTodo,
  }),
}));

describe("ToggleTodoButton", () => {
  beforeEach(() => {
    mockToggleTodo.mockClear();
  });

  it("должен рендериться с кнопкой переключения", () => {
    render(<ToggleTodoButton id="test-123" completed={false} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("должен отображать правильный aria-label для незавершенной задачи", () => {
    render(<ToggleTodoButton id="test-123" completed={false} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Mark as completed");
  });

  it("должен отображать правильный aria-label для завершенной задачи", () => {
    render(<ToggleTodoButton id="test-123" completed={true} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Mark as not completed");
  });

  it("должен вызывать toggleTodo при клике", async () => {
    const user = userEvent.setup();
    render(<ToggleTodoButton id="test-123" completed={false} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockToggleTodo).toHaveBeenCalledWith("test-123");
  });

  it("должен вызывать toggleTodo только один раз при клике", async () => {
    const user = userEvent.setup();
    render(<ToggleTodoButton id="test-123" completed={false} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockToggleTodo).toHaveBeenCalledTimes(1);
  });

  it("должен правильно обрабатывать множественные клики", async () => {
    const user = userEvent.setup();
    render(<ToggleTodoButton id="test-123" completed={false} />);

    const button = screen.getByRole("button");
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockToggleTodo).toHaveBeenCalledTimes(3);
    expect(mockToggleTodo).toHaveBeenNthCalledWith(1, "test-123");
    expect(mockToggleTodo).toHaveBeenNthCalledWith(2, "test-123");
    expect(mockToggleTodo).toHaveBeenNthCalledWith(3, "test-123");
  });

  it("должен правильно обрабатывать задачи с разными ID", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <ToggleTodoButton id="todo-1" completed={false} />
    );
    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockToggleTodo).toHaveBeenCalledWith("todo-1");

    mockToggleTodo.mockClear();
    rerender(<ToggleTodoButton id="todo-2" completed={false} />);
    await user.click(button);

    expect(mockToggleTodo).toHaveBeenCalledWith("todo-2");
  });

  it("должен правильно обрабатывать задачи с разным статусом", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <ToggleTodoButton id="test-123" completed={false} />
    );
    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockToggleTodo).toHaveBeenCalledWith("test-123");

    mockToggleTodo.mockClear();
    rerender(<ToggleTodoButton id="test-123" completed={true} />);
    await user.click(button);

    expect(mockToggleTodo).toHaveBeenCalledWith("test-123");
  });

  it("должен правильно обрабатывать пустые ID", async () => {
    const user = userEvent.setup();
    render(<ToggleTodoButton id="" completed={false} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockToggleTodo).toHaveBeenCalledWith("");
  });

  it("должен правильно обрабатывать длинные ID", async () => {
    const user = userEvent.setup();
    const longId = "very-long-id-that-might-cause-issues-in-some-edge-cases";
    render(<ToggleTodoButton id={longId} completed={false} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockToggleTodo).toHaveBeenCalledWith(longId);
  });
});
