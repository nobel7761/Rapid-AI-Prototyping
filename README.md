# 🤖 AI-Powered Email Classifier

> An intelligent email monitoring system that automatically classifies incoming emails as **system-generated** or **human-generated** using OpenAI's GPT-4o-mini.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![IMAP](https://img.shields.io/badge/IMAP-0078D4?style=for-the-badge&logo=microsoft-outlook&logoColor=white)](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)

---

## 📖 Project Overview

### **The Challenge**

In today's digital world, we receive countless emails daily - some from automated systems (notifications, alerts, newsletters) and others from real people. Distinguishing between these two types manually is time-consuming and inefficient.

### **The Solution**

This project combines **email monitoring technology** with **artificial intelligence** to automatically:

- ✅ Monitor specific email inbox in real-time
- ✅ Fetch emails with designated subject lines
- ✅ Analyze email content using OpenAI's GPT-4o-mini
- ✅ Classify emails as system-generated or human-generated
- ✅ Provide detailed reasoning and confidence scores
- ✅ Display results in a beautiful, easy-to-read format

### **Why This Matters**

- 🎯 **Email Filtering**: Automatically route emails based on their origin
- 🔍 **Spam Detection**: Identify automated vs. personal communication
- 📊 **Analytics**: Track ratio of human vs. automated emails
- 🚀 **Automation**: Integrate with workflows to handle emails differently
- 💼 **Business Intelligence**: Understand communication patterns

---

## ✨ Key Features

### 🔄 **Continuous Email Monitoring**

- Monitors inbox every 10 seconds for new emails
- Searches for emails with specific subject line: `"read emails from this subject line"`
- Prevents duplicate processing using intelligent tracking
- Handles UNSEEN emails only

### 🤖 **AI-Powered Classification**

- Uses OpenAI's GPT-4o-mini model for analysis
- Provides classification: `SYSTEM-GENERATED` or `HUMAN-GENERATED`
- Includes confidence score (0-100%)
- Detailed reasoning for each classification
- Lists specific indicators that influenced the decision

### 🔔 **Real-Time Notifications**

- Audio alerts when new emails arrive
- Plays beep sound 10 times with 2-second intervals
- Cross-platform support (macOS, Windows, Linux)

### 📊 **Beautiful Console Output**

- Color-coded and emoji-rich display
- Step-by-step analysis visualization
- Fancy box design for classification results
- Clear breakdown of indicators

### 🌐 **RESTful API**

- Test OpenAI connection
- Manual email checks
- Start/Stop monitoring
- Check monitoring status
- Test notification sounds

### 🔐 **Multi-Provider Support**

- Gmail (with App Password)
- Outlook/Office 365
- Yahoo Mail
- Any IMAP-compatible email service

---

## 🛠️ Technology Stack

| Technology     | Purpose                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| **NestJS**     | Modern Node.js framework for building scalable server-side applications |
| **TypeScript** | Type-safe JavaScript for better code quality and developer experience   |
| **OpenAI API** | GPT-4o-mini model for intelligent email content analysis                |
| **IMAP**       | Internet Message Access Protocol for email retrieval                    |
| **Mailparser** | Email parsing library to extract structured data from raw emails        |
| **Dotenv**     | Environment variable management for secure configuration                |

---

## 📋 What I Built - Step by Step

### **Phase 1: Project Setup & Architecture** 🏗️

**Step 1: Initialize NestJS Application**

- Created a new NestJS project with TypeScript
- Set up project structure with modular architecture
- Configured build tools and development environment

**Step 2: Installed Required Dependencies**

```bash
npm install openai imap mailparser dotenv
npm install --save-dev @types/imap
```

**Step 3: Created Service Architecture**

- **AppModule**: Main application module with dependency injection
- **AppController**: HTTP endpoints for API interactions
- **AppService**: Basic application service
- **EmailService**: Email monitoring and IMAP integration
- **OpenAIService**: AI classification logic

---

### **Phase 2: Email Integration** 📧

**Step 4: Built Email Service**

- Implemented IMAP connection using environment variables
- Created email search functionality with filters:
  - UNSEEN emails only
  - Specific subject line matching
- Developed email parsing using mailparser library
- Added duplicate prevention using Set data structure

**Step 5: Implemented Continuous Monitoring**

- Used `OnModuleInit` lifecycle hook for auto-start
- Set up interval-based checking (every 10 seconds)
- Implemented graceful error handling
- Added `OnModuleDestroy` for cleanup

