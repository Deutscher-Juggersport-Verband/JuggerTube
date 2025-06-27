# JuggerTube

## Set up development environment

To set up the development environment, you need to have Docker installed on your machine. 
Docker allows you to containerize your application, ensuring consistency across different development environments. 
Once Docker is installed, navigate to the root directory of the project and run 
```sh
  docker-compose up -d
```
to start the necessary services. 

After the services are up and running, you can build the project for different platforms using Nx.
For initial setup, run `npm install` inside the frontend folder to install the necessary dependencies.
To serving the project, navigate to the frontend folder and run
```sh
  npm run start:desktop
```
This will compile the respective versions of your application, making them ready for development and testing.

If you have to execute commands inside the Docker container, you can use the following command to connect to the container:

```sh
  docker exec -it jtr /bin/sh
```

## Run Scripts

We have three scripts to import data to our Application. You can find those under backend/scripts. 
If you have no data in your database yet, make sure to execute the scripts in the order they are listed below.
If you execute the script to get data from the excel-file, make sure to replace the address of our server with your local address before running it.

```sh
  python backend/scripts/tournaments/main.py
```

```sh
  python backend/scripts/excel_videos/read_excel.py
```

```sh
  python backend/scripts/youtube_videos/youtube_api.py
```
