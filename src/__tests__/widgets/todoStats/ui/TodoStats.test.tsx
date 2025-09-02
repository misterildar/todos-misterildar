import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoStats } from "@/widgets/todoStats/ui/TodoStats/TodoStats";

const mockSetFilter = vi.fn();
const mockClearCompleted = vi.fn();

vi.mock("@/entities/todo", () => ({
  useTodoStats: () => ({
    active: 3,
    completed: 2,
    total: 5,
  }),
  useTodoFilter: () => "all",
  useTodoActions: () => ({
    setFilter: mockSetFilter,
    clearCompleted: mockClearCompleted,
  }),
}));

vi.mock("@/shared", () => ({
  Button: ({
    onClick,
    text,
    className,
    disabled,
    "data-testid": dataTestId,
  }: {
    onClick?: () => void;
    text?: string;
    variant?: string;
    size?: string;
    className?: string;
    disabled?: boolean;
    "data-testid"?: string;
  }) => (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {text}
    </button>
  ),
}));

describe("TodoStats", () => {
  beforeEach(() => {
    mockSetFilter.mockClear();
    mockClearCompleted.mockClear();
  });

  it("должен рендериться с правильной статистикой", () => {
    render(<TodoStats />);

    expect(screen.getByText("3 items left")).toBeInTheDocument();
  });

  it("должен отображать все фильтры", () => {
    render(<TodoStats />);

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("должен показывать кнопку Clear Completed при наличии завершенных задач", () => {
    render(<TodoStats />);

    expect(screen.getByText("Clear completed")).toBeInTheDocument();
  });

  it("должен вызывать setFilter при клике на фильтр All", async () => {
    const user = userEvent.setup();
    render(<TodoStats />);

    const allFilter = screen.getByText("All");
    await user.click(allFilter);

    expect(mockSetFilter).toHaveBeenCalledWith("all");
  });

  it("должен вызывать setFilter при клике на фильтр Active", async () => {
    const user = userEvent.setup();
    render(<TodoStats />);

    const activeFilter = screen.getByText("Active");
    await user.click(activeFilter);

    expect(mockSetFilter).toHaveBeenCalledWith("active");
  });

  it("должен вызывать setFilter при клике на фильтр Completed", async () => {
    const user = userEvent.setup();
    render(<TodoStats />);

    const completedFilter = screen.getByText("Completed");
    await user.click(completedFilter);

    expect(mockSetFilter).toHaveBeenCalledWith("completed");
  });

  it("должен вызывать clearCompleted при клике на кнопку Clear Completed", async () => {
    const user = userEvent.setup();
    render(<TodoStats />);

    const clearButton = screen.getByText("Clear completed");
    await user.click(clearButton);

    expect(mockClearCompleted).toHaveBeenCalled();
  });

  it("должен правильно обрабатывать множественные клики по фильтрам", async () => {
    const user = userEvent.setup();
    render(<TodoStats />);

    const allFilter = screen.getByText("All");
    const activeFilter = screen.getByText("Active");
    const completedFilter = screen.getByText("Completed");

    await user.click(allFilter);
    await user.click(activeFilter);
    await user.click(completedFilter);

    expect(mockSetFilter).toHaveBeenCalledTimes(3);
    expect(mockSetFilter).toHaveBeenNthCalledWith(1, "all");
    expect(mockSetFilter).toHaveBeenNthCalledWith(2, "active");
    expect(mockSetFilter).toHaveBeenNthCalledWith(3, "completed");
  });

  it("должен правильно обрабатывать множественные клики по Clear Completed", async () => {
    const user = userEvent.setup();
    render(<TodoStats />);

    const clearButton = screen.getByText("Clear completed");

    await user.click(clearButton);
    await user.click(clearButton);
    await user.click(clearButton);

    expect(mockClearCompleted).toHaveBeenCalledTimes(3);
  });

  it("должен правильно отображать фильтр All как активный по умолчанию", () => {
    render(<TodoStats />);

    const allFilter = screen.getByText("All");
    expect(allFilter.className).toContain("active");
  });

  it("должен правильно отображать фильтр Active как неактивный по умолчанию", () => {
    render(<TodoStats />);

    const activeFilter = screen.getByText("Active");
    expect(activeFilter.className).not.toContain("active");
  });

  it("должен правильно отображать фильтр Completed как неактивный по умолчанию", () => {
    render(<TodoStats />);

    const completedFilter = screen.getByText("Completed");
    expect(completedFilter.className).not.toContain("active");
  });
});
