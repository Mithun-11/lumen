import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"

const reviews = [
    { id: 1, user: "Alex", avatar: "A", film: "Neon Horizon", rating: 5, text: "A masterpiece of visual storytelling. The synthwave soundtrack is killer." },
    { id: 2, user: "Sarah", avatar: "S", film: "The Long Silence", rating: 4, text: "Hauntingly beautiful but a bit slow paced for my taste." },
    { id: 3, user: "Mike", avatar: "M", film: "Whispers in the Dark", rating: 3, text: "Good jump scares but the plot falls apart in the third act." },
    { id: 4, user: "Emily", avatar: "E", film: "Neon Horizon", rating: 5, text: "I've seen this 5 times and it gets better every time." },
]

export function RecentReviews() {
    return (
        <section className="container mx-auto px-4 py-12 border-t border-border/40">
            <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground border-b border-primary/50 pb-1 mb-6">
                Just Reviewed
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {reviews.map((review) => (
                    <Card key={review.id} className="bg-card/50 border-input/20">
                        <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{review.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{review.user}</span>
                                <span className="text-xs text-muted-foreground">watched <span className="text-foreground font-medium">{review.film}</span></span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className="flex items-center text-green-500 mb-2">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-current" />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                "{review.text}"
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
