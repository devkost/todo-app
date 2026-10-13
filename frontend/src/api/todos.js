// Базовый адрес API. В dev-режиме Vite проксирует /api -> http://localhost:8000.
// Можно переопределить через переменную окружения VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Сервер недоступен");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(getErrorMessage(data, response.status));
    error.status = response.status;
    throw error;
  }

  return data;
}

function getErrorMessage(data, status) {
  if (status === 404) return "Задача не найдена";
  if (typeof data?.detail === "string") return data.detail;
  // Ошибки валидации FastAPI приходят массивом
  if (Array.isArray(data?.detail)) return data.detail.map((e) => e.msg).join(", ");
  return `Ошибка сервера (${status})`;
}

// Маршруты в backend объявлены со слешем на конце ("/todos/")
export function getTodos() {
  return request("/todos/");
}

export function getTodo(id) {
  return request(`/todos/${id}`);
}

export function createTodo({ title, description }) {
  const body = { title };
  // backend не принимает description: null, поэтому пустое описание не отправляем
  if (description) body.description = description;
  return request("/todos/", { method: "POST", body: JSON.stringify(body) });
}

export function updateTodo(id, { title, description, is_completed }) {
  return request(`/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, description: description || null, is_completed }),
  });
}

export function deleteTodo(id) {
  return request(`/todos/${id}`, { method: "DELETE" });
}
