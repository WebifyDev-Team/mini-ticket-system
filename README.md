# Running the Project with Docker Compose

## Getting Started

From the root of the project, run the following command to build and start the services in detached mode:

```bash
docker-compose up --build -d
```

## This will start:

### mongo: MongoDB database (port 27017)

### api: Node backend API (port 3000)

### web: Vue frontend (port 8080)


### Access the Application

```bash
http://localhost:8080/
```