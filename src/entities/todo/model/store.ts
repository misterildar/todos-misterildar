import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TodoState, TodoFilter, Todo } from "./types";

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: "all",

      addTodo: (text: string) => {
        const newTodo: Todo = {
          id: Date.now().toString(),
          text: text.trim(),
          completed: false,
          createdAt: new Date(),
        };

        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },

      removeTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        }));
      },

      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        }));
      },

      setFilter: (filter: TodoFilter) => {
        set({ filter });
      },

      getFilteredTodos: () => {
        const { todos, filter } = get();
        switch (filter) {
          case "active":
            return todos.filter((todo) => !todo.completed);
          case "completed":
            return todos.filter((todo) => todo.completed);
          default:
            return todos;
        }
      },

      getStats: () => {
        const { todos } = get();
        const total = todos.length;
        const completed = todos.reduce(
          (acc, t) => acc + (t.completed ? 1 : 0),
          0
        );
        const active = total - completed;
        return { total, active, completed };
      },
    }),
    {
      name: "todo-storage",
      partialize: (state) => ({ todos: state.todos }),
    }
  )
);
