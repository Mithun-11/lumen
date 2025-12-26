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

export async function getPopularMovies(): Promise<Movie[]> {
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);

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
