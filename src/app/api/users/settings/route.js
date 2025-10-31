import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";

// ✅ GET user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usersCollection = await dbConnect("user");
    const user = await usersCollection.findOne(
      { email: session.user.email },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("GET /api/users/settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user settings" },
      { status: 500 }
    );
  }
}

// ✅ PATCH — Update profile, notifications, password, etc.
export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, name, image, currentPassword, newPassword, notifications } = body;

    const usersCollection = await dbConnect("user");
    const user = await usersCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates = {};

    // ✅ Update profile
    if (action === "profile") {
      if (name) updates.name = name;
      if (image) updates.image = image;
    }

    // ✅ Update notifications
    if (action === "notifications") {
      updates.notifications = notifications;
    }

    // ✅ Change password (plain-text version)
    if (action === "password") {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Both current and new password are required" },
          { status: 400 }
        );
      }

      if (!user.password) {
        return NextResponse.json(
          { error: "This account uses OAuth (Google/GitHub), no password set" },
          { status: 403 }
        );
      }

      // simple check (no bcrypt)
      if (currentPassword !== user.password) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 403 }
        );
      }

      updates.password = newPassword; // plain text
    }

    // ✅ Clear data (bookings/support tickets)
    if (action === "clearData") {
      const bookings = await dbConnect("bookings");
      const support = await dbConnect("supportTickets");
      await bookings.deleteMany({ userId: user._id });
      await support.deleteMany({ userId: user._id });
      return NextResponse.json({ success: true, message: "User data cleared." });
    }

    // ✅ Soft delete (mark as inactive)
    if (action === "deleteAccount") {
      updates.deleted = true;
      updates.deletedAt = new Date();
    }

    if (Object.keys(updates).length > 0) {
      await usersCollection.updateOne(
        { _id: new ObjectId(user._id) },
        { $set: updates }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/users/settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
