import { useState } from "react";

// backend возвращает время в UTC без указания зоны — добавляем "Z"
function formatDate(value) {
  const hasZone = /Z|[+-]\d{2}:\d{2}$/.test(value);
  return new Date(hasZone ? value : `${value}Z`).toLocaleString("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action, errorMessage) {
    setBusy(true);
    setError("");
    try {
      await action();
      return true;
    } catch (e) {
      setError(e.status === 404 ? "Задача не найдена" : errorMessage);
      return false;
    } finally {
      setBusy(false);
    }
  }

  function toggleCompleted() {
    run(
      () =>
        onUpdate(todo.id, {
          title: todo.title,
          description: todo.description,
          is_completed: !todo.is_completed,
        }),
      "Не удалось сохранить задачу"
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Введите название задачи");
      return;
    }
    const ok = await run(
      () =>
        onUpdate(todo.id, {
          title: title.trim(),
          description: description.trim(),
          is_completed: todo.is_completed,
        }),
      "Не удалось сохранить задачу"
    );
    if (ok) setEditing(false);
  }

  function handleCancel() {
    setTitle(todo.title);
    setDescription(todo.description ?? "");
    setError("");
    setEditing(false);
  }

  function handleDelete() {
    if (!window.confirm(`Удалить задачу «${todo.title}»?`)) return;
    run(() => onDelete(todo.id), "Не удалось удалить задачу");
  }

  if (editing) {
    return (
      <li className="card item">
        <form className="form" onSubmit={handleSave}>
          <input
            type="text"
            value={title}
            maxLength={64}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={description}
            maxLength={256}
            rows={2}
            placeholder="Описание"
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <div className="actions">
            <button type="submit" className="btn btn--primary" disabled={busy}>
              Сохранить
            </button>
            <button type="button" className="btn" onClick={handleCancel} disabled={busy}>
              Отмена
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`card item ${todo.is_completed ? "item--done" : ""}`}>
      <label className="item__main">
        <input
          type="checkbox"
          checked={todo.is_completed}
          className="check"
          disabled={busy}
          onChange={toggleCompleted}
          title={todo.is_completed ? "Вернуть в активные" : "Отметить выполненной"}
          aria-label={todo.is_completed ? "Вернуть в активные" : "Отметить выполненной"}
        />
        <div>
          <div className="item__title">{todo.title}</div>
          {todo.description && <div className="item__desc">{todo.description}</div>}
          <div className="item__meta">
            #{todo.id} · {formatDate(todo.created_at)}
          </div>
        </div>
      </label>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button className="btn btn--small" onClick={() => setEditing(true)} disabled={busy}>
          Редактировать
        </button>
        <button className="btn btn--small btn--danger" onClick={handleDelete} disabled={busy}>
          Удалить
        </button>
      </div>
    </li>
  );
}
