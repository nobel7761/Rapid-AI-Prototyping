# Email Reader Application

A NestJS application that reads emails with a specific subject line and displays their content in the console.

## Features

- **Live Email Monitoring** - Continuously monitors emails every 10 seconds
- **Real-time Notifications** - Plays beep sounds when new emails are found
- **Smart Detection** - Prevents duplicate email processing
- **IMAP Integration** - Works with Gmail, Outlook, Yahoo, and other email providers
- **Console Display** - Shows email content (from, to, subject, date, body) in the terminal
- **RESTful API** - Endpoints to control monitoring and trigger manual checks

## Installation

```bash
$ npm install
```

## Configuration

1. Copy the environment configuration file:

```bash
cp env.example .env
```

2. Update the `.env` file with your email provider details:

### Gmail Configuration

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
```

**Note for Gmail users:** You need to use an App Password instead of your regular password. Enable 2-factor authentication and generate an App Password in your Google Account settings.

### Outlook Configuration

```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_HOST=outlook.office365.com
EMAIL_PORT=993
```

### Yahoo Configuration

```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=imap.mail.yahoo.com
EMAIL_PORT=993
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Usage

### API Endpoint

Send a POST request to `/read-emails` to read emails with the subject line "read emails from this subject line":

```bash
curl -X POST http://localhost:3000/read-emails
```

### How it works

1. **Automatic Startup** - The application starts monitoring immediately when launched
2. **Fast Detection** - Checks for new emails every 10 seconds for quick detection
3. **Smart Processing** - Only processes new, unread emails (no duplicates)
4. **Audio Alerts** - Plays 10 beep sounds (2-second intervals) for each new email found
5. **Console Display** - Shows email details in the terminal:
   - From address
   - To address
   - Subject
   - Date
   - Email body content

### Example Output

```
================================================================================
EMAIL #1
================================================================================
From: sender@example.com
To: your-email@gmail.com
Subject: read emails from this subject line
Date: Mon, 01 Jan 2024 10:00:00 +0000
--------------------------------------------------------------------------------
BODY:
--------------------------------------------------------------------------------
This is the content of the email body.
It can contain multiple lines of text.
================================================================================
```

## Customization

To change the subject line that the application searches for, modify the `subjectLine` variable in `src/app.controller.ts`:

```typescript
const subjectLine = 'your custom subject line here';
```

## Dependencies

- **@nestjs/common** - NestJS framework
- **imap** - IMAP client for email reading
- **mailparser** - Email parsing library
- **@types/imap** - TypeScript definitions for imap

## Security Notes

- Never commit your `.env` file with real credentials
- Use App Passwords for Gmail and Yahoo accounts
- Consider using environment variables in production
- The application only reads emails and does not modify them

## Troubleshooting

### Common Issues

1. **Authentication failed**: Check your email credentials and ensure you're using an App Password for Gmail/Yahoo
2. **Connection timeout**: Verify your email host and port settings
3. **No emails found**: Make sure you have unread emails with the exact subject line
4. **IMAP not enabled**: Ensure IMAP is enabled in your email account settings

### Gmail Setup

1. Enable 2-Factor Authentication
2. Go to Google Account settings
3. Security → App passwords
4. Generate a new app password
5. Use this password in your `.env` file

## License

This project is licensed under the MIT License.
