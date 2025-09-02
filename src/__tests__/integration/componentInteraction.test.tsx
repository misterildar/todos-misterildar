import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/app/App";
import { setupIntegrationTest } from "@/__tests__/test-utils";

const { localStorageMock, clearStore } = setupIntegrationTest();

describe("Component Interaction Integration", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    clearStore();
  });

  it("должен синхронизировать состояние между всеми компонентами", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByText("Add Todo");
    await user.type(input, "Синхронизированная задача");
    await user.click(addButton);

    expect(screen.getByText(/Синхронизированная задача/)).toBeInTheDocument();
    expect(screen.getByText(/1 items left/)).toBeInTheDocument();

    const toggleButton = screen.getByRole("button", {
      name: "Mark as not completed",
    });
    await user.click(toggleButton);
    expect(screen.getByText(/0 items left/)).toBeInTheDocument();

    expect(screen.getByText("Clear completed")).toBeInTheDocument();
  });

  it("должен правильно обрабатывать множественные операции с синхронизацией", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByText("Add Todo");

    await user.type(input, "Задача A");
    await user.click(addButton);
    await user.type(input, "Задача B");
    await user.click(addButton);
    await user.type(input, "Задача C");
    await user.click(addButton);

    expect(screen.getByText(/3 items left/)).toBeInTheDocument();

    const toggleButtons = screen.getAllByRole("button", {
      name: "Mark as not completed",
    });
    for (const button of toggleButtons) {
      await user.click(button);
    }

    expect(screen.getByText(/0 items left/)).toBeInTheDocument();
    expect(screen.getByText("Clear completed")).toBeInTheDocument();

    await user.click(screen.getByText("Clear completed"));
    expect(screen.queryByText(/Задача A/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Задача B/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Задача C/)).not.toBeInTheDocument();
  });

  it("должен корректно обрабатывать поиск с подсветкой и фильтрацией", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByText("Add Todo");

    await user.type(input, "JavaScript задача");
    await user.click(addButton);
    await user.type(input, "TypeScript задача");
    await user.click(addButton);
    await user.type(input, "Python задача");
    await user.click(addButton);

    expect(screen.getByText(/JavaScript задача/)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript задача/)).toBeInTheDocument();
    expect(screen.getByText(/Python задача/)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    await user.type(searchInput, "Script");

    const visibleTasks = screen.getAllByTestId("todo-item");
    expect(visibleTasks).toHaveLength(2);

    expect(screen.queryByText(/Python/)).not.toBeInTheDocument();

    const highlightedElements = screen.getAllByText("Script");
    expect(highlightedElements.length).toBeGreaterThan(0);
  });
});
