"""Маршрутизатор задачника."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models.todo import Todo
from backend.schemas.todo import TodoCreate, TodoUpdate

router = APIRouter(prefix="/todos", tags=["Todos"])


async def get_todo_by_id(todo_id: int, session: AsyncSession):
    result = await session.execute(select(Todo).where(Todo.id == todo_id))

    return result.scalar_one_or_none()


@router.get("/")
async def get_todos(
    session: AsyncSession = Depends(get_db),  # noqa: B008
):
    result = await session.execute(select(Todo).order_by(Todo.id))
    return result.scalars().all()


@router.post("/")
async def create_todo(
    data: TodoCreate,
    session: AsyncSession = Depends(get_db),  # noqa: B008
):
    todo = Todo(title=data.title, description=data.description)

    session.add(todo)
    await session.commit()
    await session.refresh(todo)

    return todo


@router.get("/{todo_id}")
async def get_todo(
    todo_id: int,
    session: AsyncSession = Depends(get_db),  # noqa: B008
):
    todo = await get_todo_by_id(todo_id=todo_id, session=session)

    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    return todo


@router.put("/{todo_id}")
async def update_todo(
    todo_id: int,
    data: TodoUpdate,
    session: AsyncSession = Depends(get_db),  # noqa: B008
):
    todo = await get_todo_by_id(todo_id=todo_id, session=session)

    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo.title = data.title
    todo.description = data.description
    todo.is_completed = data.is_completed

    await session.commit()
    await session.refresh(todo)

    return todo


@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: int,
    session: AsyncSession = Depends(get_db),  # noqa: B008
):
    todo = await get_todo_by_id(todo_id=todo_id, session=session)

    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    await session.delete(todo)
    await session.commit()

    return {"message": "Todo deleted successfully"}
