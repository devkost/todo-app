# Todo App

Учебное Todo-приложение: REST API на **FastAPI** и клиент на **React**.

Можно создавать задачи, отмечать их выполненными, редактировать и удалять. Данные хранятся в SQLite.

## Стек

| Часть    | Технологии                                              |
| -------- | ------------------------------------------------------- |
| Backend  | Python 3.11+, FastAPI, SQLAlchemy 2 (async), aiosqlite, Pydantic 2, Uvicorn |
| Frontend | React 19, Vite, JavaScript, Fetch API                   |
| База     | SQLite                                                  |

## Возможности

- Создание задачи с названием и необязательным описанием
- Просмотр списка задач
- Отметка задачи выполненной и возврат в активные
- Редактирование названия и описания
- Удаление задачи
- Фильтры: все / активные / выполненные
- Сообщения об ошибках, если сервер недоступен или запрос не прошёл
- Светлая и тёмная тема (по настройке системы)

## Структура

```text
todo-app/
├── backend/
│   ├── main.py          # точка входа FastAPI, CORS, создание таблиц
│   ├── database.py      # подключение к SQLite (todos.db создаётся автоматически)
│   ├── models/todo.py   # SQLAlchemy-модель Todo
│   ├── schemas/todo.py  # Pydantic-схемы
│   └── routers/todos.py # CRUD-эндпоинты /todos
├── frontend/
│   ├── src/
│   │   ├── api/todos.js # запросы к API
│   │   ├── components/  # TodoForm, TodoList, TodoItem
│   │   └── pages/       # HomePage
│   └── vite.config.js   # dev-сервер и proxy /api -> backend
└── requirements.txt
```

## Запуск

Нужны **Python 3.11+** и **Node.js 18+**.

### 1. Backend

Из корня репозитория:

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

> Запускать нужно именно из корня и именно как `backend.main:app`, потому что backend импортируется как пакет `backend`.

### 2. Frontend

В отдельном терминале:

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на http://localhost:5173.

Frontend отправляет запросы на `/api/...`, и dev-сервер Vite проксирует их на `http://localhost:8000`.
Если backend работает по другому адресу, задайте переменную `VITE_API_URL`, например:

```bash
VITE_API_URL=http://localhost:8000 npm run dev
```

## API

| Метод    | Путь               | Описание               |
| -------- | ------------------ | ---------------------- |
| `GET`    | `/todos/`          | Список всех задач      |
| `GET`    | `/todos/{id}`      | Одна задача            |
| `POST`   | `/todos/`          | Создать задачу         |
| `PUT`    | `/todos/{id}`      | Обновить задачу        |
| `DELETE` | `/todos/{id}`      | Удалить задачу         |

Пример задачи:

```json
{
  "id": 1,
  "title": "Выучить FastAPI",
  "description": "Сделать CRUD API",
  "is_completed": false,
  "created_at": "2026-10-13T14:30:00"
}
```
