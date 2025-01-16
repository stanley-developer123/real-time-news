import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { NewsItem } from 'src/types';



@Injectable()
export class NewsService {
    private redisClient: RedisClientType;
    private readonly NEWS_LIST_KEY = 'latest_news';
    private readonly logger = new Logger(NewsService.name);

    constructor() {
        this.redisClient = createClient({
            url: 'redis://redis:6379',
            socket: {
                reconnectStrategy: (retries) => {
                    this.logger.log(`Attempting to reconnect to Redis (attempt ${retries})`);
                    return Math.min(retries * 50, 2000);
                }
            }
        });

        this.redisClient.connect().catch(err => {
            this.logger.error(`Failed to connect to Redis: ${err.message}`);
        });

        // Log when connection is successful
        this.redisClient.on('connect', () => {
            this.logger.log('Successfully connected to Redis');
        });
    }

    async addNewsItem(item: NewsItem) {
        try {
            const stringifiedItem = JSON.stringify(item);
            this.logger.debug(`Attempting to add news item: ${stringifiedItem}`);

            // Push new item to tail of list
            await this.redisClient.rPush(this.NEWS_LIST_KEY, stringifiedItem);

            // Trim to last 20
            const length = await this.redisClient.lLen(this.NEWS_LIST_KEY);
            this.logger.debug(`Current list length: ${length}`);

            if (length > 20) {
                const removedItem = await this.redisClient.lPop(this.NEWS_LIST_KEY);
                this.logger.debug(`Removed oldest item: ${removedItem}`);
            }
        } catch (error) {
            this.logger.error(`Error adding news item: ${error.message}`);
            throw error;
        }
    }

    async getNewsItems(): Promise<NewsItem[]> {
        try {
            const data = await this.redisClient.lRange(this.NEWS_LIST_KEY, 0, -1);
            this.logger.debug(`Retrieved ${data.length} items from Redis`);

            return data.map((jsonItem, index) => {
                try {
                    if (!jsonItem) {
                        this.logger.warn(`Empty item found at index ${index}`);
                        return null;
                    }

                    this.logger.debug(`Parsing item at index ${index}: ${jsonItem}`);
                    return JSON.parse(jsonItem);
                } catch (parseError) {
                    this.logger.error(`Failed to parse item at index ${index}: ${parseError.message}`);
                    this.logger.error(`Problematic JSON string: ${jsonItem}`);
                    return null;
                }
            }).filter(item => item !== null); // Remove any null items
        } catch (error) {
            this.logger.error(`Error retrieving news items: ${error.message}`);
            throw error;
        }
    }

    async getCategoryCount(): Promise<{ [key: string]: number }> {
        try {
            const items = await this.getNewsItems();
            this.logger.debug(`Processing ${items.length} items for category count`);

            const categoryCount: { [key: string]: number } = {};
            items.forEach((item) => {
                if (!item.category) {
                    this.logger.warn(`Item found without category: ${JSON.stringify(item)}`);
                    return;
                }

                if (!categoryCount[item.category]) {
                    categoryCount[item.category] = 0;
                }
                categoryCount[item.category]++;
            });

            this.logger.debug(`Category count results: ${JSON.stringify(categoryCount)}`);
            return categoryCount;
        } catch (error) {
            this.logger.error(`Error counting categories: ${error.message}`);
            throw error;
        }
    }
}