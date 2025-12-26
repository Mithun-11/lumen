import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
    const session = await getSession();

    if (!session || !session.userId) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const result = await query(
            "SELECT id, username, email, avatar_url, bio FROM users WHERE id = $1",
            [session.userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ user: null }, { status: 404 });
        }

        return NextResponse.json({ user: result.rows[0] });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
