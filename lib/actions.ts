"use server";

import { getPopularMovies, Movie } from "@/lib/tmdb";

export async function fetchPopularMovies(page: number): Promise<Movie[]> {
    return await getPopularMovies(page);
}
