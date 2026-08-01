import { NextResponse } from "next/server";
import {
  fetchGoogleCalendarEvents,
  getNextUpcomingEvent,
  getEventsForMonth,
} from "@/lib/google-calendar";

const BOT_KNOWLEDGE: Record<string, string> = {
  join: "You can apply for membership by visiting our Join Us page or filling out the application form on our website. We welcome all students passionate about leadership and service!",
  board:
    "The Board of Directors (2025-26) is led by President Rtn. Sourav Sharma, Vice President Rtr. Ananya Rao, Secretary Rtr. Rohan Kulkarni, and Treasurer Rtr. Priya Nair.",
  mission:
    "Our mission is to empower young adults through service, leadership development, professional networking, and impactful community initiatives.",
  projects:
    "Our flagship project is the Green Campus Revolution, which has planted over 1,000 native saplings across urban campus spaces.",
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = String(message || "")
      .toLowerCase()
      .trim();

    let reply =
      "Thank you for asking! The Rotaract Club of Presidency University is dedicated to youth leadership and service. For specific inquiries, feel free to contact us directly or visit our About page.";

    // 1. Fetch live events from Google Calendar API
    const allEvents = await fetchGoogleCalendarEvents();

    // 2. Check for specific Google Calendar AI questions:
    if (query.includes("next event") || query.includes("when is the next")) {
      const nextEvt = await getNextUpcomingEvent();
      if (nextEvt) {
        reply = `The next upcoming event on Google Calendar is '${nextEvt.title}' scheduled for ${nextEvt.date} at ${nextEvt.time} (${nextEvt.venue}). Category: ${nextEvt.category}.`;
      } else {
        reply =
          "There are currently no upcoming events scheduled on the official Google Calendar. Check back soon for updates!";
      }
    } else if (
      query.includes("this month") ||
      query.includes("happening this month") ||
      query.includes("events this month") ||
      query.includes("month events")
    ) {
      const now = new Date();
      const monthEvents = await getEventsForMonth(
        now.getFullYear(),
        now.getMonth(),
      );
      if (monthEvents.length > 0) {
        const eventListStr = monthEvents
          .map((e) => `• ${e.title} (${e.date} at ${e.time})`)
          .join("\n");
        reply = `Here are the events scheduled on Google Calendar for this month:\n${eventListStr}\nVisit our interactive Calendar page for full details!`;
      } else {
        reply = `No events scheduled for this month on Google Calendar yet. Visit our Calendar page to explore future conclaves!`;
      }
    } else {
      // 3. Search Google Calendar events by title / description match (e.g. "What time is the blood donation camp?")
      const matchedEvent = allEvents.find((evt) => {
        const titleLower = evt.title.toLowerCase();
        const descLower = evt.description.toLowerCase();
        const words = query.split(" ").filter((w) => w.length > 3);
        return words.some(
          (w) => titleLower.includes(w) || descLower.includes(w),
        );
      });

      if (matchedEvent) {
        reply = `'${matchedEvent.title}' is scheduled for ${matchedEvent.date} from ${matchedEvent.time} at ${matchedEvent.venue}. ${matchedEvent.description}`;
      } else if (
        query.includes("event") ||
        query.includes("upcoming") ||
        query.includes("calendar")
      ) {
        const upcoming = allEvents.filter((e) => e.status === "upcoming");
        if (upcoming.length > 0) {
          const topList = upcoming
            .slice(0, 3)
            .map((e) => `'${e.title}' on ${e.date}`)
            .join(", ");
          reply = `Our upcoming events on Google Calendar include: ${topList}. Head to our Calendar & Events page for full details!`;
        } else {
          reply =
            "Explore all scheduled assemblies on our interactive Google Calendar page!";
        }
      } else {
        // 4. Check general knowledge dictionary
        for (const [key, answer] of Object.entries(BOT_KNOWLEDGE)) {
          if (query.includes(key)) {
            reply = answer;
            break;
          }
        }
      }
    }

    return NextResponse.json({ reply, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
