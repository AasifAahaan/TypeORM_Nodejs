# Node.js with PostgreSQL and Docker

This repository demonstrates how to set up a Node.js application with PostgreSQL using Docker Compose. The application is a simple CRUD API, and Docker Compose is used to manage the multiple containers for the Node.js app and PostgreSQL database.

## Prerequisites

Make sure you have the following installed on your machine:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

- `Dockerfile`: Defines the Node.js application container.
- `docker-compose.yml`: Defines and configures the services (Node.js and PostgreSQL) using Docker Compose.
- `.env`: (Optional) Stores environment variables for the Node.js application.
- `src/`: Contains the main application code.

## Setup Instructions

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/your-repository-name
cd your-repository-name
