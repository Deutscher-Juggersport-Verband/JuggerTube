#!/bin/bash

cd ./backend

set -x # Print commands and their arguments as they are executed.
set -e # Exit immediately if a command exits with a non-zero status.
set -u # Exit immediately if a variable is not defined.

export CACHE_REDIS_HOST='localhost'
export CACHE_REDIS_PORT='6379'
export DATABASE_URL='sqlite:///test.db'
export FLASK_ENV='testing'
export GENERATE_TEST_DATA=True
export MAIL_DEFAULT_SENDER='jtr@localhost'
export MAIL_PASSWORD=None
export MAIL_PORT='25'
export MAIL_SERVER='localhost'
export MAIL_USERNAME=None
export MYSQL_DATABASE='jtr'
export MYSQL_PASSWORD='password'
export MYSQL_ROOT_PASSWORD='password'
export MYSQL_USER='user'
export RABBITMQ_DEFAULT_PASS='mypass'
export RABBITMQ_DEFAULT_USER='admin'
export SECRET_KEY='secret'

exec gunicorn -b 0.0.0.0:8080 wsgi:app &

SERVER_PID=$!

sleep 5

if ps -p $SERVER_PID > /dev/null
then
   echo "Server started successfully"

   kill $SERVER_PID
else
   echo "Server failed to start"

   exit 1
fi
