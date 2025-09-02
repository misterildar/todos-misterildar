import { type FC } from "react";
import clsx from "clsx";

import { Button } from "@/shared";
import { useTodoStats, useTodoFilter, useTodoActions } from "@/entities/todo";

import styles from "./TodoStats.module.scss";

export const TodoStats: FC = () => {
  const stats = useTodoStats();

  const currentFilter = useTodoFilter();

  const { setFilter, clearCompleted } = useTodoActions();

  const filters = [
    { key: "all" as const, label: "All", count: stats.total },
    { key: "active" as const, label: "Active", count: stats.active },
    { key: "completed" as const, label: "Completed", count: stats.completed },
  ];

  return (
    <div className={styles.todoStats}>
      <span className={styles.counter}>{stats.active} items left</span>
      <div className={styles.filters}>
        {filters.map((filter) => (
          <Button
            key={filter.key}
            onClick={() => setFilter(filter.key)}
            text={filter.label}
            variant="secondary"
            size="small"
            className={clsx(styles.filterButton, {
              [styles.active]: currentFilter === filter.key,
            })}
          />
        ))}
      </div>
      <div className={styles.actions}>
        <Button
          onClick={clearCompleted}
          text="Clear completed"
          variant="secondary"
          size="small"
          disabled={stats.completed === 0}
          data-testid="clear-completed-button"
          className={clsx(styles.actionsButton, {
            [styles.active]: stats.completed > 0,
          })}
        />
      </div>
    </div>
  );
};
