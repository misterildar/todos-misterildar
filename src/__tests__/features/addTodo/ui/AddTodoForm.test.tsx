import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTodoForm } from "@/features/addTodo";

vi.mock("@/shared", () => ({
  Input: ({
    value,
    onChange,
    placeholder,
    onKeyDown,
    autoFocus,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    autoFocus?: boolean;
  }) => (
    <input
      data-testid="todo-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      {...(autoFocus && { autoFocus: true })}
    />
  ),
  Button: ({
    type,
    disabled,
    text,
    onClick,
  }: {
    type: "button" | "submit" | "reset";
    disabled: boolean;
    text: string;
    onClick?: () => void;
  }) => (
    <button
      data-testid="add-button"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  ),
}));

const mockAddTodo = vi.fn();

vi.mock("@/entities/todo", () => ({
  useTodoActions: () => ({
    addTodo: mockAddTodo,
  }),
}));

describe("AddTodoForm", () => {
  beforeEach(() => {
    mockAddTodo.mockClear();
  });

  it("должен рендериться с формой и полем ввода", () => {
    render(<AddTodoForm />);
    expect(screen.getByTestId("form")).toBeInTheDocument();
    expect(screen.getByTestId("todo-input")).toBeInTheDocument();
    expect(screen.getByTestId("add-button")).toBeInTheDocument();
  });

  it("должен обновлять значение поля ввода при вводе", async () => {
    const user = userEvent.setup();
    render(<AddTodoForm />);
    const input = screen.getByTestId("todo-input") as HTMLInputElement;
    await user.type(input, "Новая задача");
    expect(input.value).toBe("Новая задача");
  });

  it("должен отправлять форму при нажатии кнопки", async () => {
    const user = userEvent.setup();
    render(<AddTodoForm />);
    const input = screen.getByTestId("todo-input") as HTMLInputElement;
    const button = screen.getByTestId("add-button");
    await user.type(input, "Новая задача");
    await user.click(button);
    expect(mockAddTodo).toHaveBeenCalledWith("Новая задача");
  });

  it("должен отправлять форму при нажатии Enter", async () => {
    const user = userEvent.setup();
    render(<AddTodoForm />);
    const input = screen.getByTestId("todo-input") as HTMLInputElement;
    await user.type(input, "Новая задача");
    await user.keyboard("{Enter}");
    expect(mockAddTodo).toHaveBeenCalledWith("Новая задача");
  });

  it("должен очищать поле ввода после отправки формы", async () => {
    const user = userEvent.setup();
    render(<AddTodoForm />);
    const input = screen.getByTestId("todo-input") as HTMLInputElement;
    const button = screen.getByTestId("add-button");
    await user.type(input, "Новая задача");
    await user.click(button);
    expect(input.value).toBe("");
  });

  it("не должен отправлять форму с пустым текстом", async () => {
    const user = userEvent.setup();
    render(<AddTodoForm />);
    const button = screen.getByTestId("add-button");
    await user.click(button);
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it("не должен отправлять форму только с пробелами", async () => {
    const user = userEvent.setup();
    render(<AddTodoForm />);
    const input = screen.getByTestId("todo-input") as HTMLInputElement;
    const button = screen.getByTestId("add-button");
    await user.type(input, "   ");
    await user.click(button);
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it("должен быть отключен кнопка отправки при пустом поле", () => {
    render(<AddTodoForm />);
    const button = screen.getByTestId("add-button");
    expect(button).toBeDisabled();
  });

  it("должен быть активен кнопка отправки при вводе текста", async () => {
    const user = userEvent.setup();
    render(<AddTodoForm />);
    const input = screen.getByTestId("todo-input") as HTMLInputElement;
    const button = screen.getByTestId("add-button");
    await user.type(input, "Новая задача");
    expect(button).not.toBeDisabled();
  });
});
