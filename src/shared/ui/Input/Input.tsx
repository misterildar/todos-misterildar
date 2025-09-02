import { type FC, type KeyboardEvent, type FormEvent } from "react";
import clsx from "clsx";

import styles from "./Input.module.scss";

interface InputProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  onChange: (event: FormEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password";
  onKeyDown?: (event: KeyboardEvent) => void;
}

export const Input: FC<InputProps> = ({
  value,
  placeholder = "",
  disabled = false,
  autoFocus = false,
  className = "",
  onChange,
  type = "text",
  onKeyDown,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={clsx(styles.input, className)}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus}
    />
  );
};
