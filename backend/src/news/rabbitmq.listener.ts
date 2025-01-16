import { Injectable, Logger } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { NewsService } from './news.service';
import { NewsGateway } from './news.gateway';

@Injectable()
export class RabbitMqListener {
    private logger = new Logger(RabbitMqListener.name);
    private connection: Connection;
    private channel: Channel;

    constructor(
        private newsService: NewsService,
        private newsGateway: NewsGateway
    ) {
        this.setupConsumerWithRetry();
    }

    async setupConsumerWithRetry() {
        const maxRetries = 10;
        let attempts = 0;

        while (attempts < maxRetries) {
            try {
                this.connection = await connect('amqp://guest:guest@rabbitmq:5672');
                this.channel = await this.connection.createChannel();
                await this.channel.assertExchange('news_exchange', 'topic', { durable: false });
                await this.channel.assertQueue('news_queue', { durable: false });
                await this.channel.bindQueue('news_queue', 'news_exchange', 'news.items');

                this.channel.consume('news_queue', async (msg) => {
                    if (msg) {
                        try {
                            const newsItem = JSON.parse(msg.content.toString());
                            this.logger.debug('Received news item: ' + JSON.stringify(newsItem));

                            // Store in Redis
                            await this.newsService.addNewsItem(newsItem);

                            // Broadcast to websocket clients
                            this.newsGateway.broadcastNewItem(newsItem);

                            this.channel.ack(msg);
                        } catch (error) {
                            this.logger.error('Error processing message:', error);
                            this.channel.nack(msg);
                        }
                    }
                });

                this.logger.log('RabbitMQ consumer initialized successfully');
                return;
            } catch (err) {
                attempts++;
                this.logger.error(`RabbitMQ connection error (attempt ${attempts}): ${err.message}`);
                if (attempts < maxRetries) {
                    this.logger.log('Retrying in 3 seconds...');
                    await new Promise((res) => setTimeout(res, 3000));
                } else {
                    this.logger.error('Max retries reached. Could not connect to RabbitMQ.');
                }
            }
        }
    }
}