import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './email.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
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
}
