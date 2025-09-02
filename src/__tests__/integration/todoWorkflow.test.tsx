import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/app/App";
import { setupIntegrationTest } from "@/__tests__/test-utils";
import { useTodoStore } from "@/entities/todo";

const { localStorageMock } = setupIntegrationTest();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Todo Workflow Integration", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    useTodoStore.getState().todos = [];
    useTodoStore.getState().searchQuery = "";
    useTodoStore.getState().filter = "all";
  });

  it("должен рендериться с основными компонентами", () => {
    render(<App />);
    expect(screen.getByText("todos")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("What needs to be done?")
    ).toBeInTheDocument();
    expect(screen.getByText("Add Todo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("должен добавлять новую задачу и отображать её в списке", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByText("Add Todo");
    await user.type(input, "Новая задача");
    await user.click(addButton);
    expect(screen.getByText("Новая задача")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("должен переключать статус задачи", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByText("Add Todo");
    await user.type(input, "Задача для переключения");
    await user.click(addButton);
    const toggleButtons = screen.getAllByRole("button", {
      name: "Mark as not completed",
    });
    const toggleButton = toggleButtons[0];
    await user.click(toggleButton);
    expect(
      screen.getAllByRole("button", { name: "Mark as completed" })[0]
    ).toBeInTheDocument();
  });

  it("должен удалять задачу", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByText("Add Todo");
    await user.type(input, "Задача для удаления");
    await user.click(addButton);
    expect(screen.getByText("Задача для удаления")).toBeInTheDocument();
    const removeButtons = screen.getAllByRole("button", {
      name: "Remove task",
    });
    await user.click(removeButtons[0]);
    expect(screen.queryByText("Задача для удаления")).not.toBeInTheDocument();
  });

  it("должен искать задачи по тексту", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByText("Add Todo");
    await user.type(input, "React задача");
    await user.click(addButton);
    await user.type(input, "Vue задача");
    await user.click(addButton);
    await user.type(input, "Angular задача");
    await user.click(addButton);
    expect(screen.getByText("React задача")).toBeInTheDocument();
    expect(screen.getByText("Vue задача")).toBeInTheDocument();
    expect(screen.getByText("Angular задача")).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText("Search tasks...");
    await user.type(searchInput, "React");
    expect(screen.getByText(/React/)).toBeInTheDocument();
    expect(screen.getByText(/задача/)).toBeInTheDocument();
    expect(screen.queryByText(/Vue/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Angular/)).not.toBeInTheDocument();
  });

  it("должен очищать все завершенные задачи", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByText("Add Todo");
    await user.type(input, "Активная задача");
    await user.click(addButton);
    await user.type(input, "Завершенная задача 1");
    await user.click(addButton);
    const firstToggleButton = screen.getAllByRole("button", {
      name: "Mark as not completed",
    })[0];
    await user.click(firstToggleButton);
    await user.type(input, "Завершенная задача 2");
    await user.click(addButton);
    const secondToggleButton = screen.getAllByRole("button", {
      name: "Mark as not completed",
    })[0];
    await user.click(secondToggleButton);
    await waitFor(() => {
      expect(screen.getByTestId("clear-completed-button")).toBeInTheDocument();
    });
    const clearButton = screen.getByTestId("clear-completed-button");
    await user.click(clearButton);
    expect(screen.queryByText("Завершенная задача 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Завершенная задача 2")).not.toBeInTheDocument();
    const remainingTasks = screen.queryAllByTestId("todo-item");
    expect(remainingTasks).toHaveLength(1);
    expect(screen.getByText("Активная задача")).toBeInTheDocument();
  });

  it("должен показывать правильную статистику", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByText("Add Todo");
    await user.type(input, "Задача 1");
    await user.click(addButton);
    await user.type(input, "Задача 2");
    await user.click(addButton);
    await user.type(input, "Задача 3");
    await user.click(addButton);
    expect(screen.getByText(/3 items left/)).toBeInTheDocument();
    const toggleButtons = screen.getAllByRole("button", {
      name: "Mark as not completed",
    });
    await waitFor(async () => {
      await user.click(toggleButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText(/2 items left/)).toBeInTheDocument();
    });
  });

  it("должен обрабатывать пустые задачи", async () => {
    const user = userEvent.setup();
    render(<App />);
    const initialTasks = screen.queryAllByTestId("todo-item").length;
    const addButton = screen.getByText("Add Todo");
    await user.click(addButton);
    expect(screen.queryAllByTestId("todo-item")).toHaveLength(initialTasks);
    const input = screen.getByPlaceholderText("What needs to be done?");
    await user.type(input, "   ");
    await user.click(addButton);
    expect(screen.queryAllByTestId("todo-item")).toHaveLength(initialTasks);
  });

  it("должен работать с Enter для добавления задач", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    const initialTasks = screen.queryAllByTestId("todo-item").length;
    await user.type(input, "Задача через Enter");
    await user.keyboard("{Enter}");
    expect(screen.getAllByTestId("todo-item")).toHaveLength(initialTasks + 1);
    expect(screen.getByText(/Задача через Enter/)).toBeInTheDocument();
    expect(input).toHaveValue("");
  });
});
