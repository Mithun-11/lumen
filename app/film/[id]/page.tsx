import { getMovieDetails } from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Star, User } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getReviewsForMovie } from "@/lib/actions";
import { AddReviewForm } from "@/components/add-review-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function FilmPage({ params }: PageProps) {
    const { id } = await Promise.resolve(params);
    const tmdbId = parseInt(id);

    const [movie, { reviews, averageRating, totalReviews }] = await Promise.all([
        getMovieDetails(tmdbId),
        getReviewsForMovie(tmdbId)
    ]);

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
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5 text-yellow-500" title="TMDB Rating">
                                    <span className="text-xs font-bold text-muted-foreground uppercase mr-1">TMDB</span>
                                    <Star className="w-4 h-4 fill-current" />
                                    {movie.vote_average.toFixed(1)}
                                </span>
                                {totalReviews > 0 && (
                                    <>
                                        <Separator orientation="vertical" className="h-4 bg-gray-400" />
                                        <span className="flex items-center gap-1.5 text-green-500" title="Lumen Community Rating">
                                            <span className="text-xs font-bold text-muted-foreground uppercase mr-1">Lumen</span>
                                            <Star className="w-4 h-4 fill-current" />
                                            {typeof averageRating === 'number' ? averageRating.toFixed(1) : averageRating}
                                        </span>
                                    </>
                                )}
                            </div>
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

                {/* Right Column (Overview & Cast & Reviews) */}
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

                    <Separator className="my-8" />

                    <section id="reviews" className="scroll-mt-20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold">Reviews</h3>
                            <Badge variant="outline" className="text-base px-3 py-1">{totalReviews}</Badge>
                        </div>

                        <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-12">
                            {/* Reviews List */}
                            <div className="space-y-6 order-2 xl:order-1">
                                {reviews.length === 0 ? (
                                    <div className="text-center py-12 bg-muted/20 rounded-lg">
                                        <p className="text-muted-foreground italic mb-2">No reviews yet.</p>
                                        <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="bg-card border border-border/50 rounded-lg p-5 shadow-sm transition-all hover:bg-card/80">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-9 h-9 border border-border">
                                                        <AvatarImage src={review.user.avatar_url || undefined} />
                                                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col leading-none gap-1">
                                                        <span className="font-semibold text-sm">{review.user.username}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                                            {format(new Date(review.created_at), 'MMM d, yyyy')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5 text-green-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn("w-3.5 h-3.5", i < Math.round(review.rating) ? "fill-current" : "text-muted-foreground/20 fill-muted-foreground/20")}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.content && (
                                                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                                                    {review.content}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Review Form */}
                            <div className="order-1 xl:order-2">
                                <div className="sticky top-24">
                                    <AddReviewForm movie={movie} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
