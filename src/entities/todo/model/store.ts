import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TodoState, TodoFilter, Todo } from "./types";

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      filter: "all",
      searchQuery: "",

      addTodo: (text: string) => {
        const trimmedText = text.trim();
        if (!trimmedText) return;

        const newTodo: Todo = {
          id: crypto.randomUUID(),
          text: trimmedText,
          completed: false,
          createdAt: new Date(),
        };

        set((state) => ({
          todos: [newTodo, ...state.todos],
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

      setSearchQuery: (searchQuery: string) => {
        set({ searchQuery });
      },
    }),
    {
      name: "todo-storage",
      partialize: (state) => ({ todos: state.todos }),
    }
  )
);
