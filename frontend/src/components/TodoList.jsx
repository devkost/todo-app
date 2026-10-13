import TodoItem from "./TodoItem.jsx";

export default function TodoList({ todos, onUpdate, onDelete }) {
  if (todos.length === 0) {
    return <p className="muted empty">Задач пока нет</p>;
  }

  return (
    <ul className="list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
