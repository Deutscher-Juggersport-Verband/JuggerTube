import logging

from flask_sqlalchemy.session import Session

from DataDomain.Database.Model import Logs


class LogHandler(logging.Handler):
    """Custom logging handler that logs to the database"""

    def __init__(self, session: Session) -> None:
        """Initialize the log handler"""

        super().__init__()

        self.session = session

    def emit(self, record: logging.LogRecord) -> None:
        """Emit the log record to the database"""

        extra_data = {
            k: v for k,
            v in record.__dict__.items() if k not in vars(
                logging.LogRecord(
                    "",
                    0,
                    "",
                    0,
                    "",
                    None,
                    None))}

        log_entry = Logs(
            logger_name=record.name,
            level=record.levelname,
            message=self.format(record),
            data=extra_data or None
        )

        try:
            self.session.add(log_entry)
            self.session.commit()

        except Exception as e:
            self.session.rollback()
            logging.error(f"LogHandler | Fehler beim Speichern des Logs: {e}")
