import { Injectable, Logger } from '@nestjs/common';
import { connect } from 'amqplib';
import { NewsService } from './news.service';

@Injectable()
export class RabbitMqListener {
    private readonly logger = new Logger(RabbitMqListener.name);

    constructor(private readonly newsService: NewsService) {
        this.setupConsumer();
    }

    async setupConsumer() {
        try {
            const connection = await connect('amqp://guest:guest@rabbitmq:5672');
            const channel = await connection.createChannel();

            await channel.assertExchange('news_exchange', 'topic', { durable: false });
            await channel.assertQueue('news_queue', { durable: false });
            await channel.bindQueue('news_queue', 'news_exchange', 'news.items');

            channel.consume('news_queue', async (msg) => {
                if (msg) {
                    const content = msg.content.toString();
                    this.logger.log(`Received message: ${content}`);
                    try {
                        const newsItem = JSON.parse(content);
                        // Basic validation
                        if (!this.validateNewsItem(newsItem)) {
                            this.logger.error('Invalid news item schema:', content);
                        } else {
                            await this.newsService.addNewsItem(newsItem);
                            // Notify WebSocket clients
                            // (We could inject the gateway, or call service to do so)
                        }
                    } catch (error) {
                        this.logger.error('Error parsing news item:', error);
                    }
                    channel.ack(msg);
                }
            });

            this.logger.log('RabbitMQ consumer initialized');
        } catch (error) {
            this.logger.error('RabbitMQ connection error:', error);
        }
    }

    validateNewsItem(item: any): boolean {
        return (
            typeof item.title === 'string' &&
            typeof item.content === 'string' &&
            typeof item.category === 'string' &&
            typeof item.timestamp === 'string' &&
            Array.isArray(item.keywords)
        );
    }
}