**Step 6: Added Notification System**

- Created multi-platform audio notification
- Plays macOS system sounds (Ping.aiff)
- Falls back to Windows, Linux, and console beeps
- Configurable beep count and intervals

---

### **Phase 3: AI Integration** 🧠

**Step 7: Set Up OpenAI Service**

- Integrated OpenAI SDK
- Created initialization with API key validation
- Implemented connection testing endpoint

**Step 8: Designed Classification Logic**

- Built detailed prompt engineering for email analysis
- Configured GPT-4o-mini with optimal parameters:
  - Temperature: 0.3 (for consistent results)
  - Response format: JSON object
  - System role: Expert email analyst

**Step 9: Created Classification Interface**

```typescript
interface EmailClassification {
  classification: 'system-generated' | 'human-generated';
  confidence: number; // 0-100
  reasoning: string;
  indicators: {
    systemIndicators: string[];
    humanIndicators: string[];
  };
}
```

---

### **Phase 4: Integration & Output Design** 🎨

**Step 10: Connected Email Service with OpenAI**

- Injected OpenAIService into EmailService via dependency injection
- Modified email parser to call classification after parsing
- Implemented async/await pattern for API calls
- Added comprehensive error handling with try-catch blocks

**Step 11: Designed Beautiful Output**

- Created step-by-step visualization:
  - 🔍 STEP 1: Starting AI Analysis
  - ✅ STEP 2: OpenAI Response Received
  - ✅ STEP 3: Classification Complete
- Built fancy box display for results using Unicode characters
- Added emoji indicators (🤖 for system, 👤 for human)
- Implemented confidence level labels (High/Medium/Low)

**Step 12: Added Debug Logging**

- Inserted debug checkpoints for troubleshooting
- Added service injection verification
- Implemented detailed error messages with stack traces

---

### **Phase 5: API & Configuration** ⚙️

**Step 13: Built RESTful Endpoints**

- `GET /` - Health check
- `POST /read-emails` - Manual email check
- `POST /start-monitoring` - Start monitoring
- `POST /stop-monitoring` - Stop monitoring
- `GET /monitoring-status` - Check status
- `POST /test-sound` - Test notifications
- `POST /test-openai` - Test AI connection

**Step 14: Environment Configuration**

- Created `.env.example` template
- Documented configuration for multiple email providers
- Added security notes for App Passwords
- Implemented validation for required environment variables

---

## 🚀 Installation & Setup

### **Prerequisites**

- Node.js (v18 or higher)
- npm or yarn package manager
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Email account with IMAP enabled

### **Step 1: Clone or Download**

```bash
cd your-project-directory
```

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Configure Environment**

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email Configuration (Gmail Example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993

# Server Configuration (Optional)
PORT=3000
```

### **Step 4: Email Provider Setup**

#### **Gmail**

1. Enable 2-Factor Authentication in your Google Account
2. Go to Google Account → Security → App Passwords
3. Generate a new App Password
4. Use this password in `EMAIL_PASSWORD`

#### **Outlook**

```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_HOST=outlook.office365.com
EMAIL_PORT=993
```

#### **Yahoo**

```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=imap.mail.yahoo.com
EMAIL_PORT=993
```

### **Step 5: Build the Application**

```bash
npm run build
```

### **Step 6: Start the Server**

```bash
# Development mode with auto-reload
npm run start:dev

# Production mode
npm run start:prod

# Standard mode
npm start
```

---

## 📱 Usage Guide

### **Automatic Monitoring**

The application automatically starts monitoring when launched:

1. Connects to your email server
2. Checks for new emails every 10 seconds
3. Plays notification sound when emails arrive
4. Classifies each email using AI
5. Displays results in console

### **Manual Triggers via API**

**Test OpenAI Connection:**

```bash
curl -X POST http://localhost:3000/test-openai
```

**Manually Check Emails:**

```bash
curl -X POST http://localhost:3000/read-emails
```

**Control Monitoring:**

```bash
# Start monitoring
curl -X POST http://localhost:3000/start-monitoring

# Stop monitoring
curl -X POST http://localhost:3000/stop-monitoring

# Check status
curl -X GET http://localhost:3000/monitoring-status
```

**Test with Sample Email:**

```bash
curl -X POST http://localhost:3000/test-openai \
  -H "Content-Type: application/json" \
  -d '{
    "from": "john@example.com",
    "subject": "Quick question",
    "body": "Hey! Just wanted to check if you are free for coffee this weekend?"
  }'
