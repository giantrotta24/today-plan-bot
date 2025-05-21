const TelegramBot = require("node-telegram-bot-api");
const ical = require("node-ical");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const tz = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(tz);

const TIMEZONE = process.env.TIMEZONE || "America/New_York";
const PERSONAL_ICS_URL = process.env.PERSONAL_ICS_URL;
const FAMILY_ICS_URL = process.env.FAMILY_ICS_URL;
const WORK_ICS_URL = process.env.WORK_ICS_URL;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const EXCLUDED_EVENTS = [
  "wake up",
  "yoga",
  "Breakfast",
  "Lunch",
  "Dinner",
  "RVshare Hours",
  "Luci bed time",
  "Bed",
  "Daily Check Out",
];

function checkEnvVars() {
  const required = [
    "PERSONAL_ICS_URL",
    "FAMILY_ICS_URL",
    "WORK_ICS_URL",
    "TELEGRAM_TOKEN",
    "TELEGRAM_CHAT_ID",
  ];
  for (const varName of required) {
    if (!process.env[varName]) {
      console.error(`❌ Missing required environment variable: ${varName}`);
      process.exit(1);
    }
  }
}

async function getTodaysEvents(calendarUrl) {
  try {
    const events = await ical.async.fromURL(calendarUrl);
    const today = dayjs().tz(TIMEZONE).format("YYYY-MM-DD");

    return Object.values(events).filter((e) => {
      if (!e.start || !e.summary) return false;
      const eventDate = dayjs(e.start).tz(TIMEZONE).format("YYYY-MM-DD");
      return eventDate === today && !EXCLUDED_EVENTS.includes(e.summary);
    });
  } catch (error) {
    console.error("failed to get calendar events", error);
    process.exit(1);
  }
}

function formatPlan(events) {
  if (events.length === 0)
    return "✅ No events today. Free space to plan or rest.";
  let msg = `📆 *Today’s Plan* (${dayjs()
    .tz(TIMEZONE)
    .format("dddd, MMM D")})\n`;
  for (const e of events) {
    const time = dayjs(e.start).tz(TIMEZONE).format("h:mm A");
    msg += `\n🕒 ${time} – ${e.summary}`;
    if (e.description) {
      msg += `\n   ${e.description.substring(0, 100)}${
        e.description.length > 100 ? "..." : ""
      }`;
    }
  }
  return msg;
}

function sortEvents(events) {
  return events.sort((a, b) => new Date(a.start) - new Date(b.start));
}

async function sendTelegramMessage(message) {
  const bot = new TelegramBot(TELEGRAM_TOKEN);
  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, message, {
      parse_mode: "Markdown",
    });
    console.log("✅ Sent today’s plan to Telegram.");
  } catch (err) {
    console.error("❌ Failed to send Telegram message", err);
    process.exit(1);
  }
}

async function main() {
  checkEnvVars();

  const familyCalEvents = await getTodaysEvents(FAMILY_ICS_URL);
  console.log("🔍 Found", familyCalEvents.length, "family calendar events");
  const personalCalEvents = await getTodaysEvents(PERSONAL_ICS_URL);
  console.log("🔍 Found", personalCalEvents.length, "personal calendar events");
  const workCalEvents = await getTodaysEvents(WORK_ICS_URL);
  console.log("🔍 Found", workCalEvents.length, "work calendar events");

  const sortedEvents = sortEvents([
    ...familyCalEvents,
    ...personalCalEvents,
    ...workCalEvents,
  ]);

  const plan = formatPlan(sortedEvents);
  console.log("🔍 Sending Telegram message");
  await sendTelegramMessage(plan);
  console.log("Job done");
}

main();
