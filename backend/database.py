from pathlib import Path

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

BASE_DIR = Path(__file__).resolve().parent
DATABASE_URL = f"sqlite+aiosqlite:///{(BASE_DIR / 'todos.db').as_posix()}"

engine = create_async_engine(DATABASE_URL)

SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with SessionLocal() as db:
        yield db
