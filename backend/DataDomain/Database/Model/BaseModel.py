from operator import or_
from typing import Any

from DataDomain.Database import db


class BaseModel(db.Model):
    """Base model class for all models"""

    __abstract__ = True

    @staticmethod
    def toCamelCase(snake_str):
        components = snake_str.split('_')
        return components[0] + ''.join(x.title() for x in components[1:])

    def serialize(self):
        return {self.toCamelCase(c.name): getattr(self, c.name)
                for c in self.__table__.columns}

    def create(self) -> Any | None:
        """Create a new record in the database"""
        from Infrastructure.Logger import logger
        try:
            db.session.add(self)
            db.session.commit()

            logger.info(
                f'{self.__table__.name} | create | created {self.__table__.name} - {self.id}')

            return self.id if self.id else None

        except Exception as e:
            db.session.rollback()
            logger.error(f'{self.__table__.name} | create | {e}')
            raise e

    def save(self) -> None:
        """Save the model to the database"""
        from Infrastructure.Logger import logger
        try:
            db.session.commit()

            logger.info(
                f'{self.__table__.name} | update | updated {self.__table__.name} - {self.id}')

        except Exception as e:
            db.session.rollback()
            logger.error(
                f'{self.__table__.name} | update | {e}')
            raise e

    def shadow(self) -> None:
        """Mark the model as deleted without actually deleting it"""
        from Infrastructure.Logger import logger
        try:
            self.is_deleted = True
            self.save()
            logger.info(
                f'{self.__table__.name} | shadow | marked {self.__table__.name} - {self.id} as deleted')
        except Exception as e:
            logger.error(f'{self.__table__.name} | shadow | {e}')
            raise e

    def delete(self) -> None:
        """Delete the model from the database"""
        from Infrastructure.Logger import logger
        try:
            db.session.delete(self)
            db.session.commit()
            logger.info(
                f'{self.__table__.name} | delete | deleted {self.__table__.name} - {self.id}')
        except Exception as e:
            db.session.rollback()
            logger.error(f'{self.__table__.name} | delete | {e}')
            raise e

    def exists(self, **kwargs) -> bool:
        """Überprüft, ob ein Datensatz basierend auf den übergebenen Keyword-Argumenten existiert."""
        filters = [getattr(self.__class__, key) == value for key,
                   value in kwargs.items() if value is not None]

        return self.__class__.query(db.exists()).filter(
            or_(*filters),
            self.__class__.is_deleted == False
        ).scalar()

    def count(self) -> int:
        """Count the number of records in the database"""
        return db.session.query(self.__class__).filter(
            self.__class__.is_deleted == False).count()
