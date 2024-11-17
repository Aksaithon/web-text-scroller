import getConnection from "@/lib/dbConnect.ts";
import Users from "@/Models/UserDataSchema.ts";
import { NextResponse } from "next/server";


type Params = Promise<{username: string}>

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  const { username } = await params;

  try {
    await getConnection();

    const userAvailable = await Users.findOne({ username: username });

    if (userAvailable) {
      return NextResponse.json({ isAvailable: false });
    }

    if (!userAvailable) {
      return NextResponse.json({ isAvailable: true });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to find username" },
      { status: 404 }
    );
  }
}
