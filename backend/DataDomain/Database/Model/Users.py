import os
from datetime import datetime
from typing import Any

from sqlalchemy import Case, case, func, literal
from sqlalchemy.ext.hybrid import hybrid_property

from DataDomain.Database import db
from DataDomain.Database.Enum import UserRoleEnum
from DataDomain.Database.Model import BaseModel


class Users(BaseModel):

    __tablename__ = 'users'

    id: int = db.Column(
        db.Integer,
        primary_key=True
    )

    username: str = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    escaped_username: str = db.Column(
        db.String(100),
        nullable=False
    )

    password_hash: str = db.Column(
        db.String(255),
        nullable=False
    )

    password_reset_hash: str = db.Column(
        db.String(255),
        nullable=True
    )

    email: str | None = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    name: str | None = db.Column(
        db.String(100),
        nullable=True
    )

    picture: str | None = db.Column(
        db.String(255),
        nullable=True,
        server_default='default.png'
    )

    is_deleted: bool = db.Column(
        db.Boolean,
        nullable=False,
        server_default='0'
    )

    role: UserRoleEnum = db.Column(
        db.Enum(UserRoleEnum),
        nullable=False,
        server_default=UserRoleEnum.USER.value
    )

    created_at: datetime = db.Column(
        db.DateTime,
        server_default=func.now()
    )

    updated_at: datetime = db.Column(
        db.DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

    def serialize(self) -> dict[str, Any]:
        """
        Serializes the object as a dictionary.
        """

        serialized = super().serialize()

        del serialized['passwordHash']

        return serialized

    @hybrid_property
    def picture_url(self) -> str:
        """Creates the URL for the user's profile picture."""
        match os.getenv('FLASK_ENV'):
            case 'development':
                return f'https://cdn.localhost/assets/user-pictures/{
                    self.picture}'

            case 'production':
                return f'https://cdn.juggertube.de/assets/user-pictures/{
                    self.picture}'

            case _:
                return self.picture

    @picture_url.expression
    def picture_url(cls) -> Case:
        """Creates the URL for the user's profile picture."""

        return case(
            (literal(os.getenv('FLASK_ENV')) == 'development',
             literal('https://cdn.localhost/assets/user-pictures/') + cls.picture),
            (literal(os.getenv('FLASK_ENV')) == 'production',
             literal(
                 'https://cdn.juggertube.de/assets/user-pictures/') + cls.picture),
            else_=cls.picture
        )