```

---

## 🎨 Sample Output

When an email is received and classified, you'll see:

```
================================================================================
EMAIL #1
================================================================================
From: "Habibur Nobel" <habibur@example.com>
To: nobel@memberlounge.app
Subject: read emails from this subject line
Date: Wed Oct 15 2025 21:14:22 GMT+0600 (Bangladesh Standard Time)
--------------------------------------------------------------------------------
BODY:
--------------------------------------------------------------------------------
hello nobel! this is human generated email
--------------------------------------------------------------------------------

🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍
🤖 STEP 1: Starting AI Analysis...
📧 Email body length: 42 characters
⏳ Sending request to OpenAI...

   📤 OpenAI Service: Preparing prompt for analysis...
   🚀 OpenAI Service: Sending request to GPT-4o-mini...
   📥 OpenAI Service: Response received successfully!
   🔍 OpenAI Service: Parsing classification result...
   ✅ OpenAI Service: Classification = HUMAN-GENERATED

✅ STEP 2: OpenAI Response Received!

╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                        👤 HUMAN-GENERATED EMAIL                              ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 DETAILED CLASSIFICATION RESULTS:
--------------------------------------------------------------------------------
   Type: HUMAN-GENERATED
   Confidence: 92% (High)

   Reasoning: The email exhibits clear characteristics of human communication
   including personal greeting, informal casual tone, and direct personal address.
   The message lacks any template structure or automated formatting typically
   seen in system-generated emails.

👤 Human-Generated Indicators Found:
   1. Personal greeting with name ("hello nobel!")
   2. Casual and informal language style
   3. Lowercase writing style suggesting casual human input
   4. Direct personal communication tone
   5. No template or automated structure

✅ STEP 3: Classification Complete!

