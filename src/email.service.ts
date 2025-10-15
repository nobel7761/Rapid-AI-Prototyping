import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { OpenAIService } from './openai.service';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailService.name);
  private readonly subjectLine = 'read emails from this subject line';
  private readonly checkInterval = 10000; // Check every 10 seconds for faster detection
  private intervalId: NodeJS.Timeout | null = null;
  private processedEmails = new Set<string>(); // Track processed email UIDs
  public isMonitoring = false;

  constructor(private readonly openaiService: OpenAIService) {}

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
                  simpleParser(buffer, async (err, parsed) => {
                    try {
                      console.log('\n🔴 DEBUG: Parser callback started!');

                      if (err) {
                        this.logger.error('Error parsing email:', err);
                        return;
                      }

                      console.log('🔴 DEBUG: Email parsed successfully!');

                      // Display email body (prefer text, fallback to html)
                      const body =
                        parsed.text || parsed.html || 'No content available';

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
                      console.log(body);
                      console.log('-'.repeat(80));

                      console.log(
                        '\n🔴 DEBUG: About to start classification...',
                      );
                      console.log(
                        '🔴 DEBUG: OpenAI Service exists?',
                        !!this.openaiService,
                      );
                      console.log(
                        '🔴 DEBUG: OpenAI Service type:',
                        typeof this.openaiService,
                      );

                      // Classify email using OpenAI
                      try {
                        console.log('\n' + '🔍'.repeat(40));
                        console.log('🤖 STEP 1: Starting AI Analysis...');
                        console.log(
                          '📧 Email body length:',
                          body.length,
                          'characters',
                        );
                        console.log('⏳ Sending request to OpenAI...\n');

                        const classification =
                          await this.openaiService.classifyEmail({
                            from: parsed.from?.text || 'Unknown',
                            subject: parsed.subject || 'No Subject',
                            body: body,
                          });

                        console.log('✅ STEP 2: OpenAI Response Received!\n');

                        // BIG PROMINENT RESULT
                        console.log('╔' + '═'.repeat(78) + '╗');
                        console.log('║' + ' '.repeat(78) + '║');

                        const isSystemGenerated =
                          classification.classification === 'system-generated';
                        const resultIcon = isSystemGenerated ? '🤖' : '👤';
                        const resultText =
                          classification.classification.toUpperCase();
                        const resultLabel = isSystemGenerated
                          ? 'SYSTEM-GENERATED EMAIL'
                          : 'HUMAN-GENERATED EMAIL';

                        // Center the text
                        const padding = Math.floor(
                          (78 - resultLabel.length - 2) / 2,
                        );
                        console.log(
                          '║' +
                            ' '.repeat(padding) +
                            resultIcon +
                            ' ' +
                            resultLabel +
                            ' '.repeat(78 - padding - resultLabel.length - 2) +
                            '║',
                        );
                        console.log('║' + ' '.repeat(78) + '║');
                        console.log('╚' + '═'.repeat(78) + '╝');

                        console.log('\n📊 DETAILED CLASSIFICATION RESULTS:');
                        console.log('-'.repeat(80));
                        console.log(`   Type: ${resultText}`);
                        console.log(
                          `   Confidence: ${classification.confidence}% ${classification.confidence >= 80 ? '(High)' : classification.confidence >= 60 ? '(Medium)' : '(Low)'}`,
                        );
                        console.log(
                          `\n   Reasoning: ${classification.reasoning}`,
                        );

                        if (
                          classification.indicators.systemIndicators.length > 0
                        ) {
                          console.log(
                            '\n🤖 System-Generated Indicators Found:',
                          );
                          classification.indicators.systemIndicators.forEach(
                            (indicator, i) => {
                              console.log(`   ${i + 1}. ${indicator}`);
                            },
                          );
                        }

                        if (
                          classification.indicators.humanIndicators.length > 0
                        ) {
                          console.log('\n👤 Human-Generated Indicators Found:');
                          classification.indicators.humanIndicators.forEach(
                            (indicator, i) => {
                              console.log(`   ${i + 1}. ${indicator}`);
                            },
                          );
                        }

                        console.log('\n✅ STEP 3: Classification Complete!\n');
                        console.log('='.repeat(80) + '\n');
                      } catch (classificationError) {
                        console.log('\n❌ ERROR in AI Classification Process!');
                        console.log('-'.repeat(80));
                        console.log(
                          '🔴 DEBUG: Error details:',
                          classificationError,
                        );
                        this.logger.error(
                          'Error classifying email:',
                          (classificationError as Error).message,
                        );
                        this.logger.error(
                          'Error stack:',
                          (classificationError as Error).stack,
                        );
                        console.log(
                          '💥 Email classification failed - see logs above for details',
                        );
                        console.log('='.repeat(80) + '\n');
                      }
                    } catch (outerError) {
                      console.log(
                        '\n❌❌❌ CRITICAL ERROR in email parser callback!',
                      );
                      console.log('Error:', outerError);
                      this.logger.error(
                        'Critical error in parser:',
                        outerError,
                      );
                    }
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
