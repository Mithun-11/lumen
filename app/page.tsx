import { Hero } from "./(home)/_components/hero";
import { PopularFilms } from "./(home)/_components/popular-films";
import { RecentReviews } from "./(home)/_components/recent-reviews";
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