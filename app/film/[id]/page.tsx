import { getMovieDetails } from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function FilmPage({ params }: PageProps) {
    const { id } = await Promise.resolve(params);
    const movie = await getMovieDetails(parseInt(id));

    if (!movie) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Backdrop Section */}
            <div className="relative w-full h-[50vh] md:h-[70vh]">
                <div className="absolute inset-0">
                    {movie.backdrop_path ? (
                        <Image
                            src={movie.backdrop_path}
                            alt={movie.title}
                            fill
                            className="object-cover opacity-50"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                {/* Content Container Overlay */}
                <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12 flex flex-col md:flex-row items-end gap-8">
                    {/* Poster Image */}
                    <div className="hidden md:block w-64 shadow-2xl rounded-lg overflow-hidden border-4 border-background/20 z-10 -mb-20">
                        <Image
                            src={movie.poster_path || "/placeholder.png"}
                            alt={movie.title}
                            width={300}
                            height={450}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Header Info */}
                    <div className="flex-1 mb-4 md:mb-0">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white drop-shadow-lg">
                            {movie.title}
                        </h1>

                        {movie.tagline && (
                            <p className="text-xl md:text-2xl text-gray-200 italic font-light mb-6 drop-shadow-md">
                                "{movie.tagline}"
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-100 font-medium">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {movie.release_date?.split('-')[0]}
                            </span>
                            <Separator orientation="vertical" className="h-4 bg-gray-400" />
                            {movie.runtime && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {movie.runtime} min
                                </span>
                            )}
                            <Separator orientation="vertical" className="h-4 bg-gray-400" />
                            <span className="flex items-center gap-1.5 text-yellow-400">
                                <Star className="w-4 h-4 fill-current" />
                                {movie.vote_average.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 md:mt-12 flex flex-col md:flex-row gap-12">
                {/* Left Column (Metadata) */}
                <div className="w-full md:w-1/3 lg:w-1/4 space-y-8">
                    {/* Mobile Poster (visible only on mobile) */}
                    <div className="md:hidden w-48 mx-auto shadow-2xl rounded-lg overflow-hidden border-4 border-background/20 -mt-32 relative z-10 mb-8">
                        <Image
                            src={movie.poster_path || "/placeholder.png"}
                            alt={movie.title}
                            width={200}
                            height={300}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map(g => (
                                <Badge key={g.id} variant="secondary" className="bg-secondary/50 hover:bg-secondary">
                                    {g.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Director</h3>
                        <div className="space-y-4">
                            {movie.credits.crew.filter(c => c.job === 'Director').map(director => (
                                <div key={director.credit_id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                                        {director.profile_path && (
                                            <Image src={director.profile_path} alt={director.name} width={40} height={40} className="object-cover w-full h-full" />
                                        )}
                                    </div>
                                    <span className="font-medium">{director.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {movie.production_companies.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Production</h3>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                                {movie.production_companies.slice(0, 3).map(c => (
                                    <li key={c.id}>{c.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Column (Overview & Cast) */}
                <div className="flex-1 space-y-10">
                    <section>
                        <h3 className="text-2xl font-bold mb-4">Synopsis</h3>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {movie.overview}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold mb-6">Top Cast</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {movie.credits.cast.slice(0, 8).map(actor => (
                                <div key={actor.id} className="group">
                                    <div className="aspect-[2/3] relative rounded-md overflow-hidden bg-muted mb-3">
                                        {actor.profile_path ? (
                                            <Image
                                                src={actor.profile_path}
                                                alt={actor.name}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">?</div>
                                        )}
                                    </div>
                                    <p className="font-medium leading-none">{actor.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
