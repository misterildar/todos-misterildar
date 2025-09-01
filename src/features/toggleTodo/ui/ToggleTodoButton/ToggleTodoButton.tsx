import { type FC } from "react";
import clsx from "clsx";
import { useTodoActions } from "@/entities/todo";

import styles from "./ToggleTodoButton.module.scss";

interface ToggleTodoButtonProps {
  id: string;
  completed: boolean;
  className?: string;
}

export const ToggleTodoButton: FC<ToggleTodoButtonProps> = ({
  id,
  completed,
  className = "",
}) => {
  const { toggleTodo } = useTodoActions();

  const handleToggle = () => {
    toggleTodo(id);
  };

  return (
    <button
      className={clsx(
        styles.toggleButton,
        {
          [styles.completed]: completed,
        },
        className
      )}
      onClick={handleToggle}
      aria-label={completed ? "Mark as not completed" : "Mark as completed"}
    >
      {completed && (
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
  );
};
