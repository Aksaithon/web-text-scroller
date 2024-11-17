import getConnection from "@/lib/dbConnect";
import Page from "@/Models/PageDataSchema";
import Users from "@/Models/UserDataSchema";
import { NextRequest, NextResponse } from "next/server";

// Create new TEXT data
export async function POST(req: NextRequest, res: NextResponse) {
  const { userId, username, text, tags } = await req.json();

  await getConnection;

  try {
    const newPage = new Page({
      username: username,
      text: text,
      tags: tags,
    });

    const savedPage = await newPage.save();

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        $push: { texts: savedPage._id },
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Text data added successfully", updatedUser, savedPage },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add text data" },
      { status: 500 }
    );
  }
}

// get all data with pagination
export const GET = async (req: NextRequest) => {
  try {
    await getConnection();

    // Get the page number from the query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") as string) || 1; // Default to page 1
    const limit = 5; // Limit the number of items returned
    const skip = (page - 1) * limit; // Calculate how many items to skip

    const texts = await Page.find().sort({ _id: -1 }).skip(skip).limit(limit);

    return NextResponse.json(texts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await getConnection();

    // get postId and userId from search parameters
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId") as string;
    const userId = searchParams.get("userId") as string;

    // find post and remove it
    const deletedPost = await Page.findByIdAndDelete(postId);

    // remove post from texts array
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        $pull: { texts: postId },
      },
      { new: true }
    );

    // check if post was deleted
    if (!deletedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post deleted successfully", updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
};
