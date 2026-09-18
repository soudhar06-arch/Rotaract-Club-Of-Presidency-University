import { NextResponse } from "next/server";
import {
  fetchGoogleCalendarEvents,
  getNextUpcomingEvent,
  getEventsForMonth,
} from "@/lib/google-calendar";

const BOT_KNOWLEDGE: Record<string, string> = {
  join: "Any student enrolled at Presidency University across all schools can join! Fill out the membership application on our Join page.",
  membership: "The membership induction process includes an online application, review by the membership committee, and adding inducted members to official communication channels.",
  experience: "No prior volunteering or leadership experience is required! We welcome all enthusiastic students willing to serve and learn.",
  president: "The President of Rotaract Club of Presidency University is Deekshitha B.",
  secretary: "The Secretary of Rotaract Club of Presidency University is Soudhar Mendra V.",
  district: "Rotaract Club of Presidency University operates under Rotary International District 3192 (Charter ID: 217365).",
  rotary: "Our Sponsoring / Partner Rotary Club is Rotary Club of Vidyaranyapura.",
  board: "The Executive Board of RCPU includes President Deekshitha B, Secretary Soudhar Mendra V, and Directors Affan, Shakshi Chhatri, Tanisha Atanur, Rohith Kishan, Abimanyu K, and Anuska Kirtania.",
  mission: "Our mission is to empower Presidency University students through leadership development, professional networking, and sustainable community impact.",
  projects: "Our flagship projects include Petals of Power, Blood Donation Camp (with BMST & NCC), CyberShield, Career Catalyst, CPR Training, and International Cultural Exchanges.",
  calendar: "All upcoming club events are synced in real-time from our official Google Calendar. Click 'Add Club Calendar' to add events directly to your personal calendar.",
  faq: "Check out our dedicated FAQ page (/faq) for complete details regarding membership, events, and collaborations!",
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = String(message || "")
      .toLowerCase()
      .trim();

    let reply =
      "Thank you for asking! The Rotaract Club of Presidency University is dedicated to youth leadership and community service. Feel free to explore our FAQ section or contact us directly.";

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
      // 3. Search Google Calendar events by title / description match
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
          reply = `Our upcoming events on Google Calendar include: ${topList}. Head to our Calendar page for full details!`;
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
