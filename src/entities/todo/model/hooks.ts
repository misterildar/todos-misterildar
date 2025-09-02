import { useMemo } from "react";
import { useTodoStore } from "./store";
import type { Todo } from "./types";

export const useTodos = () => {
  return useTodoStore((state) => state.todos);
};

export const useFilteredTodos = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const searchQuery = useTodoStore((state) => state.searchQuery);

  return useMemo(() => {
    let filteredTodos = todos;
    if (searchQuery.trim().length > 0) {
      const searchText = searchQuery.toLowerCase();

      filteredTodos = todos
        .filter((todo) => todo.text.toLowerCase().includes(searchText))
        .sort((a, b) => {
          const aText = a.text.toLowerCase();
          const bText = b.text.toLowerCase();

          const aStartsWith = aText.startsWith(searchText);
          const bStartsWith = bText.startsWith(searchText);

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          const aIndex = aText.indexOf(searchText);
          const bIndex = bText.indexOf(searchText);

          if (aIndex !== bIndex) {
            return aIndex - bIndex;
          }

          return aText.length - bText.length;
        });
    }

    const filterMap = {
      active: (todo: Todo) => !todo.completed,
      completed: (todo: Todo) => todo.completed,
      all: () => true,
    };

    return filteredTodos.filter(filterMap[filter] || filterMap.all);
  }, [todos, filter, searchQuery]);
};

export const useTodoStats = () => {
  const todos = useTodoStore((state) => state.todos);

  return useMemo(() => {
    const total = todos.length;
    const completed = todos.reduce(
      (acc, todo) => acc + (todo.completed ? 1 : 0),
      0
    );
    const active = total - completed;
    return { total, active, completed };
  }, [todos]);
};

export const useTodoFilter = () => {
  return useTodoStore((state) => state.filter);
};

export const useSearchQuery = () => {
  return useTodoStore((state) => state.searchQuery);
};

export const useTodoActions = () => {
  const addTodo = useTodoStore((state) => state.addTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const setFilter = useTodoStore((state) => state.setFilter);
  const setSearchQuery = useTodoStore((state) => state.setSearchQuery);

  return {
    addTodo,
    removeTodo,
    toggleTodo,
    clearCompleted,
    setFilter,
    setSearchQuery,
  };
};

export const useHasCompletedTodos = () => {
  return useTodoStore((state) => state.todos.some((todo) => !todo.completed));
};

export const useHasActiveTodos = () => {
  return useTodoStore((state) => state.todos.some((todo) => !todo.completed));
};
