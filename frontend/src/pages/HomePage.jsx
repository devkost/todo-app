import { useEffect, useState } from "react";
import * as api from "../api/todos.js";
import TodoForm from "../components/TodoForm.jsx";
import TodoList from "../components/TodoList.jsx";

const FILTERS = {
  all: { label: "Все", test: () => true },
  active: { label: "Активные", test: (t) => !t.is_completed },
  completed: { label: "Выполненные", test: (t) => t.is_completed },
};

export default function HomePage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadTodos() {
    setLoading(true);
    setError("");
    try {
      setTodos(await api.getTodos());
    } catch {
      setError("Не удалось загрузить задачи");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function handleCreate(data) {
    const created = await api.createTodo(data);
    setTodos((prev) => [...prev, created]);
  }

  async function handleUpdate(id, data) {
    const updated = await api.updateTodo(id, data);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id) {
    await api.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const visibleTodos = todos.filter(FILTERS[filter].test);
  const activeCount = todos.filter((t) => !t.is_completed).length;

  return (
    <main className="container">
      <h1>Todo App</h1>

      <TodoForm onCreate={handleCreate} />

      <div className="toolbar">
        <div className="filters">
          {Object.entries(FILTERS).map(([key, { label }]) => (
            <button
              key={key}
              className={filter === key ? "chip chip--active" : "chip"}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="muted">
          Осталось: {activeCount} из {todos.length}
        </span>
      </div>

      {loading && <p className="muted">Загрузка...</p>}

      {error && (
        <div className="alert">
          {error}
          <button className="btn btn--small" onClick={loadTodos}>
            Повторить
          </button>
        </div>
      )}

      {!loading && !error && (
        <TodoList todos={visibleTodos} onUpdate={handleUpdate} onDelete={handleDelete} />
      )}
    </main>
  );
}
