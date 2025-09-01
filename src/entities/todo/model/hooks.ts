import { useMemo } from "react";
import { useTodoStore } from "./store";

export const useTodos = () => {
  return useTodoStore((state) => state.todos);
};

export const useFilteredTodos = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);

  return useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
};

export const useTodoStats = () => {
  const total = useTodoStore((state) => state.todos.length);
  const completed = useTodoStore((state) =>
    state.todos.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0)
  );

  return useMemo(() => {
    const active = total - completed;
    return { total, active, completed };
  }, [total, completed]);
};

export const useTodoFilter = () => {
  return useTodoStore((state) => state.filter);
};

export const useTodoActions = () => {
  const addTodo = useTodoStore((state) => state.addTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const setFilter = useTodoStore((state) => state.setFilter);

  return {
    addTodo,
    removeTodo,
    toggleTodo,
    clearCompleted,
    setFilter,
  };
};

export const useHasCompletedTodos = () => {
  return useTodoStore((state) => state.todos.some((todo) => todo.completed));
};

export const useHasActiveTodos = () => {
  return useTodoStore((state) => state.todos.some((todo) => !todo.completed));
};
