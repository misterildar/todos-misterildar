import { useState, type FC, type FormEvent, type KeyboardEvent } from "react";

import { Input } from "@/shared";
import { Button } from "@/shared";
import { useTodoActions } from "@/entities/todo";

import styles from "./AddTodoForm.module.scss";

export const AddTodoForm: FC = () => {
  const [text, setText] = useState("");

  const { addTodo } = useTodoActions();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText("");
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && text.trim()) {
      handleSubmit(event);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputWrapper}>
        <Input
          value={text}
          onChange={setText}
          placeholder="What needs to be done?"
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <Button
          type="submit"
          disabled={!text.trim()}
          className={styles.button}
          text="Add Todo"
        />
      </div>
    </form>
  );
};
