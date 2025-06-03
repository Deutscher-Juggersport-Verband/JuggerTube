FROM python:3.13-slim

RUN apt-get update && apt-get install -y cron procps

WORKDIR /app

COPY ../../backend/pyproject.toml .

RUN python -m pip install .

COPY scripts /app/scripts
COPY docker/production/crontab.txt /app/crontab.txt
COPY docker/production/provisioning/start.sh /app/provisioning/start.sh
RUN chmod +x /app/provisioning/start.sh

RUN crontab /app/crontab.txt

CMD ["/app/provisioning/start.sh"]
