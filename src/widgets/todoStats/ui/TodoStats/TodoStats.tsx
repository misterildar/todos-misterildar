import { type FC } from "react";
import clsx from "clsx";

import { ClearCompletedButton } from "@/features/clearCompleted";
import { useTodoStats, useTodoFilter, useTodoActions } from "@/entities/todo";

import styles from "./TodoStats.module.scss";

export const TodoStats: FC = () => {
  const stats = useTodoStats();

  const currentFilter = useTodoFilter();

  const { setFilter } = useTodoActions();

  const filters = [
    { key: "all" as const, label: "All", count: stats.total },
    { key: "active" as const, label: "Active", count: stats.active },
    { key: "completed" as const, label: "Completed", count: stats.completed },
  ];

  return (
    <div className={styles.todoStats}>
      <div className={styles.stats}>
        <span className={styles.counter}>{stats.active} items left</span>
      </div>
      <div className={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFilter(filter.key)}
            className={clsx(styles.filterButton, {
              [styles.active]: currentFilter === filter.key,
            })}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className={styles.actions}>
        <ClearCompletedButton />
      </div>
    </div>
  );
};
