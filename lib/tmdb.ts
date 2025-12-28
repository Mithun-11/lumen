import { env } from '@/lib/env';
import { z } from 'zod';

const API_KEY = env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// --- Zod Schemas for TMDB API Responses ---

const TMDBMovieSchema = z.object({
    id: z.number(),
    title: z.string(),
    poster_path: z.string().nullable(),
    release_date: z.string().optional().default(''),
    vote_average: z.number(),
    overview: z.string(),
}).passthrough();

const PopularMoviesResponseSchema = z.object({
    results: z.array(TMDBMovieSchema),
    page: z.number(),
    total_results: z.number(),
    total_pages: z.number(),
});

const GenreSchema = z.object({ id: z.number(), name: z.string() });

const ProductionCompanySchema = z.object({
    id: z.number(),
    logo_path: z.string().nullable(),
    name: z.string(),
    origin_country: z.string(),
});

const ProductionCountrySchema = z.object({ iso_3166_1: z.string(), name: z.string() });
const SpokenLanguageSchema = z.object({ iso_639_1: z.string(), name: z.string() });

const CastSchema = z.object({
    id: z.number(),
    known_for_department: z.string(),
    name: z.string(),
    original_name: z.string(),
    popularity: z.number(),
    profile_path: z.string().nullable(),
    cast_id: z.number(),
    character: z.string(),
    credit_id: z.string(),
    order: z.number(),
});

const CrewSchema = z.object({
    id: z.number(),
    known_for_department: z.string(),
    name: z.string(),
    original_name: z.string(),
    popularity: z.number(),
    profile_path: z.string().nullable(),
    credit_id: z.string(),
    department: z.string(),
    job: z.string(),
});

const VideoResultSchema = z.object({
    id: z.string(),
    iso_639_1: z.string(),
    iso_3166_1: z.string(),
    key: z.string(),
    name: z.string(),
    site: z.string(),
    size: z.number(),
    type: z.string(),
});

const TMDBMovieDetailsSchema = TMDBMovieSchema.extend({
    backdrop_path: z.string().nullable(),
    budget: z.number(),
    genres: z.array(GenreSchema),
    homepage: z.string().nullable(),
    imdb_id: z.string().nullable(),
    original_language: z.string(),
    original_title: z.string(),
    popularity: z.number(),
    production_companies: z.array(ProductionCompanySchema),
    production_countries: z.array(ProductionCountrySchema),
    revenue: z.number(),
    runtime: z.number().nullable(),
    spoken_languages: z.array(SpokenLanguageSchema),
    status: z.string(),
    tagline: z.string().nullable(),
    video: z.boolean(),
    vote_count: z.number(),
    credits: z.object({
        cast: z.array(CastSchema),
        crew: z.array(CrewSchema),
    }),
    videos: z.object({
        results: z.array(VideoResultSchema),
    }),
}).passthrough();

// --- Exported Interfaces (Mapped) ---

export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    overview: string;
}

export interface MovieDetails extends Movie {
    backdrop_path: string | null;
    budget: number;
    genres: { id: number; name: string }[];
    homepage: string | null;
    imdb_id: string | null;
    original_language: string;
    original_title: string;
    popularity: number;
    production_companies: { id: number; logo_path: string | null; name: string; origin_country: string }[];
    production_countries: { iso_3166_1: string; name: string }[];
    revenue: number;
    runtime: number | null;
    spoken_languages: { iso_639_1: string; name: string }[];
    status: string;
    tagline: string | null;
    video: boolean;
    vote_count: number;
    credits: {
        cast: {
            id: number;
            known_for_department: string;
            name: string;
            original_name: string;
            popularity: number;
            profile_path: string | null;
            cast_id: number;
            character: string;
            credit_id: string;
            order: number;
        }[];
        crew: {
            id: number;
            known_for_department: string;
            name: string;
            original_name: string;
            popularity: number;
            profile_path: string | null;
            credit_id: string;
            department: string;
            job: string;
        }[];
    };
    videos: {
        results: {
            id: string;
            iso_639_1: string;
            iso_3166_1: string;
            key: string;
            name: string;
            site: string;
            size: number;
            type: string;
        }[];
    };
}

// --- Fetch Functions ---

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        const parsed = PopularMoviesResponseSchema.parse(data);

        // Map the results to include the full image URL
        return parsed.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            overview: movie.overview,
        }));
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return [];
    }
}

export async function getMovieDetails(id: number): Promise<MovieDetails | null> {
    try {
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`);

        if (!res.ok) {
            throw new Error('Failed to fetch movie details');
        }

        const data = await res.json();
        const parsed = TMDBMovieDetailsSchema.parse(data);

        return {
            ...parsed,
            poster_path: parsed.poster_path ? `${IMAGE_BASE_URL}${parsed.poster_path}` : null,
            backdrop_path: parsed.backdrop_path ? `https://image.tmdb.org/t/p/original${parsed.backdrop_path}` : null,
            credits: {
                ...parsed.credits,
                cast: parsed.credits.cast.map((person) => ({
                    ...person,
                    profile_path: person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null
                })),
                crew: parsed.credits.crew.map((person) => ({
                    ...person,
                    profile_path: person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null
                }))
            }
        };
    } catch (error) {
        // If validation fails or fetch fails
        if (error instanceof z.ZodError) {
            console.error(`Validation error for movie ${id}:`, error.flatten());
        } else {
            console.error(`Error fetching details for movie ${id}:`, error);
        }
        return null;
    }
}