================================================================================
```

---

## 🔄 Complete Application Flow

### **PART 1: APPLICATION STARTUP**

**Step 1: Server Initialization**

- Loads `.env` file to read all configuration
- Creates a NestJS web server instance
- Starts listening on port 3000 (or configured PORT)

**Step 2: Dependency Injection Setup**
NestJS creates service instances in dependency order:

1. **OpenAIService** (no dependencies) ← Created first
2. **EmailService** (depends on OpenAIService) ← Created second
3. **AppController** (depends on all services) ← Created last

**Step 3: Service Initialization**

_OpenAIService.onModuleInit():_

- Validates `OPENAI_API_KEY` exists in environment
- Throws error if missing (prevents startup)
- Creates OpenAI client instance
- Logs initialization success with API key length

_EmailService.onModuleInit():_

- Receives OpenAIService via constructor injection
- Calls `startEmailMonitoring()` automatically
- Sets `isMonitoring` flag to `true`
- Executes immediate first email check
- Starts interval timer for every 10 seconds

---

### **PART 2: CONTINUOUS EMAIL MONITORING**

**Step 4: The Monitoring Loop**
Every 10 seconds:

- Triggers `checkForNewEmails()` method
- Wrapped in try-catch for error resilience
- Logs errors but continues monitoring
- Never stops unless explicitly commanded

**Step 5: IMAP Connection**
For each check:

- Creates new IMAP instance with credentials
- Connects to email server (Gmail, Outlook, etc.)
- Opens INBOX folder (read-only mode)
- Logs connection success and total message count

**Step 6: Email Search & Filter**

- Searches using criteria: `['UNSEEN', ['SUBJECT', 'read emails from this subject line']]`
- Retrieves array of matching email UIDs
- Filters out already-processed emails (using Set)
- Logs count of new unprocessed emails
- If zero new emails → disconnects and waits
- If new emails found → proceeds to notification

---

### **PART 3: NOTIFICATION & FETCHING**

**Step 7: Audio Notification**
For each new email:

- Calls `playNotificationSound()` function
- Plays beep 10 times with 2-second intervals
- Attempts multiple audio methods:
  1. macOS: `afplay /System/Library/Sounds/Ping.aiff`
  2. macOS fallback: `afplay /System/Library/Sounds/Glass.aiff`
  3. Windows: PowerShell console beep
  4. Linux: `beep` command
  5. Final fallback: Visual console messages

**Step 8: Email Data Retrieval**

- Fetches email bodies from IMAP server
- Streams data in chunks to buffer
- Accumulates all chunks into complete email
- When stream ends → triggers parsing

---

### **PART 4: EMAIL PARSING**

**Step 9: Email Parsing**
Uses `simpleParser` from mailparser:

- Converts raw email buffer to structured object
- Extracts metadata: from, to, subject, date
- Extracts body: prefers `text`, falls back to `html`
- Handles attachments (ignored in current implementation)

**Step 10: Console Display**
Outputs to terminal:

- Separator line (80 equals signs)
- Email number counter
- From address with full name and email
- To address
- Subject line
- Date with timezone
- Email body content (plain text or HTML)

---

### **PART 5: AI CLASSIFICATION (THE MAGIC)**

**Step 11: Preparation**

- Logs debug information (service availability)
- Logs "🔍 STEP 1: Starting AI Analysis..."
- Shows email body character length
- Logs "⏳ Sending request to OpenAI..."

**Step 12: OpenAI API Call**
Inside `openaiService.classifyEmail()`:

- Constructs detailed analysis prompt
- Includes email from, subject, and body
- Sends to `gpt-4o-mini` model
- Uses temperature 0.3 for consistency
- Enforces JSON response format
- Logs each sub-step:
  - 📤 Preparing prompt
  - 🚀 Sending request
  - 📥 Response received
  - 🔍 Parsing result

**Step 13: Response Processing**

- Extracts JSON content from API response
- Parses into `EmailClassification` interface
- Validates required fields
- Logs classification type in console

**Step 14: Beautiful Result Display**

_Shows "✅ STEP 2: OpenAI Response Received!"_

_Draws fancy box:_

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        🤖/👤 CLASSIFICATION RESULT                           ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

_Detailed breakdown:_

- Classification type (SYSTEM-GENERATED or HUMAN-GENERATED)
- Confidence percentage with label:
  - 80-100%: (High)
  - 60-79%: (Medium)
  - 0-59%: (Low)
- AI's reasoning paragraph
- System-Generated Indicators (if any)
- Human-Generated Indicators (if any)

_Completes with "✅ STEP 3: Classification Complete!"_

---

### **PART 6: CLEANUP & CONTINUATION**

**Step 15: Mark as Processed**

- Adds email UID to `processedEmails` Set
- Ensures no duplicate processing
- Persists in memory for session duration

**Step 16: Connection Cleanup**

- Logs "Finished processing X emails"
- Closes IMAP connection gracefully
- Logs "IMAP connection ended"

**Step 17: Wait & Repeat**

- Interval timer waits 10 seconds
- Loop returns to Step 4
- Cycle continues indefinitely

---

### **PART 7: API ENDPOINTS**

Available HTTP endpoints:

| Method | Endpoint             | Description                | Response                                    |
| ------ | -------------------- | -------------------------- | ------------------------------------------- |
| GET    | `/`                  | Health check               | "Hello World!"                              |
| POST   | `/read-emails`       | Trigger manual email check | Success/Error message                       |
| POST   | `/start-monitoring`  | Start automatic monitoring | Confirmation message                        |
| POST   | `/stop-monitoring`   | Stop automatic monitoring  | Confirmation message                        |
| GET    | `/monitoring-status` | Check if monitoring active | Boolean status                              |
| POST   | `/test-sound`        | Test notification sound    | Triggers 10 beeps                           |
| POST   | `/test-openai`       | Test AI connection         | Connection status + optional classification |

---

## 🔧 Customization

### **Change Subject Line**

Modify in `src/email.service.ts`:

```typescript
private readonly subjectLine = 'your custom subject line';
```

### **Adjust Monitoring Interval**

Modify in `src/email.service.ts`:

```typescript
private readonly checkInterval = 10000; // milliseconds (10 seconds)
```

### **Change AI Model**

Modify in `src/openai.service.ts`:

```typescript
model: 'gpt-4o-mini', // or 'gpt-4', 'gpt-3.5-turbo', etc.
```

### **Adjust AI Temperature**

Modify in `src/openai.service.ts`:

```typescript
temperature: 0.3, // 0.0-2.0 (lower = more consistent)
```

---

## 🔒 Security Best Practices

### **Environment Variables**

- ✅ Never commit `.env` file to version control
- ✅ Use `.gitignore` to exclude `.env`
- ✅ Store sensitive keys in secure vault in production
- ✅ Rotate API keys periodically

### **Email Security**

- ✅ Use App Passwords for Gmail/Yahoo (not main password)
- ✅ Enable 2-Factor Authentication on email account
- ✅ Use read-only IMAP access when possible
- ✅ Monitor for unusual login activity

### **API Security**

- ✅ Set spending limits on OpenAI account
- ✅ Monitor API usage and costs
- ✅ Use environment-specific API keys
- ✅ Implement rate limiting in production

### **Application Security**

- ✅ Run with minimal required permissions
- ✅ Keep dependencies updated (`npm audit`)
- ✅ Use HTTPS in production
- ✅ Implement authentication for API endpoints

---

## 🐛 Troubleshooting

### **Common Issues**

**1. Authentication Failed**

- ✅ Verify email credentials in `.env`
- ✅ Ensure using App Password (not main password) for Gmail/Yahoo
- ✅ Check if IMAP is enabled in email settings
- ✅ Test credentials in email client first

**2. OpenAI API Errors**

- ✅ Verify API key is correct
- ✅ Check OpenAI account has sufficient credits
- ✅ Ensure API key has proper permissions
- ✅ Check OpenAI service status

**3. Port Already in Use (EADDRINUSE)**

```bash
# Find process on port 3000
lsof -i:3000

