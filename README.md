# Today Plan Bot

A simple yet powerful Telegram bot that provides a daily curated plan from your calendar events, helping you stay focused on what matters.

## Overview

Today Plan Bot fetches events from your personal and family calendars, filters out routine activities, and delivers a beautifully formatted daily plan via Telegram. It helps you focus on important events without the noise of daily routines.

## Features

- Fetches events from multiple calendar sources (iCal URLs)
- Filters out routine activities like meals and sleep times (hardcoded for now)
- Sorts events chronologically
- Formats a clean, easy-to-read daily plan
- Delivers the plan via Telegram (planned feature)

## Requirements

- Node.js (v14 or higher recommended)
- Telegram Bot API token (for the planned Telegram integration)
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
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=your_telegram_chat_id
   ```

## Usage

To run the bot manually:

```
npm start
```

For production use, you'll want to set up a scheduled task (cron job) to run the bot at a specific time each day, for example:

```
0 7 * * * cd /path/to/today-plan-bot && npm start
```

This would run the bot every day at 7:00 AM.

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

## Roadmap

- [x] Fetch and parse calendar events
- [x] Filter routine events
- [x] Format daily plan
- [ ] Integrate with Telegram API
- [ ] Add automated daily scheduling
- [ ] Support for event location and details
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
