import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailService } from './email.service';
import { OpenAIService } from './openai.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EmailService, OpenAIService],
})
export class AppModule {}
