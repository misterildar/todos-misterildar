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

  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} data-testid="form">
      <Input
        value={text}
        onChange={handleInputChange}
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
    </form>
  );
};
