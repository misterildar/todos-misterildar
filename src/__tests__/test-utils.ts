import { vi } from "vitest";
import { act } from "@testing-library/react";
import { useTodoStore } from "@/entities/todo/model/store";
import type { Todo } from "@/entities/todo/model/types";

export const mockZustandPersist = () => {
  vi.mock("zustand/middleware", () => ({
    persist: (fn: unknown) => fn,
  }));
};

export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });

  return localStorageMock;
};

export const clearTestStore = () => {
  act(() => {
    useTodoStore.setState({
      todos: [],
      filter: "all",
      searchQuery: "",
    });
  });
};

export const createTestTodo = (
  text: string,
  completed: boolean = false
): Todo => ({
  id: `test-${Math.random().toString(36).substr(2, 9)}`,
  text,
  completed,
  createdAt: new Date(),
});

export const createTestTodoWithId = (
  id: string,
  text: string,
  completed: boolean = false
): Todo => ({
  id,
  text,
  completed,
  createdAt: new Date(),
});

export const createTestTodos = (texts: string[]): Todo[] => {
  return texts.map((text) => createTestTodo(text, false));
};

export const createTestTodosWithIds = (
  items: Array<{ id: string; text: string; completed?: boolean }>
): Todo[] => {
  return items.map(({ id, text, completed = false }) =>
    createTestTodoWithId(id, text, completed)
  );
};

export const setupIntegrationTest = () => {
  const localStorageMock = mockLocalStorage();

  return {
    localStorageMock,
    clearStore: clearTestStore,
  };
};

export const setupUnitTest = () => {
  mockZustandPersist();
  return {
    clearStore: clearTestStore,
  };
};
