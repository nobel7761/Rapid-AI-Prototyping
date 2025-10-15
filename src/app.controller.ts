import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './email.service';
import { OpenAIService } from './openai.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
    private readonly openaiService: OpenAIService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('read-emails')
  async readEmails(): Promise<{ message: string }> {
    const subjectLine = 'read emails from this subject line';

    try {
      await this.emailService.readEmailsBySubject(subjectLine, true); // true = manual check
      return {
        message: `Successfully processed emails with subject: "${subjectLine}"`,
      };
    } catch (error) {
      return { message: `Error reading emails: ${(error as Error).message}` };
    }
  }

  @Post('start-monitoring')
  startMonitoring(): { message: string } {
    this.emailService.startEmailMonitoring();
    return { message: 'Email monitoring started' };
  }

  @Post('stop-monitoring')
  stopMonitoring(): { message: string } {
    this.emailService.stopEmailMonitoring();
    return { message: 'Email monitoring stopped' };
  }

  @Get('monitoring-status')
  getMonitoringStatus(): { message: string; isMonitoring: boolean } {
    return {
      message: 'Email monitoring status',
      isMonitoring: this.emailService.isMonitoring,
    };
  }

  @Post('test-sound')
  testSound(): { message: string } {
    this.emailService.testNotificationSound();
    return { message: 'Test notification sound triggered' };
  }

  @Post('test-openai')
  async testOpenAI(
    @Body() body: { from?: string; subject?: string; body?: string },
  ): Promise<any> {
    try {
      // Test connection first
      const connectionTest = await this.openaiService.testConnection();

      if (!connectionTest) {
        return {
          success: false,
          message: 'OpenAI connection test failed',
        };
      }

      // If email data is provided, classify it
      if (body.from || body.subject || body.body) {
        const classification = await this.openaiService.classifyEmail({
          from: body.from || 'test@example.com',
          subject: body.subject || 'Test Subject',
          body: body.body || 'This is a test email body.',
        });

        return {
          success: true,
          message: 'OpenAI test successful',
          classification,
        };
      }

      // Otherwise just return connection success
      return {
        success: true,
        message: 'OpenAI connection test successful',
      };
    } catch (error) {
      return {
        success: false,
        message: `OpenAI test failed: ${(error as Error).message}`,
      };
    }
  }
}
