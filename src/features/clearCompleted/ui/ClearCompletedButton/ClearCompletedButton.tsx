import { type FC } from "react";
import { useTodoActions, useHasCompletedTodos } from "@/entities/todo";

import styles from "./ClearCompletedButton.module.scss";

export const ClearCompletedButton: FC = () => {
  const { clearCompleted } = useTodoActions();

  const hasCompletedTodos = useHasCompletedTodos();

  if (!hasCompletedTodos) {
    return null;
  }

  return (
    <button onClick={clearCompleted} className={styles.clearButton}>
      Clear completed
    </button>
  );
};
