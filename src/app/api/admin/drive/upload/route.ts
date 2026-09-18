import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-config";
import { uploadFileToDrive } from "@/lib/google-drive-service";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No image files provided." }, { status: 400 });
    }

    const uploadResults = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await uploadFileToDrive(buffer, file.name, file.type, "projects");
      uploadResults.push(result);
    }

    return NextResponse.json({
      success: true,
      data: uploadResults,
      urls: uploadResults.map((r) => r.url),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Drive upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
