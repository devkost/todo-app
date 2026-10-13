"""Схема задачника."""

from pydantic import BaseModel, Field


class TodoCreate(BaseModel):
    title: str = Field(min_length=1, max_length=64)
    description: str = Field(default=None, max_length=256)


class TodoUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=64)
    description: str | None = Field(default=None, max_length=256)
    is_completed: bool = Field(default=False)
