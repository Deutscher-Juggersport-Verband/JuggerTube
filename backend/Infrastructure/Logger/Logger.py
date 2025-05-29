import logging
import os

from DataDomain.Database.db import db
from DataDomain.Model.LogHandler import LogHandler

logger = logging.getLogger('juggertube_mysql_logger')

lowest_log_level = logging.DEBUG if os.getenv(
    'FLASK_ENV') == 'development' else logging.INFO
logger.setLevel(lowest_log_level)


db_handler = LogHandler(db.session)
formatter = logging.Formatter('%(message)s')
db_handler.setFormatter(formatter)

logger.addHandler(db_handler)
