import { getPopularMovies } from "@/lib/tmdb";
import { FilmGrid } from "@/components/film-grid";

export const metadata = {
    title: "Popular Films - Lumen",
    description: "Browse popular films and find new favorites.",
};

export default async function FilmsPage() {
    const movies = await getPopularMovies(1);

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 border-b border-white/10 pb-4">
                Popular Films
            </h1>

            <FilmGrid initialMovies={movies} />
        </div>
    );
}
