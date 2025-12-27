const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface Movie {
    id: number;
    title: string;
    poster_path: string | null; // Changed to string | null to match return type
    release_date: string;
    vote_average: number;
    overview: string;
}

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await res.json();

        // Map the results to include the full image URL
        return data.results.map((movie: any) => ({
            ...movie,
            poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        }));
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return [];
    }
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

export async function getMovieDetails(id: number): Promise<MovieDetails | null> {
    try {
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`);

        if (!res.ok) {
            throw new Error('Failed to fetch movie details');
        }

        const data = await res.json();

        return {
            ...data,
            poster_path: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : null,
            backdrop_path: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null, // Use original for backdrop
            credits: {
                ...data.credits,
                cast: data.credits.cast.map((person: any) => ({
                    ...person,
                    profile_path: person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null
                })),
                crew: data.credits.crew.map((person: any) => ({
                    ...person,
                    profile_path: person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null
                }))
            }
        };
    } catch (error) {
        console.error(`Error fetching details for movie ${id}:`, error);
        return null;
    }
}
