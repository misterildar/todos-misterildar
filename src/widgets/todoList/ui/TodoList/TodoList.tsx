import { type FC } from "react";
import { TodoItem, useFilteredTodos, useTodoActions } from "@/entities/todo";
import styles from "./TodoList.module.scss";

export const TodoList: FC = () => {
  const todos = useFilteredTodos();

  const { toggleTodo, removeTodo } = useTodoActions();

  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateText}>no tasks</p>
      </div>
    );
  }

  return (
    <div className={styles.todoList}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onRemove={removeTodo}
        />
      ))}
    </div>
  );
};
