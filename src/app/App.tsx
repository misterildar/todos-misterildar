import "@/shared/styles/global.scss";
import { TodoInput } from "@/widgets/todoInput";
import { TodoList } from "@/widgets/todoList";
import { TodoStats } from "@/widgets/todoStats";

import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.todoapp}>
        <TodoInput />
        <TodoList />
        <TodoStats />
      </div>
    </div>
  );
}

export default App;
