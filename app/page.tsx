import { Hero } from "@/components/hero";
import { PopularFilms } from "@/components/popular-films";
import { RecentReviews } from "@/components/recent-reviews";
import { getPopularMovies } from "@/lib/tmdb";

export default async function Page() {
    const movies = await getPopularMovies();

    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <PopularFilms movies={movies} />
            <RecentReviews />
        </div>
    );
}