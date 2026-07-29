import { NextResponse } from "next/server";

const BOT_KNOWLEDGE: Record<string, string> = {
  join: "You can apply for membership by visiting our Join Us page or filling out the application form on our website. We welcome all students passionate about leadership and service!",
  events:
    "Our major upcoming events include the Annual Mega Blood Donation Drive (Aug 15) and the Youth Leadership Summit (Sep 02). Check out the Events page for full details!",
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
    const query = String(message || "").toLowerCase();

    let reply =
      "Thank you for asking! The Rotaract Club of Presidency University is dedicated to youth leadership and service. For specific inquiries, feel free to contact us directly or visit our About page.";

    for (const [key, answer] of Object.entries(BOT_KNOWLEDGE)) {
      if (query.includes(key)) {
        reply = answer;
        break;
      }
    }

    // Simulate network delay for natural feel
    await new Promise((res) => setTimeout(res, 600));

    return NextResponse.json({ reply, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
