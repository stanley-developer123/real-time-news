
# Real-Time News System

A scalable application that generates, processes, and displays simulated news items in real-time using Python, NestJS, Angular, RabbitMQ, Redis, Weboscket, and Docker.

## Features

- **AI-Generated Content:** Utilizes OpenAI's API to create realistic news articles.
- **Real-Time Updates:** Implements websocket for instant news delivery to the frontend.
- **Message Broker:** Uses RabbitMQ to handle communication between services.
- **In-Memory Storage with Redis:** Stores the latest 20 news items for quick access.
- **Frontend:** An Angular app that displays live news feeds and statistics.
- **Containerization:** Dockerizes all services for easy deployment and management.

## Getting Started

### Prerequisites

- **Docker:** [Install Docker](https://www.docker.com/get-started)
- **Docker Compose:** [Install Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/stanley-developer123/real-time-news.git
   cd real-time-news
   ```
2. **Start the services:**

   ```bash
   docker-compose up --build
   ```
3. **Access the services:**

   - **RabbitMQ Management UI**: [http://localhost:15672](http://localhost:15672)
   - **NestJS Backend**: [http://localhost:3000](http://localhost:3000)
   - **Angular Frontend**: [http://localhost:8080](http://localhost:8080)

## Stopping the Application

To stop the services, run:

```bash
docker-compose down
```

## Notes

- You may add an `OPENAI_API_KEY` for the python script `generator.py`, or include it in the `docker-compose.yml` for the `news-generator` service

## Known Issues and Suggestions for Improvements

- **Frontend:** Improve responsivity for mobile, add infographics, add navigation sidebar,  synchronize "time since" for every region
- **Backend:** Add more categories, more dynamic content generation, add permanent database to store history of all news
- **Devops:** Implement github actions for automating building and uploading containers, deploy the services on the cloud for global access

## Troubleshooting

- **Port Conflicts**: Ensure the required ports (5672, 15672, 6379, 3000, 8080) are not in use by other applications.
- **Docker Versions**: The project was tested with docker version 27.4.0 and docker-compose v2.31.0-desktop.2
