import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

export interface NewsItem {
    title: string;
    content: string;
    category: string;
    timestamp: string;
    keywords: string[];
}

@Injectable()
export class NewsService {
    private redisClient: RedisClientType;
    private readonly NEWS_LIST_KEY = 'latest_news';

    constructor() {
        this.redisClient = createClient({ url: 'redis://redis:6379' });
        this.redisClient.connect();
    }

    async addNewsItem(item: NewsItem) {
        // Push new item to tail of list
        await this.redisClient.rPush(this.NEWS_LIST_KEY, JSON.stringify(item));
        // Trim to last 20
        const length = await this.redisClient.lLen(this.NEWS_LIST_KEY);
        if (length > 20) {
            await this.redisClient.lPop(this.NEWS_LIST_KEY);
        }
    }

    async getNewsItems(): Promise<NewsItem[]> {
        const data = await this.redisClient.lRange(this.NEWS_LIST_KEY, 0, -1);
        return data.map((jsonItem) => JSON.parse(jsonItem));
    }

    async getCategoryCount(): Promise<{ [key: string]: number }> {
        const items = await this.getNewsItems();
        const categoryCount: { [key: string]: number } = {};
        items.forEach((item) => {
            if (!categoryCount[item.category]) {
                categoryCount[item.category] = 0;
            }
            categoryCount[item.category]++;
        });
        return categoryCount;
    }
}
