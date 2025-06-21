FROM python:3.13-slim

RUN apt-get update && apt-get install -y cron procps

WORKDIR /app

COPY ../../backend/pyproject.toml .

RUN python -m pip install .

COPY ../../backend/scripts /app/scripts

COPY docker/production/crontab.txt /app/crontab.txt
COPY docker/production/provisioning /usr/local/bin

RUN find /usr/local/bin -type f -name "*" -exec chmod +x {} \;

RUN crontab /app/crontab.txt

CMD ["start-cron.sh"]
