import getConnection from "@/lib/dbConnect.ts";
import Page from "@/Models/PageDataSchema.ts";
import Users from "@/Models/UserDataSchema.ts";
import { NextRequest, NextResponse } from "next/server";


// adds new user if not exists already
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await getConnection();

    const { email, name, username } = await req.json();

    const userExists = await Users.findOne({ email });

    if (userExists) {
      return NextResponse.json({ isNewUser: false }, { status: 200 });
    }

    if (!userExists) {
      // Create a new user and save

      const newUser = new Users({ email, name, username });
      const savedNewUser = await newUser.save();

      return NextResponse.json({ userId: savedNewUser._id, isNewUser: true });
    }
  } catch (error) {
    return NextResponse.json({ isNewUser: false }, { status: 500 });
  }
}


// gets all post data of a user
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await getConnection();

    const { searchParams } = new URL(req.url);

    // Get userId and page parameters from the query
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") as string) || 1; // Default to page 1
    const limit = 5; // Limit the number of items per page
    const skip = (page - 1) * limit; // Calculate how many items to skip

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the user data by user ID, but do not populate 'texts' yet
    const user = await Users.findById(userId);

    // Check if the user exists and has any text post IDs
    if (!user || !user.texts || user.texts.length === 0) {
      return NextResponse.json(
        { message: "No texts found for this user" },
        { status: 400 }
      );
    }

    // Fetch the actual text data with pagination
    const texts = await Page.find({ _id: { $in: user.texts } })
      .sort({ _id: -1 }) // Sort by _id (newest first)
      .skip(skip)
      .limit(limit);

    // Return the paginated texts data with pagination info
    return NextResponse.json({
      postData: texts,
      totalPosts: user.texts.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user texts" },
      { status: 500 }
    );
  }
}

// updates a user post
export async function PUT(req: NextRequest) {
 
  try {
    await getConnection();

    const { username, text, tags } = await req.json();

    const {searchParams} = new URL(req.url);

    const id = searchParams.get("id");

    const updatedPost = await Page.findByIdAndUpdate(
      id,
      { username, text, tags },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post updated successfully!", post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update post", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
