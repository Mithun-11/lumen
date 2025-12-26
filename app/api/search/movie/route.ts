import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
        );
        const data = await res.json();

        // Return top 5 results to keep it snappy
        const results = data.results?.slice(0, 5) || [];

        return NextResponse.json({ results });
    } catch (error) {
        console.error("TMDB Search Error:", error);
        return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
    }
}
