import "@/shared/styles/global.scss";
import { AddTodoForm } from "@/features/addTodo";
import { TodoList } from "@/widgets/todoList";
import { TodoStats } from "@/widgets/todoStats";
import { SearchInput } from "@/features/search";

import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.todoapp}>
        <h1 className={styles.title}>todos</h1>
        <AddTodoForm />
        <SearchInput />
        <TodoList />
        <TodoStats />
      </div>
    </div>
  );
}

export default App;
