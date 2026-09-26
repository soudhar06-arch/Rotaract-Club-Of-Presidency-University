import { z } from "zod";
import { sendClubEmail } from "@/lib/email-service";
import { rateLimited, sameOrigin } from "@/lib/request-security";
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
  if (!sameOrigin(req)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  if (rateLimited(req, "apply", 5)) return NextResponse.json({ success: false, error: "Please wait before submitting again." }, { status: 429 });
  try {
    const parsed = z.object({ fullName: z.string().max(150), email: z.string().email().max(150), phone: z.string().max(50), rollNumber: z.string().max(150), department: z.string().max(150), yearOfStudy: z.string().max(100), avenuesOfInterest: z.array(z.string().max(150)).max(20).optional(), statementOfPurpose: z.string().max(5000) }).safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Please complete all required fields with valid text and an email address." }, { status: 400 });
    const body = parsed.data;

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

    await sendClubEmail(`New Membership Interest ? ${fullName.trim()}`, plainTextBody, email.trim());

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
          "Your application could not be delivered. Please try again later.",
      },
      { status: 500 }
    );
  }
}

