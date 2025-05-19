# Today Plan Bot

A simple yet powerful Telegram bot that provides a daily curated plan from your calendar events, helping you stay focused on what matters.

## Overview

Today Plan Bot fetches events from your personal and family calendars, filters out routine activities, and delivers a beautifully formatted daily plan via Telegram. It helps you focus on important events without the noise of daily routines.

## Features

- Fetches events from multiple calendar sources (iCal URLs)
- Filters out routine activities like meals and sleep times
- Sorts events chronologically
- Formats a clean, easy-to-read daily plan
- Delivers the plan via Telegram messaging
- Runs automatically daily via cron job

## Requirements

- Node.js (v14 or higher recommended)
- Telegram Bot API token (create one via [@BotFather](https://t.me/botfather))
- Calendar URLs in iCal format (.ics)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/today-plan-bot.git
   cd today-plan-bot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PERSONAL_ICS_URL=https://calendar.google.com/calendar/ical/your_personal_calendar_url/basic.ics
   FAMILY_ICS_URL=https://calendar.google.com/calendar/ical/your_family_calendar_url/basic.ics
   TELEGRAM_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=your_telegram_chat_id
   ```

4. Get your Telegram Chat ID:
   - Start a chat with your bot
   - Send a message to your bot
   - Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Look for the `"chat":{"id":123456789}` value in the response

## Usage

To run the bot manually:

```
npm start
```

### Setting Up Automated Daily Updates

#### Create a Shell Script

Create a file named `run-today-plan.sh` in your project directory:

```bash
#!/bin/bash
cd /path/to/today-plan-bot
/usr/bin/node index.js >> /path/to/today-plan-bot/logs/bot.log 2>&1
```

Make it executable:

```
chmod +x run-today-plan.sh
```

#### Set Up a Cron Job

Edit your crontab:

```
crontab -e
```

Add a line to run the bot at your desired time (e.g., 7:00 AM daily):

```
0 7 * * * /path/to/today-plan-bot/run-today-plan.sh
```

For a friendly morning reminder at 7 AM and an evening reminder at 6 PM:

```
0 7,18 * * * /path/to/today-plan-bot/run-today-plan.sh
```

## Customization

You can customize the excluded events by modifying the `EXCLUDED_EVENTS` array in `index.js`. These events won't appear in your daily plan.

```javascript
const EXCLUDED_EVENTS = [
  "wake up",
  "yoga",
  "Breakfast",
  "Lunch",
  "Dinner",
  // Add your own routine events here
];
```

## Telegram Message Format

The bot formats your daily plan with emojis and clear timing:

```
📆 *Today's Plan* (Tuesday, Jun 4)

🕒 9:00 AM – Team Meeting
🕒 12:30 PM – Lunch with Client
🕒 3:00 PM – Project Review
```

Events with descriptions will show the first 100 characters of the description.

## Troubleshooting

- **Bot not sending messages**: Verify your TELEGRAM_TOKEN and TELEGRAM_CHAT_ID
- **Missing events**: Check your calendar URLs and ensure they're accessible
- **Cron job not running**: Check your logs at `/path/to/today-plan-bot/logs/bot.log`

## Roadmap

- [x] Fetch and parse calendar events
- [x] Filter routine events
- [x] Format daily plan
- [x] Integrate with Telegram API
- [x] Add automated daily scheduling
- [x] Support for event descriptions
- [ ] Categorize events for better structured message
- [ ] Support for event locations
- [ ] Interactive commands for the bot

## License

ISC

## Contributing

Contributions, issues, and feature requests are welcome!

## Acknowledgements

This project uses:
- [node-ical](https://github.com/jens-maus/node-ical) for parsing iCal data
- [dayjs](https://day.js.org/) for date formatting and manipulation
- [dotenv](https://github.com/motdotla/dotenv) for environment variable management
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) for Telegram integration
