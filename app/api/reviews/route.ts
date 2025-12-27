import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { tmdbId, mediaType, title, releaseDate, posterPath, backdropPath, rating, content, watchedDate, hasSpoilers, isRewatch } = body;

        // 1. Ensure Movie/TV Show Exists in Local DB
        // We use ON CONFLICT DO NOTHING (or similar logic) to handle race conditions, 
        // but standard SQL 'INSERT ... ON CONFLICT' for Postgres.
        // However, since we are doing raw SQL, let's just try to select and then insert if missing.

        let movieId = null;
        const mediaTypeValue = mediaType || 'movie'; // Default to 'movie' for backwards compatibility

        const movieCheck = await query("SELECT id FROM movies WHERE tmdb_id = $1 AND media_type = $2", [tmdbId, mediaTypeValue]);

        if (movieCheck.rowCount && movieCheck.rowCount > 0) {
            movieId = movieCheck.rows[0].id;
        } else {
            // Fetch full details if we want runtime etc, but for now we rely on what the frontend sent us 
            // or we can fetch quickly from TMDB here to be safe.
            // Let's rely on basic data for now to be fast.

            const insertMovie = await query(
                `INSERT INTO movies (tmdb_id, media_type, title, release_date, poster_path, backdrop_path)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
                [tmdbId, mediaTypeValue, title, releaseDate || null, posterPath, backdropPath]
            );
            movieId = insertMovie.rows[0].id;
        }

        // 2. Insert Review
        const insertReview = await query(
            `INSERT INTO reviews (user_id, movie_id, rating, content, watched_date, has_spoilers, is_rewatch)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
            [session.userId, movieId, rating, content, watchedDate, hasSpoilers, isRewatch]
        );

        return NextResponse.json({ success: true, reviewId: insertReview.rows[0].id });

    } catch (error) {
        console.error("Review posting error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
