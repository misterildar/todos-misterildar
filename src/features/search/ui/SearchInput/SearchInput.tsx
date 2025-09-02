import { type FC, type FormEvent, useState, useEffect } from "react";
import { Input } from "@/shared";
import { useTodoActions, useSearchQuery } from "@/entities/todo";

import styles from "./SearchInput.module.scss";

export const SearchInput: FC = () => {
  const [localQuery, setLocalQuery] = useState("");

  const { setSearchQuery } = useTodoActions();

  const currentSearchQuery = useSearchQuery();

  useEffect(() => {
    setLocalQuery(currentSearchQuery);
  }, [currentSearchQuery]);

  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocalQuery(value);

    if (value.trim().length > 0) {
      setSearchQuery(value);
    } else {
      setSearchQuery("");
    }
  };

  const handleClearSearch = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className={styles.searchContainer}>
      <Input
        type="text"
        placeholder="Search tasks..."
        value={localQuery}
        onChange={handleInputChange}
        className={styles.searchInput}
      />
      {localQuery && (
        <button
          type="button"
          onClick={handleClearSearch}
          className={styles.clearButton}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};
