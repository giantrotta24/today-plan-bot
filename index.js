require("dotenv").config();
const ical = require("node-ical");
const dayjs = require("dayjs");

const PERSONAL_ICS_URL = process.env.PERSONAL_ICS_URL;
const FAMILY_ICS_URL = process.env.FAMILY_ICS_URL;

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
  const events = await ical.async.fromURL(calendarUrl);
  const today = dayjs().format("YYYY-MM-DD");

  return Object.values(events)
    .filter((e) => {
      if (!e.start || !e.summary) return false;
      const eventDate = dayjs(e.start).format("YYYY-MM-DD");
      return eventDate === today && !EXCLUDED_EVENTS.includes(e.summary);
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start));
}

function formatPlan(events) {
  if (events.length === 0)
    return "✅ No events today. Free space to plan or rest.";
  let msg = `🧭 *Today’s Plan* (${dayjs().format("dddd, MMM D")})\n`;
  for (const e of events) {
    const time = dayjs(e.start).format("h:mm A");
    msg += `\n🕒 ${time} – ${e.summary}`;
  }
  return msg;
}

async function main() {
  const familyCalEvents = await getTodaysEvents(FAMILY_ICS_URL);
  const personalCalEvents = await getTodaysEvents(PERSONAL_ICS_URL);

  const plan = formatPlan([...familyCalEvents, ...personalCalEvents]);
  console.log(plan);
}

main();
