import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateUploadUrl } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Only authenticated users can generate upload URLs
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename, contentType, folder = "uploads" } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
    }

    // Generate a unique key to prevent overwriting
    const uniqueId = crypto.randomUUID();
    const key = `${folder}/${uniqueId}-${filename}`;

    const uploadUrl = await generateUploadUrl(key, contentType);

    return NextResponse.json({ uploadUrl, key });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
