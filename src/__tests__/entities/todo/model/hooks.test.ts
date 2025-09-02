import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTodoStore } from "@/entities/todo/model/store";
import {
  useTodos,
  useFilteredTodos,
  useTodoStats,
  useTodoFilter,
  useSearchQuery,
  useTodoActions,
  useHasCompletedTodos,
  useHasActiveTodos,
} from "@/entities/todo/model/hooks";
import { setupUnitTest, createTestTodo } from "@/__tests__/test-utils";

setupUnitTest();

describe("Todo Hooks", () => {
  beforeEach(() => {
    const { clearStore } = setupUnitTest();
    clearStore();
  });

  describe("useTodos", () => {
    it("должен возвращать все задачи и обновляться при изменениях", () => {
      const testTodos = [
        createTestTodo("Задача 1"),
        createTestTodo("Задача 2"),
      ];
      const { result } = renderHook(() => useTodos());
      expect(result.current).toEqual([]);
      act(() => {
        useTodoStore.setState({ todos: testTodos });
      });
      expect(result.current).toEqual(testTodos);
    });
  });

  describe("useFilteredTodos", () => {
    it("должен правильно фильтровать задачи по статусу и поиску", () => {
      const testTodos = [
        createTestTodo("React задача", false),
        createTestTodo("Vue задача", true),
        createTestTodo("Angular задача", false),
      ];
      act(() => {
        useTodoStore.setState({ todos: testTodos, filter: "all" });
      });
      const { result: resultAll } = renderHook(() => useFilteredTodos());
      expect(resultAll.current).toHaveLength(3);
      act(() => {
        useTodoStore.setState({ filter: "active" });
      });
      const { result: resultActive } = renderHook(() => useFilteredTodos());
      expect(resultActive.current).toHaveLength(2);
      expect(resultActive.current.every((todo) => !todo.completed)).toBe(true);
      act(() => {
        useTodoStore.setState({ filter: "completed" });
      });
      const { result: resultCompleted } = renderHook(() => useFilteredTodos());
      expect(resultCompleted.current).toHaveLength(1);
      expect(resultCompleted.current.every((todo) => todo.completed)).toBe(
        true
      );
      act(() => {
        useTodoStore.setState({ filter: "all", searchQuery: "React" });
      });
      const { result: resultSearch } = renderHook(() => useFilteredTodos());
      expect(resultSearch.current).toHaveLength(1);
      expect(resultSearch.current[0].text).toBe("React задача");
    });

    it("должен правильно сортировать результаты поиска", () => {
      const testTodos = [
        createTestTodo("Задача про React"),
        createTestTodo("React компонент"),
        createTestTodo("Что-то про React"),
      ];
      act(() => {
        useTodoStore.setState({ todos: testTodos, searchQuery: "React" });
      });
      const { result } = renderHook(() => useFilteredTodos());
      expect(result.current).toHaveLength(3);
      expect(result.current[0].text).toBe("React компонент");
    });

    it("должен игнорировать регистр при поиске", () => {
      const testTodos = [
        createTestTodo("React задача"),
        createTestTodo("REACT компонент"),
        createTestTodo("react приложение"),
      ];
      act(() => {
        useTodoStore.setState({ todos: testTodos, searchQuery: "react" });
      });
      const { result } = renderHook(() => useFilteredTodos());
      expect(result.current).toHaveLength(3);
    });
  });

  describe("useTodoStats", () => {
    it("должен правильно подсчитывать и обновлять статистику", () => {
      const testTodos = [
        createTestTodo("Активная 1", false),
        createTestTodo("Активная 2", false),
        createTestTodo("Завершенная 1", true),
        createTestTodo("Завершенная 2", true),
      ];
      const { result } = renderHook(() => useTodoStats());
      expect(result.current.total).toBe(0);
      act(() => {
        useTodoStore.setState({ todos: testTodos });
      });
      expect(result.current).toEqual({
        total: 4,
        active: 2,
        completed: 2,
      });
      const newTodo = createTestTodo("Новая задача", true);
      act(() => {
        useTodoStore.setState({ todos: [...testTodos, newTodo] });
      });
      expect(result.current).toEqual({
        total: 5,
        active: 2,
        completed: 3,
      });
    });
  });

  describe("useTodoFilter и useSearchQuery", () => {
    it("должен возвращать текущие значения фильтра и поиска", () => {
      act(() => {
        useTodoStore.setState({ filter: "active", searchQuery: "поиск" });
      });
      const { result: filterResult } = renderHook(() => useTodoFilter());
      const { result: searchResult } = renderHook(() => useSearchQuery());
      expect(filterResult.current).toBe("active");
      expect(searchResult.current).toBe("поиск");
    });
  });

  describe("useTodoActions", () => {
    it("должен возвращать все действия и вызывать их корректно", () => {
      const { result } = renderHook(() => useTodoActions());
      expect(result.current).toHaveProperty("addTodo");
      expect(result.current).toHaveProperty("removeTodo");
      expect(result.current).toHaveProperty("toggleTodo");
      expect(result.current).toHaveProperty("clearCompleted");
      expect(result.current).toHaveProperty("setFilter");
      expect(result.current).toHaveProperty("setSearchQuery");
      act(() => {
        result.current.addTodo("Тестовая задача");
      });
      const todos = useTodoStore.getState().todos;
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe("Тестовая задача");
    });
  });

  describe("useHasCompletedTodos и useHasActiveTodos", () => {
    it("должен правильно определять наличие активных и завершенных задач", () => {
      const testTodos = [
        createTestTodo("Активная задача", false),
        createTestTodo("Завершенная задача", true),
      ];
      act(() => {
        useTodoStore.setState({ todos: testTodos });
      });
      const { result: hasCompletedResult } = renderHook(() =>
        useHasCompletedTodos()
      );
      const { result: hasActiveResult } = renderHook(() => useHasActiveTodos());
      expect(hasCompletedResult.current).toBe(true);
      expect(hasActiveResult.current).toBe(true);
      act(() => {
        useTodoStore.setState({
          todos: [createTestTodo("Только активная", false)],
        });
      });
      const { result: hasCompletedResult2 } = renderHook(() =>
        useHasCompletedTodos()
      );
      const { result: hasActiveResult2 } = renderHook(() =>
        useHasActiveTodos()
      );
      expect(hasCompletedResult2.current).toBe(false);
      expect(hasActiveResult2.current).toBe(true);
    });
  });
});
