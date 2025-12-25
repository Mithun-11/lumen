import { Hero } from "@/components/hero";
import { PopularFilms } from "@/components/popular-films";
import { RecentReviews } from "@/components/recent-reviews";

export default function Page() {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <PopularFilms />
            <RecentReviews />
        </div>
    );
}