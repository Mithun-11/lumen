import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, Film } from "lucide-react"
import { query } from "@/lib/db"

export async function RecentReviews() {
    let reviews: any[] = [];
    try {
        const result = await query(`
            SELECT 
                r.id, 
                r.rating, 
                r.content, 
                u.username, 
                u.avatar_url,
                m.title, 
                m.poster_path,
                m.release_date
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN movies m ON r.movie_id = m.id
            ORDER BY r.created_at DESC
            LIMIT 4
        `);
        reviews = result.rows;
    } catch (e) {
        console.error("Failed to fetch reviews", e);
    }

    if (reviews.length === 0) {
        return (
            <section className="container mx-auto px-4 py-12 border-t border-border/40">
                <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground border-b border-primary/50 pb-1 mb-6">
                    Just Reviewed
                </h2>
                <div className="text-center py-10 text-muted-foreground">
                    No reviews yet. Be the first to log a film!
                </div>
            </section>
        )
    }

    return (
        <section className="container mx-auto px-4 py-12 border-t border-border/40">
            <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground border-b border-primary/50 pb-1 mb-6">
                Just Reviewed
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {reviews.map((review) => (
                    <Card key={review.id} className="bg-card/50 border-input/20 h-full flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                            <Avatar className="h-8 w-8 ring-1 ring-border">
                                <AvatarImage src={review.avatar_url} />
                                <AvatarFallback>{review.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-semibold truncate hover:text-primary cursor-pointer transition-colors">{review.username}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 flex-1 flex flex-col gap-3">
                            <div className="flex gap-3">
                                {review.poster_path ? (
                                    <div className="shrink-0 w-16 shadow-md rounded overflow-hidden group relative">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${review.poster_path}`}
                                            alt={review.title}
                                            className="w-full h-auto object-cover aspect-[2/3] group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded" />
                                    </div>
                                ) : (
                                    <div className="shrink-0 w-16 h-24 bg-muted flex items-center justify-center rounded">
                                        <Film className="opacity-20" />
                                    </div>
                                )}

                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-sm leading-tight line-clamp-2 hover:text-primary cursor-pointer transition-colors">{review.title}</span>
                                    <span className="text-xs text-muted-foreground">{review.release_date?.toISOString().split('-')[0]}</span>

                                    <div className="flex items-center text-green-500 mt-1">
                                        {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-current" />
                                        ))}
                                        {review.rating % 1 !== 0 && (
                                            <div className="relative h-3 w-3">
                                                <Star className="absolute h-3 w-3 text-green-500/30 fill-current" />
                                                <div className="absolute top-0 left-0 w-[50%] h-full overflow-hidden">
                                                    <Star className="h-3 w-3 text-green-500 fill-current" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {review.content && (
                                <div className="mt-auto pt-3 border-t border-border/30">
                                    <p className="text-sm text-zinc-300 line-clamp-3 italic">
                                        "{review.content}"
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
