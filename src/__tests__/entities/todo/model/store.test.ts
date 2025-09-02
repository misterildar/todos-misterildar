import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { useTodoStore } from "@/entities/todo/model/store";
import { setupUnitTest } from "@/__tests__/test-utils";

setupUnitTest();

describe("Todo Store", () => {
  beforeEach(() => {
    const { clearStore } = setupUnitTest();
    clearStore();
  });

  describe("Initial State", () => {
    it("должен иметь правильное начальное состояние", () => {
      const state = useTodoStore.getState();
      expect(state.todos).toEqual([]);
      expect(state.filter).toBe("all");
      expect(state.searchQuery).toBe("");
    });
  });

  describe("addTodo", () => {
    it("должен правильно добавлять задачи с валидацией", () => {
      const { addTodo } = useTodoStore.getState();
      act(() => {
        addTodo("Новая задача");
      });
      let state = useTodoStore.getState();
      expect(state.todos).toHaveLength(1);
      expect(state.todos[0]).toMatchObject({
        text: "Новая задача",
        completed: false,
      });
      expect(state.todos[0].createdAt).toBeInstanceOf(Date);
      act(() => {
        addTodo("   ");
      });
      state = useTodoStore.getState();
      expect(state.todos).toHaveLength(1);
      act(() => {
        addTodo("  Задача с пробелами  ");
      });
      state = useTodoStore.getState();
      expect(state.todos).toHaveLength(2);
      expect(state.todos[0].text).toBe("Задача с пробелами");
      expect(state.todos[1].text).toBe("Новая задача");
      act(() => {
        addTodo("Третья задача");
      });
      state = useTodoStore.getState();
      expect(state.todos).toHaveLength(3);
      expect(state.todos[0].text).toBe("Третья задача");
      expect(state.todos[1].text).toBe("Задача с пробелами");
      expect(state.todos[2].text).toBe("Новая задача");
    });
  });

  describe("removeTodo", () => {
    it("должен правильно удалять задачи по ID", () => {
      const { addTodo, removeTodo } = useTodoStore.getState();
      act(() => {
        addTodo("Задача для удаления");
      });
      act(() => {
        addTodo("Задача для сохранения");
      });
      let state = useTodoStore.getState();
      expect(state.todos).toHaveLength(2);
      const firstTodoId = state.todos[0].id;
      act(() => {
        removeTodo(firstTodoId);
      });
      state = useTodoStore.getState();
      expect(state.todos).toHaveLength(1);
      expect(state.todos[0].text).toBe("Задача для удаления");
      const secondTodoId = state.todos[0].id;
      act(() => {
        removeTodo(secondTodoId);
      });
      state = useTodoStore.getState();
      expect(state.todos).toHaveLength(0);
    });
  });

  describe("toggleTodo", () => {
    it("должен правильно переключать статус задач", () => {
      const { addTodo, toggleTodo } = useTodoStore.getState();
      act(() => {
        addTodo("Задача для переключения");
      });
      let state = useTodoStore.getState();
      expect(state.todos[0].completed).toBe(false);
      const todoId = state.todos[0].id;
      act(() => {
        toggleTodo(todoId);
      });
      state = useTodoStore.getState();
      expect(state.todos[0].completed).toBe(true);
      act(() => {
        toggleTodo(todoId);
      });
      state = useTodoStore.getState();
      expect(state.todos[0].completed).toBe(false);
    });
  });

  describe("clearCompleted", () => {
    it("должен правильно очищать завершенные задачи", () => {
      const { addTodo, toggleTodo, clearCompleted } = useTodoStore.getState();
      act(() => {
        addTodo("Активная задача 1");
      });
      act(() => {
        addTodo("Активная задача 2");
      });
      act(() => {
        addTodo("Завершенная задача 1");
      });
      act(() => {
        addTodo("Завершенная задача 2");
      });
      let state = useTodoStore.getState();
      expect(state.todos).toHaveLength(4);
      // Находим задачи по тексту, а не по индексу
      const completedTask1 = state.todos.find(
        (todo) => todo.text === "Завершенная задача 1"
      );
      const completedTask2 = state.todos.find(
        (todo) => todo.text === "Завершенная задача 2"
      );
      expect(completedTask1).toBeDefined();
      expect(completedTask2).toBeDefined();
      act(() => {
        toggleTodo(completedTask1!.id);
        toggleTodo(completedTask2!.id);
      });
      state = useTodoStore.getState();
      expect(state.todos.filter((todo) => todo.completed)).toHaveLength(2);
      act(() => {
        clearCompleted();
      });
      state = useTodoStore.getState();
      expect(state.todos).toHaveLength(2);
      expect(state.todos.every((todo) => !todo.completed)).toBe(true);
      const activeTaskTexts = state.todos.map((todo) => todo.text);
      // Проверяем, что активные задачи остались (порядок может измениться)
      expect(activeTaskTexts).toContain("Активная задача 1");
      expect(activeTaskTexts).toContain("Активная задача 2");
      // Проверяем, что завершенные задачи удалены
      expect(activeTaskTexts).not.toContain("Завершенная задача 1");
      expect(activeTaskTexts).not.toContain("Завершенная задача 2");
      // Проверяем, что все оставшиеся задачи действительно активные
      expect(state.todos).toHaveLength(2);
    });
  });

  describe("setFilter и setSearchQuery", () => {
    it("должен правильно устанавливать фильтр и поисковый запрос", () => {
      const { setFilter, setSearchQuery } = useTodoStore.getState();
      act(() => {
        setFilter("active");
      });
      let state = useTodoStore.getState();
      expect(state.filter).toBe("active");
      act(() => {
        setSearchQuery("поиск");
      });
      state = useTodoStore.getState();
      expect(state.filter).toBe("active");
      expect(state.searchQuery).toBe("поиск");
      act(() => {
        setFilter("completed");
      });
      state = useTodoStore.getState();
      expect(state.filter).toBe("completed");
      expect(state.searchQuery).toBe("поиск");
      act(() => {
        setSearchQuery("");
      });
      state = useTodoStore.getState();
      expect(state.filter).toBe("completed");
      expect(state.searchQuery).toBe("");
    });
  });
});
