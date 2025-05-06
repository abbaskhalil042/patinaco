import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import connectDB from "../../../../lib/db";
import { isAdminRequest } from "../auth/[...nextauth]/route";

// Initialize AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEYid!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest, res: NextResponse) {
  connectDB();
  isAdminRequest(req, res); // Ensure the user is an admin
  try {
    const formData = await req.formData(); // Use formData to handle the incoming file
    const file = formData.get("file") as File; // Get the uploaded file
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Decode the base64 string into a buffer (if needed)
    const buffer = Buffer.from(await file.arrayBuffer()); // Get the buffer from the file

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `uploads/${Date.now()}`, // Use timestamp to generate a unique file name
      Body: buffer,
      ContentType: file.type, // Use the file's mime type
      // ACL: ObjectCannedACL.public_read,
    };

    console.log("Uploading file to S3:", uploadParams);

    // Upload file to S3
    const command = new PutObjectCommand(uploadParams);
    console.log("Command:", command);
    const data = await s3Client.send(command);

    // Return the URL of the uploaded file
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
    console.log("File uploaded successfully:", data);
    console.log("File URL:", fileUrl);

    return NextResponse.json({
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
