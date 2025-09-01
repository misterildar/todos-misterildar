import { type FC } from "react";
import { AddTodoForm } from "@/features/addTodo";

import styles from "./TodoInput.module.scss";

export const TodoInput: FC = () => {
  return (
    <>
      <h1 className={styles.title}>todos</h1>
      <AddTodoForm />
    </>
  );
};
