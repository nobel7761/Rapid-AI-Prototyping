import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import Imap from 'imap';
import { simpleParser } from 'mailparser';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailService.name);
  private readonly subjectLine = 'read emails from this subject line';
  private readonly checkInterval = 10000; // Check every 10 seconds for faster detection
  private intervalId: NodeJS.Timeout | null = null;
  private processedEmails = new Set<string>(); // Track processed email UIDs
  public isMonitoring = false;

  onModuleInit() {
    this.logger.log(
      'EmailService initialized - starting continuous email monitoring',
    );
    this.startEmailMonitoring();
  }

  onModuleDestroy() {
    this.logger.log('EmailService shutting down - stopping email monitoring');
    this.stopEmailMonitoring();
  }

  startEmailMonitoring() {
    if (this.isMonitoring) {
      this.logger.warn('Email monitoring is already running');
      return;
    }

    this.isMonitoring = true;
    this.logger.log(
      `Starting continuous email monitoring for subject: "${this.subjectLine}"`,
    );
    this.logger.log(
      `Checking for new emails every ${this.checkInterval / 1000} seconds (faster detection)`,
    );

    // Initial check
    void this.checkForNewEmails();

    // Set up interval for continuous checking
    this.intervalId = setInterval(() => {
      void this.checkForNewEmails();
    }, this.checkInterval);
  }

  stopEmailMonitoring() {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.logger.log('Email monitoring stopped');
  }

  private async checkForNewEmails(): Promise<void> {
    try {
      await this.readEmailsBySubject(this.subjectLine);
    } catch (error) {
      this.logger.error('Error during email check:', (error as Error).message);
    }
  }

  private playNotificationSound(): void {
    this.logger.log('🔔 Playing notification sound for new email!');

    // Play beep sound 10 times with 2-second intervals
    let beepCount = 0;
    const maxBeeps = 10;
    const beepInterval = 2000; // 2 seconds

    const playBeep = () => {
      if (beepCount < maxBeeps) {
        // Use multiple sound methods for better reliability
        const { exec } = require('child_process');

        // Method 1: Console beep
        process.stdout.write('\x07');

        // Method 2: macOS system sound (most reliable on Mac)
        exec('afplay /System/Library/Sounds/Ping.aiff', (error) => {
          if (error) {
            // Method 3: Alternative macOS sound
            exec('afplay /System/Library/Sounds/Glass.aiff', (error2) => {
              if (error2) {
                // Method 4: Windows beep
                exec(
                  'powershell.exe -c "[console]::beep(800,200)"',
                  (error3) => {
                    if (error3) {
                      // Method 5: Linux beep
                      exec('beep', (error4) => {
                        if (error4) {
                          // Final fallback: visual notification
                          console.log('🔔 BEEP! New email detected!');
                          console.log('🔔 BEEP! New email detected!');
                          console.log('🔔 BEEP! New email detected!');
                        }
                      });
                    }
                  },
                );
              }
            });
          }
        });

        beepCount++;
        setTimeout(playBeep, beepInterval);
      } else {
        this.logger.log('🔔 Notification sound sequence completed!');
      }
    };

    playBeep();
  }

  testNotificationSound(): void {
    this.logger.log('🧪 Testing notification sound...');
    this.playNotificationSound();
  }

  async readEmailsBySubject(
    subjectLine: string,
    isManualCheck: boolean = false,
  ): Promise<void> {
    // Email configuration - you'll need to update these with your email provider details
    const config = {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      password: process.env.EMAIL_PASSWORD || 'your-app-password',
      host: process.env.EMAIL_HOST || 'imap.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '993'),
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    };

    return new Promise((resolve, reject) => {
      const imap = new Imap(config);

      imap.once('ready', () => {
        this.logger.log('Connected to email server');

        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            this.logger.error('Error opening inbox:', err);
            reject(err);
            return;
          }

          this.logger.log(
            `Inbox opened. Total messages: ${box.messages.total}`,
          );

          // Search for emails with the specific subject line
          const searchCriteria = ['UNSEEN', ['SUBJECT', subjectLine]];

          imap.search(searchCriteria, (err, results) => {
            if (err) {
              this.logger.error('Error searching emails:', err);
              reject(err);
              return;
            }

            if (!results || results.length === 0) {
              this.logger.log(
                `No new emails found with subject: "${subjectLine}"`,
              );
              imap.end();
              resolve();
              return;
            }

            // Filter out already processed emails
            const newEmails = results.filter(
              (uid) => !this.processedEmails.has(uid.toString()),
            );

            if (newEmails.length === 0) {
              this.logger.log(
                `No new unprocessed emails found with subject: "${subjectLine}"`,
              );

              // Play test sound for manual checks even when no emails found
              if (isManualCheck) {
                this.logger.log('🔔 Playing test sound for manual check...');
                this.playNotificationSound();
              }

              imap.end();
              resolve();
              return;
            }

            this.logger.log(
              `Found ${newEmails.length} new emails with subject: "${subjectLine}"`,
            );

            // Play notification sound for each new email found
            for (let i = 0; i < newEmails.length; i++) {
              this.playNotificationSound();
            }

            // Fetch the emails
            const fetch = imap.fetch(newEmails, { bodies: '' });
            let emailCount = 0;

            fetch.on('message', (msg, seqno) => {
              emailCount++;
              this.logger.log(
                `Processing email ${emailCount}/${newEmails.length}`,
              );

              let buffer = '';

              msg.on('body', (stream, info) => {
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });

                stream.once('end', () => {
                  // Parse the email
                  simpleParser(buffer, (err, parsed) => {
                    if (err) {
                      this.logger.error('Error parsing email:', err);
                      return;
                    }

                    // Log email details to console
                    console.log('\n' + '='.repeat(80));
                    console.log(`EMAIL #${emailCount}`);
                    console.log('='.repeat(80));
                    console.log(`From: ${parsed.from?.text || 'Unknown'}`);
                    console.log(`To: ${parsed.to?.text || 'Unknown'}`);
                    console.log(`Subject: ${parsed.subject || 'No Subject'}`);
                    console.log(`Date: ${parsed.date || 'Unknown Date'}`);
                    console.log('-'.repeat(80));
                    console.log('BODY:');
                    console.log('-'.repeat(80));

                    // Display email body (prefer text, fallback to html)
                    const body =
                      parsed.text || parsed.html || 'No content available';
                    console.log(body);
                    console.log('='.repeat(80) + '\n');
                  });
                });
              });

              msg.once('attributes', (attrs) => {
                // Track this email as processed
                this.processedEmails.add(attrs.uid.toString());

                // Mark email as read (optional)
                // imap.addFlags(attrs.uid, '\\Seen', (err) => {
                //   if (err) this.logger.error('Error marking email as read:', err);
                // });
              });

              msg.once('end', () => {
                // Email processing completed
              });
            });

            fetch.once('error', (err) => {
              this.logger.error('Fetch error:', err);
              reject(err);
            });

            fetch.once('end', () => {
              this.logger.log(`Finished processing ${emailCount} emails`);
              imap.end();
              resolve();
            });
          });
        });
      });

      imap.once('error', (err) => {
        this.logger.error('IMAP connection error:', err);
        reject(err);
      });

      imap.once('end', () => {
        this.logger.log('IMAP connection ended');
      });

      imap.connect();
    });
  }
}
