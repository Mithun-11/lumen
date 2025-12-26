"use client";

import Link from "next/link"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Movie } from "@/lib/tmdb"

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

interface PopularFilmsProps {
    movies: Movie[]
}

export function PopularFilms({ movies }: PopularFilmsProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.from(".movie-card", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        })
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="container mx-auto px-4 py-12">
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
                {movies.slice(0, 6).map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <MovieCard
                            title={movie.title}
                            year={movie.release_date ? movie.release_date.split('-')[0] : "N/A"}
                            imageSrc={movie.poster_path || '/images/placeholder.png'}
                            rating={movie.vote_average}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}
