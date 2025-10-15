import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';

export interface EmailClassification {
  classification: 'system-generated' | 'human-generated';
  confidence: number; // 0-100
  reasoning: string;
  indicators: {
    systemIndicators: string[];
    humanIndicators: string[];
  };
}

@Injectable()
export class OpenAIService implements OnModuleInit {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  onModuleInit() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      this.logger.error('OPENAI_API_KEY not found in environment variables');
      throw new Error('OPENAI_API_KEY is required');
    }

    this.logger.log(`OpenAI API Key found: Yes`);
    this.logger.log(`API Key length: ${apiKey.length}`);

    this.openai = new OpenAI({
      apiKey: apiKey,
    });

    this.logger.log('OpenAI Service initialized successfully');
  }

  async classifyEmail(emailData: {
    from: string;
    subject: string;
    body: string;
  }): Promise<EmailClassification> {
    try {
      console.log('   📤 OpenAI Service: Preparing prompt for analysis...');
      this.logger.log('Analyzing email with OpenAI...');

      const prompt = `Analyze the following email and determine if it is SYSTEM-GENERATED (automated, from a bot/service) or HUMAN-GENERATED (written by a real person).

Email Details:
From: ${emailData.from}
Subject: ${emailData.subject}

Body:
${emailData.body}

Please provide:
1. Classification (system-generated or human-generated)
2. Confidence level (0-100)
3. Detailed reasoning
4. Specific indicators that led to this classification

Respond in JSON format:
{
  "classification": "system-generated" or "human-generated",
  "confidence": number (0-100),
  "reasoning": "detailed explanation",
  "indicators": {
    "systemIndicators": ["indicator1", "indicator2", ...],
    "humanIndicators": ["indicator1", "indicator2", ...]
  }
}`;

      console.log('   🚀 OpenAI Service: Sending request to GPT-4o-mini...');

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert email analyst specializing in distinguishing between automated/system-generated emails and human-written emails. Analyze emails carefully and provide detailed, accurate classifications.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent results
        response_format: { type: 'json_object' },
      });

      console.log('   📥 OpenAI Service: Response received successfully!');

      const result = response.choices[0]?.message?.content;

      if (!result) {
        throw new Error('No response from OpenAI');
      }

      console.log('   🔍 OpenAI Service: Parsing classification result...');

      const classification = JSON.parse(result) as EmailClassification;

      console.log(
        `   ✅ OpenAI Service: Classification = ${classification.classification.toUpperCase()}`,
      );
      this.logger.log(`Classification: ${classification.classification}`);
      this.logger.log(`Confidence: ${classification.confidence}%`);

      return classification;
    } catch (error) {
      this.logger.error(
        'Error classifying email with OpenAI:',
        (error as Error).message,
      );
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      this.logger.log('Testing OpenAI connection...');

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "Hello"' }],
        max_tokens: 10,
      });

      const hasResponse = !!response.choices[0]?.message?.content;

      if (hasResponse) {
        this.logger.log('OpenAI connection test successful!');
      } else {
        this.logger.error('OpenAI connection test failed - no response');
      }

      return hasResponse;
    } catch (error) {
      this.logger.error(
        'OpenAI connection test failed:',
        (error as Error).message,
      );
      return false;
    }
  }
}