# Kill the process
lsof -ti:3000 | xargs kill -9
```

**4. No Emails Found**

- ✅ Ensure emails are UNSEEN (unread)
- ✅ Verify exact subject line match
- ✅ Check IMAP folder (should be INBOX)
- ✅ Send test email to yourself

**5. AI Classification Not Running**

- ✅ Check debug logs for service injection
- ✅ Verify OpenAI service initialized
- ✅ Look for error messages in console
- ✅ Restart server to refresh code

**6. Notification Sound Not Playing**

- ✅ Verify system sound settings
- ✅ Check terminal has audio permissions
- ✅ Look for fallback console messages
- ✅ Test with `/test-sound` endpoint

---

## 📊 Performance & Costs

### **Email Processing**

- Processing time: ~2-5 seconds per email
- Network latency: Depends on email server
- Memory usage: ~50-100MB base + email content

### **OpenAI API Costs**

- Model: GPT-4o-mini
- Input tokens: ~150-300 per email (depends on length)
- Output tokens: ~100-200 per response
- Cost: ~$0.0001-0.0005 per email (very economical)

### **Recommended Limits**

- Max emails per check: 10-20 (to avoid rate limits)
- Check interval: 10-30 seconds (balance freshness vs. load)
- Email body limit: 5000 characters (to control costs)

---

## 🚀 Future Enhancements

### **Potential Features**

- [ ] Database storage for classification history
- [ ] Web dashboard for visualization
- [ ] Email reply automation based on classification
- [ ] Multiple subject line monitoring
- [ ] Sentiment analysis integration
- [ ] Email categorization (beyond system/human)
- [ ] Webhook notifications
- [ ] Slack/Discord integration
- [ ] Machine learning model fine-tuning
- [ ] Multi-account support

### **Code Improvements**

- [ ] Unit tests and e2e tests
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Error retry logic with exponential backoff
- [ ] Rate limiting implementation
- [ ] Logging to file system
- [ ] Health check endpoint

---

## 📚 Learning Resources

### **Technologies Used**

- [NestJS Documentation](https://docs.nestjs.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [IMAP Protocol](https://datatracker.ietf.org/doc/html/rfc3501)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Related Topics**

- Prompt Engineering for GPT models
- Email authentication (IMAP, OAuth2)
- Dependency Injection patterns
- Async/Await in Node.js
- REST API design

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - feel free to use it for personal or commercial projects.

---

## 👨‍💻 Author

**Habibur Nobel**

- Email: nobel@memberlounge.app
- Built with ❤️ using NestJS, TypeScript, and OpenAI

---

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4o-mini API
- **NestJS** team for the excellent framework
- **IMAP** protocol developers
- **Mailparser** library contributors

---

## 💡 Key Takeaways

### **What This Project Demonstrates**

1. ✅ Integration of AI APIs in real-world applications
2. ✅ Email protocol handling (IMAP)
3. ✅ Asynchronous JavaScript programming
4. ✅ Dependency injection and modular architecture
5. ✅ Environment-based configuration
6. ✅ Error handling and resilience
7. ✅ Real-time monitoring systems
8. ✅ RESTful API design

### **Skills Developed**

- **Backend Development**: NestJS, Node.js, TypeScript
- **AI Integration**: OpenAI API, Prompt Engineering
- **Email Systems**: IMAP protocol, Email parsing
- **System Design**: Architecture, Error handling, Monitoring
- **DevOps**: Environment configuration, Deployment

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with 🤖 AI + 💻 Code + ☕ Coffee

</div>
