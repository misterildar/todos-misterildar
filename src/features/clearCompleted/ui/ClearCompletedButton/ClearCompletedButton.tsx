import { type FC } from "react";
import { useTodoActions, useHasCompletedTodos } from "@/entities/todo";

import styles from "./ClearCompletedButton.module.scss";

export const ClearCompletedButton: FC = () => {
  const { clearCompleted } = useTodoActions();

  const hasCompletedTodos = useHasCompletedTodos();

  return (
    <button
      onClick={clearCompleted}
      className={styles.clearButton}
      data-testid="clear-completed-button"
      disabled={!hasCompletedTodos}
    >
      Clear completed
    </button>
  );
};
