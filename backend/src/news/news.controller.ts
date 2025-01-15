import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { NewsService, NewsItem } from './news.service';

@ApiTags('news')
@Controller('api/news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    @Get()
    @ApiResponse({ status: 200, description: 'Fetch all news items' })
    async getNews(): Promise<NewsItem[]> {
        return await this.newsService.getNewsItems();
    }

    @Get('stats')
    @ApiResponse({ status: 200, description: 'Fetch news count by category' })
    async getNewsStats() {
        return await this.newsService.getCategoryCount();
    }
}
