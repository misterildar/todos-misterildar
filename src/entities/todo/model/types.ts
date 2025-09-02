export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoFilter = "all" | "active" | "completed";

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

export interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  searchQuery: string;
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: TodoFilter) => void;
  setSearchQuery: (query: string) => void;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}
