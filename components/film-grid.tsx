"use client";

import { useState } from "react";
import { Movie } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { fetchPopularMovies } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FilmGridProps {
    initialMovies: Movie[];
}

export function FilmGrid({ initialMovies }: FilmGridProps) {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        setLoading(true);
        try {
            const newMovies = await fetchPopularMovies(page);

            setMovies((prev) => {
                // Filter out duplicates based on ID
                const existingIds = new Set(prev.map(m => m.id));
                const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.id));
                return [...prev, ...uniqueNewMovies];
            });

            setPage((prev) => prev + 1);
        } catch (error) {
            console.error("Failed to load more films", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card fade-in">
                        <Link href={`/film/${movie.id}`}>
                            <MovieCard
                                title={movie.title}
                                year={movie.release_date ? movie.release_date.split('-')[0] : "N/A"}
                                imageSrc={movie.poster_path || '/images/placeholder.png'}
                                rating={movie.vote_average}
                            />
                        </Link>
                    </div>
                ))}
            </div>

            <div className="flex justify-center w-full">
                <Button
                    onClick={loadMore}
                    disabled={loading}
                    variant="outline"
                    size="lg"
                    className="min-w-[200px]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        "Load More Films"
                    )}
                </Button>
            </div>
        </div>
    );
}
