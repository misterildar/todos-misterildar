import { type FC } from "react";
import clsx from "clsx";

import { HighlightedText, Button } from "@/shared";
import { useSearchQuery } from "../../model/hooks";
import type { TodoItemProps } from "../../model/types";

import styles from "./TodoItem.module.scss";

export const TodoItem: FC<TodoItemProps> = ({ todo, onToggle, onRemove }) => {
  const searchQuery = useSearchQuery();

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleRemove = () => {
    onRemove(todo.id);
  };

  return (
    <div
      className={clsx(styles.todoItem, {
        [styles.completed]: todo.completed,
      })}
      data-testid="todo-item"
    >
      <div className={styles.content}>
        <button
          className={clsx(styles.checkbox, {
            [styles.checked]: todo.completed,
          })}
          onClick={handleToggle}
          aria-label={
            todo.completed ? "Mark as completed" : "Mark as not completed"
          }
        >
          {todo.completed && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20,6 9,17 4,12" />
            </svg>
          )}
        </button>
        <span className={styles.text}>
          <HighlightedText
            text={todo.text}
            highlight={searchQuery}
            className={styles.todoText}
          />
        </span>
      </div>
      <Button
        onClick={handleRemove}
        icon="✕"
        variant="icon"
        size="small"
        aria-label="Remove task"
        className={styles.removeButton}
      />
    </div>
  );
};
