import { useState } from "react";

export default function TodoForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Введите название задачи");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onCreate({ title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
    } catch {
      setError("Не удалось сохранить задачу");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Введите название задачи"
        value={title}
        maxLength={64}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Введите описание задачи"
        value={description}
        maxLength={256}
        rows={2}
        onChange={(e) => setDescription(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? "Добавление..." : "Добавить задачу"}
      </button>
    </form>
  );
}
