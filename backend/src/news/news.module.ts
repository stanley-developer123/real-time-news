import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { RabbitMqListener } from './rabbitmq.listener';
import { NewsGateway } from './news.gateway';
import { NewsController } from './news.controller';

@Module({
    imports: [],
    providers: [NewsService, RabbitMqListener, NewsGateway],
    controllers: [NewsController],
})
export class NewsModule { }
