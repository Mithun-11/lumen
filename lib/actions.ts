"use server";

import { query } from "@/lib/db";

import { getPopularMovies, Movie } from "@/lib/tmdb";

export async function fetchPopularMovies(page: number): Promise<Movie[]> {
    return await getPopularMovies(page);
}

export interface Review {
    id: string;
    rating: number;
    content: string | null;
    watched_date: Date | null;
    has_spoilers: boolean;
    is_rewatch: boolean;
    created_at: Date;
    user: {
        username: string;
        avatar_url: string | null;
    };
}

export async function getReviewsForMovie(tmdbId: number) {
    // 1. Get internal movie ID
    const movieRes = await query("SELECT id FROM movies WHERE tmdb_id = $1", [tmdbId]);

    if (movieRes.rowCount === 0) {
        return { reviews: [], averageRating: 0, totalReviews: 0 };
    }

    const movieId = movieRes.rows[0].id;

    // 2. Get Reviews with User info
    const reviewsRes = await query(`
        SELECT r.*, u.username, u.avatar_url 
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.movie_id = $1
        ORDER BY r.created_at DESC
    `, [movieId]);

    const reviews: Review[] = reviewsRes.rows.map((row: any) => ({
        id: row.id,
        rating: parseFloat(row.rating),
        content: row.content,
        watched_date: row.watched_date,
        has_spoilers: row.has_spoilers,
        is_rewatch: row.is_rewatch,
        created_at: row.created_at,
        user: {
            username: row.username,
            avatar_url: row.avatar_url
        }
    }));

    // 3. Calculate Average
    const avgRes = await query(`
        SELECT AVG(rating) as avg_rating, COUNT(*) as count
        FROM reviews
        WHERE movie_id = $1
    `, [movieId]);

    const averageRating = avgRes.rows[0].avg_rating ? parseFloat(avgRes.rows[0].avg_rating).toFixed(1) : 0;
    const totalReviews = parseInt(avgRes.rows[0].count);

    return {
        reviews,
        averageRating,
        totalReviews
    };
}
