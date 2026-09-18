import { NextResponse } from "next/server";

export interface MembershipApplicationBody {
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  department: string;
  yearOfStudy: string;
  avenuesOfInterest?: string[];
  statementOfPurpose: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<MembershipApplicationBody>;

    const {
      fullName,
      email,
      phone,
      rollNumber,
      department,
      yearOfStudy,
      avenuesOfInterest = [],
      statementOfPurpose,
    } = body;

    // 1. Server-side Field Validation (Avenues of interest are strictly OPTIONAL)
    const missingFields: string[] = [];
    if (!fullName?.trim()) missingFields.push("Full Name");
    if (!email?.trim()) missingFields.push("Email Address");
    if (!phone?.trim()) missingFields.push("Phone Number");
    if (!rollNumber?.trim()) missingFields.push("Roll / Registration Number");
    if (!department?.trim()) missingFields.push("Department / School");
    if (!yearOfStudy?.trim()) missingFields.push("Year of Study");
    if (!statementOfPurpose?.trim()) missingFields.push("Statement of Purpose");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Please complete all required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email!.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Prevent oversized payloads
    if (
      fullName!.length > 150 ||
      email!.length > 150 ||
      phone!.length > 50 ||
      statementOfPurpose!.length > 5000
    ) {
      return NextResponse.json(
        { success: false, error: "Application payload exceeds allowable length." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail =
      process.env.CLUB_APPLICATION_EMAIL || "soudhar2006@gmail.com";

    if (!apiKey) {
      console.error(
        "[Membership Application] RESEND_API_KEY environment variable is missing."
      );
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service credential (RESEND_API_KEY) is missing on the server. Application could not be delivered.",
        },
        { status: 500 }
      );
    }

    const formattedAvenues =
      Array.isArray(avenuesOfInterest) && avenuesOfInterest.length > 0
        ? avenuesOfInterest.join(", ")
        : "None selected";

    // Format plain text body according to requirement 7
    const plainTextBody = `ROTARACT CLUB OF PRESIDENCY UNIVERSITY

New membership interest/application received.

------------------------------------------------

APPLICANT DETAILS

Name: ${fullName?.trim()}
Email: ${email?.trim()}
Phone: ${phone?.trim()}
Roll / Registration Number: ${rollNumber?.trim()}
Department / School: ${department?.trim()}
Year of Study: ${yearOfStudy?.trim()}

AVENUES OF INTEREST

${formattedAvenues}

STATEMENT OF PURPOSE

${statementOfPurpose?.trim()}

------------------------------------------------

Submitted:
${timestamp}`;

    // Format HTML body matching plain text structure with clean aesthetics
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #333;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #3B82F6; margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">ROTARACT CLUB OF PRESIDENCY UNIVERSITY</h2>
          <p style="color: #9A9A9A; font-size: 14px; margin-top: 6px;">New membership interest/application received.</p>
        </div>

        <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;" />

        <div style="margin-bottom: 20px;">
          <h4 style="color: #3B82F6; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">APPLICANT DETAILS</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #9A9A9A; width: 180px;">Name:</td>
              <td style="padding: 6px 0; color: #ffffff; font-weight: bold;">${fullName?.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9A9A9A;">Email:</td>
              <td style="padding: 6px 0; color: #3B82F6;">${email?.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9A9A9A;">Phone:</td>
              <td style="padding: 6px 0; color: #ffffff;">${phone?.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9A9A9A;">Roll / Registration Number:</td>
              <td style="padding: 6px 0; color: #ffffff;">${rollNumber?.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9A9A9A;">Department / School:</td>
              <td style="padding: 6px 0; color: #ffffff;">${department?.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9A9A9A;">Year of Study:</td>
              <td style="padding: 6px 0; color: #ffffff;">${yearOfStudy?.trim()}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="color: #3B82F6; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">AVENUES OF INTEREST</h4>
          <p style="color: #ffffff; font-size: 14px; margin: 0; background-color: #111; padding: 12px; border-radius: 8px; border: 1px solid #222;">
            ${formattedAvenues}
          </p>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="color: #3B82F6; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">STATEMENT OF PURPOSE</h4>
          <div style="padding: 16px; background-color: #111; border-radius: 8px; border-left: 4px solid #3B82F6;">
            <p style="color: #e5e5e5; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${statementOfPurpose?.trim()}</p>
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;" />

        <div style="text-align: center; font-size: 12px; color: #888888;">
          Submitted:<br />
          <strong style="color: #cccccc;">${timestamp}</strong>
        </div>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Rotaract Membership <onboarding@resend.dev>",
        to: [recipientEmail],
        reply_to: email?.trim(),
        subject: `New Membership Interest — ${fullName?.trim()}`,
        text: plainTextBody,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const errJson = await resendRes.json().catch(() => ({}));
      console.error("[Resend Email Error]:", errJson);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to dispatch email notification via server.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      timestamp,
    });
  } catch (error: unknown) {
    console.error("[Apply API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Internal server error.",
      },
      { status: 500 }
    );
  }
}

