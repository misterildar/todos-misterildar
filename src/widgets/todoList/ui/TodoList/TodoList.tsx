import { type FC } from "react";
import {
  TodoItem,
  useFilteredTodos,
  useTodoActions,
  useSearchQuery,
} from "@/entities/todo";
import styles from "./TodoList.module.scss";

export const TodoList: FC = () => {
  const todos = useFilteredTodos();
  const searchQuery = useSearchQuery();
  const { toggleTodo, removeTodo } = useTodoActions();

  if (todos.length === 0) {
    if (searchQuery.trim().length > 0) {
      return (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>
            По запросу "{searchQuery}" ничего не найдено
          </p>
        </div>
      );
    }
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateText}>no tasks</p>
      </div>
    );
  }

  return (
    <div className={styles.todoListContainer}>
      {searchQuery.trim().length > 0 && (
        <div className={styles.searchResults}>
          <p className={styles.searchResultsText}>
            Найдено задач: {todos.length}
          </p>
        </div>
      )}
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
    </div>
  );
};
