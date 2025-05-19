require("dotenv").config();
const ical = require("node-ical");
const dayjs = require("dayjs");
const TelegramBot = require("node-telegram-bot-api");

const PERSONAL_ICS_URL = process.env.PERSONAL_ICS_URL;
const FAMILY_ICS_URL = process.env.FAMILY_ICS_URL;
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
];

async function getTodaysEvents(calendarUrl) {
  try {
    const events = await ical.async.fromURL(calendarUrl);
    const today = dayjs().format("YYYY-MM-DD");

    return Object.values(events).filter((e) => {
      if (!e.start || !e.summary) return false;
      const eventDate = dayjs(e.start).format("YYYY-MM-DD");
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
  let msg = `📆 *Today’s Plan* (${dayjs().format("dddd, MMM D")})\n`;
  for (const e of events) {
    const time = dayjs(e.start).format("h:mm A");
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
  const familyCalEvents = await getTodaysEvents(FAMILY_ICS_URL);
  const personalCalEvents = await getTodaysEvents(PERSONAL_ICS_URL);

  const sortedEvents = sortEvents([...familyCalEvents, ...personalCalEvents]);

  const plan = formatPlan(sortedEvents);
  await sendTelegramMessage(plan);
  console.log("✅ Done");
}

main();
