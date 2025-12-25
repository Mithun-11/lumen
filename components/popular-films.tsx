import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"

const popularMovies = [
    { id: 1, title: "Neon Horizon", year: "1984", image: "/images/scifi.png", rating: 4.5 },
    { id: 2, title: "The Long Silence", year: "1962", image: "/images/drama.png", rating: 5.0 },
    { id: 3, title: "Whispers in the Dark", year: "2024", image: "/images/horror.png", rating: 3.5 },
    { id: 4, title: "Neon Horizon: 2049", year: "2017", image: "/images/scifi.png", rating: 4.2 },
    { id: 5, title: "Echoes of Silence", year: "1969", image: "/images/drama.png", rating: 3.8 },
    { id: 6, title: "The Red Room", year: "2023", image: "/images/horror.png", rating: 2.9 },
]

export function PopularFilms() {
    return (
        <section className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground border-b border-primary/50 pb-1">
                    Popular Films This Week
                </h2>
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary">
                    <Link href="/films">
                        More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {popularMovies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        title={movie.title}
                        year={movie.year}
                        imageSrc={movie.image}
                        rating={movie.rating}
                    />
                ))}
            </div>
        </section>
    )
}
