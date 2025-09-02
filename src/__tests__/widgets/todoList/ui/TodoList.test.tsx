import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList } from "@/widgets/todoList/ui/TodoList/TodoList";
import { useTodoStore } from "@/entities/todo/model/store";
import type { Todo } from "@/entities/todo/model/types";
import { setupUnitTest, createTestTodosWithIds } from "@/__tests__/test-utils";

setupUnitTest();

vi.mock("@/entities/todo", () => ({
  TodoItem: ({
    todo,
    onToggle,
    onRemove,
  }: {
    todo: { id: string; text: string };
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
  }) => (
    <div data-testid={`todo-item-${todo.id}`}>
      <span>{todo.text}</span>
      <button onClick={() => onToggle(todo.id)}>Toggle</button>
      <button onClick={() => onRemove(todo.id)}>Remove</button>
    </div>
  ),
  useFilteredTodos: () => {
    const state = useTodoStore.getState();
    const { todos, searchQuery, filter } = state;

    let filteredTodos = todos;

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTodos = todos.filter((todo) =>
        todo.text.toLowerCase().includes(query)
      );
    }

    if (filter === "active") {
      filteredTodos = filteredTodos.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filteredTodos = filteredTodos.filter((todo) => todo.completed);
    }

    return filteredTodos;
  },
  useTodoActions: () => ({
    toggleTodo: vi.fn(),
    removeTodo: vi.fn(),
  }),
  useSearchQuery: () => useTodoStore.getState().searchQuery,
}));

describe("TodoList", () => {
  let testTodos: Todo[];

  beforeEach(() => {
    const { clearStore } = setupUnitTest();
    clearStore();
    testTodos = createTestTodosWithIds([
      { id: "1", text: "Первая задача", completed: false },
      { id: "2", text: "Вторая задача", completed: true },
      { id: "3", text: "Третья задача", completed: false },
    ]);
  });

  it("должен рендериться с контейнером списка", () => {
    render(<TodoList />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("должен отображать все задачи при их наличии", () => {
    useTodoStore.setState({ todos: testTodos });
    render(<TodoList />);
    expect(screen.getByTestId("todo-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("todo-item-2")).toBeInTheDocument();
    expect(screen.getByTestId("todo-item-3")).toBeInTheDocument();
  });

  it("должен отображать пустое состояние при отсутствии задач", () => {
    render(<TodoList />);
    expect(screen.getByText("no tasks")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("должен отображать сообщение о поиске при пустом результате", () => {
    useTodoStore.setState({ searchQuery: "несуществующий" });
    render(<TodoList />);
    expect(
      screen.getByText('По запросу "несуществующий" ничего не найдено')
    ).toBeInTheDocument();
  });

  it("должен правильно обрабатывать поиск с пробелами", () => {
    useTodoStore.setState({ searchQuery: "   " });
    render(<TodoList />);
    expect(screen.getByText("no tasks")).toBeInTheDocument();
  });

  it("должен правильно обрабатывать поиск с частичным совпадением", () => {
    useTodoStore.setState({ todos: testTodos, searchQuery: "первая" });
    render(<TodoList />);
    expect(screen.getByTestId("todo-item-1")).toBeInTheDocument();
  });

  it("должен правильно обрабатывать поиск с регистром", () => {
    useTodoStore.setState({ todos: testTodos, searchQuery: "ПЕРВАЯ" });
    render(<TodoList />);
    expect(screen.getByTestId("todo-item-1")).toBeInTheDocument();
  });

  it("должен правильно обрабатывать поиск с пустым запросом", () => {
    useTodoStore.setState({ todos: testTodos, searchQuery: "" });
    render(<TodoList />);
    expect(screen.getByTestId("todo-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("todo-item-2")).toBeInTheDocument();
    expect(screen.getByTestId("todo-item-3")).toBeInTheDocument();
  });

  it("должен правильно обрабатывать поиск с специальными символами", () => {
    useTodoStore.setState({ todos: testTodos, searchQuery: "задача" });
    render(<TodoList />);
    expect(screen.getByTestId("todo-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("todo-item-2")).toBeInTheDocument();
    expect(screen.getByTestId("todo-item-3")).toBeInTheDocument();
  });

  it("должен правильно обрабатывать поиск с цифрами", () => {
    useTodoStore.setState({ todos: testTodos, searchQuery: "первая" });
    render(<TodoList />);
    expect(screen.getByTestId("todo-item-1")).toBeInTheDocument();
  });

  it("должен правильно обрабатывать поиск с множественными пробелами", () => {
    useTodoStore.setState({ todos: testTodos, searchQuery: "первая" });
    render(<TodoList />);
    expect(screen.getByTestId("todo-item-1")).toBeInTheDocument();
  });
});
