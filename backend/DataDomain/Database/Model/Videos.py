from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Mapped

from DataDomain.Database import db
from DataDomain.Database.Enum import (
    GameSystemTypesEnum,
    VideoCategoriesEnum,
    VideoStatusEnum,
    WeaponTypesEnum,
)
from DataDomain.Database.Model import BaseModel, Channels, Teams, Tournaments, Users


class Videos(BaseModel):
    __tablename__ = 'videos'

    id: int = db.Column(
        db.Integer,
        primary_key=True,
    )

    name: str = db.Column(
        db.String(100),
        nullable=False,
        unique=True,
    )

    category: VideoCategoriesEnum = db.Column(
        db.Enum(VideoCategoriesEnum),
        nullable=False,
        default=VideoCategoriesEnum.OTHER
    )

    video_link: str = db.Column(
        db.String(255),
        nullable=False,
        unique=True,
    )

    upload_date: datetime = db.Column(
        db.DateTime,
        nullable=False,
    )

    comment: str = db.Column(
        db.Text,
        nullable=False,
        default=''
    )

    date_of_recording: datetime | None = db.Column(
        db.DateTime,
        nullable=True,
    )

    game_system: GameSystemTypesEnum | None = db.Column(
        db.Enum(GameSystemTypesEnum),
        nullable=True,
    )

    weapon_type: WeaponTypesEnum | None = db.Column(
        db.Enum(WeaponTypesEnum),
        nullable=True,
    )

    topic: str = db.Column(
        db.String(100),
        nullable=False
    )

    guests: str = db.Column(
        db.String(100),
        nullable=False
    )

    status: VideoStatusEnum = db.Column(
        db.Enum(VideoStatusEnum),
        nullable=False,
        default=VideoStatusEnum.PENDING
    )

    uploader_id: int | None = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=True
    )

    uploader: Mapped[Users | None] = db.relationship(
        'Users',
        foreign_keys=[uploader_id],
    )

    channel_id: int = db.Column(
        db.Integer,
        db.ForeignKey('channels.id'),
        nullable=False
    )

    channel: Mapped[Channels] = db.relationship(
        'Channels',
        back_populates='videos'
    )

    tournament_id: int | None = db.Column(
        db.Integer,
        db.ForeignKey('tournaments.id'),
        nullable=True
    )

    tournament: Mapped[Tournaments | None] = db.relationship(
        'Tournaments',
        back_populates='videos'
    )

    team_one_id: int | None = db.Column(
        db.Integer,
        db.ForeignKey('teams.id'),
        nullable=True)

    team_one: Mapped[Teams | None] = db.relationship(
        'Teams',
        foreign_keys=[team_one_id]
    )

    team_two_id: int | None = db.Column(
        db.Integer,
        db.ForeignKey('teams.id'),
        nullable=True
    )

    team_two: Mapped[Teams | None] = db.relationship(
        'Teams',
        foreign_keys=[team_two_id]
    )

    is_deleted: bool = db.Column(
        db.Boolean,
        nullable=False,
        server_default='0'
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
