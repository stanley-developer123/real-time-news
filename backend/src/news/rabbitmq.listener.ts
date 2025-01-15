import { Injectable, Logger } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMqListener {
    private logger = new Logger(RabbitMqListener.name);
    private connection: Connection;
    private channel: Channel;

    constructor() {
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

                this.channel.consume('news_queue', (msg) => {
                    // Handle the message...
                    this.channel.ack(msg);
                });

                this.logger.log('RabbitMQ consumer initialized successfully');
                return; // success, exit the retry loop
            } catch (err) {
                attempts++;
                this.logger.error(`RabbitMQ connection error (attempt ${attempts}): ${err.message}`);
                if (attempts < maxRetries) {
                    this.logger.log('Retrying in 3 seconds...');
                    await new Promise((res) => setTimeout(res, 3000));
                } else {
                    this.logger.error('Max retries reached. Could not connect to RabbitMQ.');
                    // Decide if you want to process.exit(1) or keep the app running in partial mode
                }
            }
        }
    }
}
