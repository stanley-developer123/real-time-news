import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { NewsGateway } from './news/news.gateway';

@Module({
  imports: [NewsModule],
  providers: [NewsGateway],
})
export class AppModule {}
