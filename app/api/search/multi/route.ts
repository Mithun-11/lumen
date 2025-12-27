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
            `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
        );
        const data = await res.json();

        // Filter out people results - we only want movies and TV shows
        // Then normalize the data to have consistent property names
        const results = data.results
            ?.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
            .slice(0, 8)
            .map((item: any) => ({
                id: item.id,
                media_type: item.media_type,
                // Movies use 'title', TV shows use 'name'
                title: item.title || item.name,
                // Movies use 'release_date', TV shows use 'first_air_date'
                release_date: item.release_date || item.first_air_date,
                poster_path: item.poster_path,
                backdrop_path: item.backdrop_path,
                overview: item.overview,
            })) || [];

        return NextResponse.json({ results });
    } catch (error) {
        console.error("TMDB Multi Search Error:", error);
        return NextResponse.json({ error: "Failed to search" }, { status: 500 });
    }
}
