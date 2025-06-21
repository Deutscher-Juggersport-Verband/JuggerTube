import logging
import os

from flask import Flask
from flask_migrate import current, upgrade
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

db = SQLAlchemy()


def executeSqlFile(filename: str) -> None:
    """Executes the SQL commands in the given file"""

    with open(filename, 'r') as sql_file:
        sqlCommands = sql_file.read()

    connection = db.engine.raw_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(sqlCommands)
        connection.commit()

    except Exception as e:
        connection.rollback()
        logging.error(
            f'Database | db | Fehler beim Ausführen der SQL-Datei: {e}')

    finally:
        cursor.close()
        connection.close()


def executeSqlCommandsToInitDatabase(app: Flask) -> None:
    """Executes the SQL commands in the init-database folder"""

    folderPath = os.path.join(
        app.config['DATABASE_PATH'],
        'data/init-database')

    for filename in os.listdir(folderPath):
        if filename.endswith('.sql'):
            fullPath = os.path.join(folderPath, filename)

            executeSqlFile(fullPath)


def tablesExist() -> bool:
    """Check if tables already exist in the database"""
    try:
        # Try to query a table that should exist
        result = db.session.execute(text("SHOW TABLES LIKE 'users'"))
        return result.fetchone() is not None
    except Exception as e:
        logging.warning(f'Database | db | Could not check if tables exist: {e}')
        return False


def initDatabase(app: Flask) -> None:
    """Initializes the database with the given SQL commands"""

    with app.app_context():
        # Check if tables already exist (MySQL init script may have created them)
        if tablesExist():
            logging.info('Database | db | Tables already exist, skipping table creation')
        else:
            logging.info('Database | db | No tables found, running migrations')
            if current() != 'head':
                upgrade()

        if bool(os.getenv('GENERATE_TEST_DATA')):
            executeSqlCommandsToInitDatabase(app)
