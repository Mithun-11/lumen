"use client"

import * as React from "react"
import { CalendarIcon, Star } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth-provider"
import { MovieDetails } from "@/lib/tmdb"

const reviewSchema = z.object({
    rating: z.number().min(0.5).max(5),
    content: z.string().optional(),
    watchedDate: z.date(),
    hasSpoilers: z.boolean(),
    isRewatch: z.boolean(),
})

interface AddReviewFormProps {
    movie: MovieDetails
}

function StarRating({ value, onChange }: { value: number, onChange: (val: number) => void }) {
    const [hoverRating, setHoverRating] = React.useState(0)

    const displayRating = hoverRating > 0 ? hoverRating : value

    return (
        <div
            className="flex items-center gap-1"
            onMouseLeave={() => setHoverRating(0)}
        >
            {[1, 2, 3, 4, 5].map((star) => {
                // Determine fill percentage based on the rating
                let fill = 0
                if (displayRating >= star) fill = 100
                else if (displayRating === star - 0.5) fill = 50

                return (
                    <div key={star} className="relative w-9 h-9 cursor-pointer transition-transform hover:scale-110">
                        {/* Empty Background Star */}
                        <Star className="w-9 h-9 text-muted-foreground/20 fill-muted-foreground/20 pointer-events-none" />

                        {/* Filled Overlay */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none transition-[width] duration-0" style={{ width: `${fill}%` }}>
                            <Star className="w-9 h-9 text-green-500 fill-current" />
                        </div>

                        {/* Left Half Touch Target */}
                        <button
                            type="button"
                            className="absolute inset-y-0 left-0 w-1/2 z-10 opacity-0"
                            onMouseEnter={() => setHoverRating(star - 0.5)}
                            onClick={() => onChange(star - 0.5)}
                            aria-label={`Rate ${star - 0.5} stars`}
                        />

                        {/* Right Half Touch Target */}
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 w-1/2 z-10 opacity-0"
                            onMouseEnter={() => setHoverRating(star)}
                            onClick={() => onChange(star)}
                            aria-label={`Rate ${star} stars`}
                        />
                    </div>
                )
            })}
            <span className="ml-2 text-xl font-bold text-muted-foreground w-8">
                {displayRating > 0 ? displayRating.toFixed(1) : ""}
            </span>
        </div>
    )
}

export function AddReviewForm({ movie }: AddReviewFormProps) {
    const { user } = useAuth()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            content: "",
            watchedDate: new Date(),
            hasSpoilers: false,
            isRewatch: false,
        },
    })

    async function onSubmit(values: z.infer<typeof reviewSchema>) {
        if (!user) {
            router.push("/login")
            return
        }

        setIsSubmitting(true)
        try {
            // Mapping TMDB 'Movie' type to API expected payload
            // API expects: { tmdbId, mediaType, title, releaseDate, posterPath, backdropPath, ...values }
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tmdbId: movie.id,
                    mediaType: 'movie', // We are on film page, so it's a movie
                    title: movie.title,
                    releaseDate: movie.release_date,
                    posterPath: movie.poster_path,
                    backdropPath: movie.backdrop_path,
                    ...values,
                }),
            })

            if (!res.ok) throw new Error("Failed to post review")

            form.reset()
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) {
        return (
            <div className="bg-muted/30 border border-border rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-4">Log in to review this film</p>
                <Button onClick={() => router.push("/login")}>Log In</Button>
            </div>
        )
    }

    return (
        <div className="bg-muted/10 border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Review this film</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Date Picker */}
                    <FormField
                        control={form.control}
                        name="watchedDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Watched On</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal bg-background",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "MMMM d, yyyy")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Review Text */}
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Review</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Add a review..."
                                        className="resize-none min-h-[100px] bg-background focus:ring-primary/50"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Rating */}
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => {
                            // Local state for hover managed inside the render prop or we can just use a small separate component inside?
                            // Since we can't easily add hooks inside render prop without react complaining if the component re-renders unpredictably, 
                            // let's assume we can use a small inline component wrapper or just use state from the parent if we lifted it.
                            // But cleaner to make a proper sub-component. 
                            // However, replace_file_content is limiting me to this block. 
                            // I will use a self-contained functional component defined outside or inline carefully.
                            // Actually, I can just define the StarRating component inside the main file above and use it here.
                            // BUT, I am only replacing this block.
                            // So I will implement the logic using a simple responsive hover on the elements themselves? 
                            // No, I need state for 'hoverRating'.
                            // I should verify if I can add the StarRating component definition in this file first.
                            // I will use a multi-step approach: 
                            // 1. Add StarRating component to the file. 
                            // 2. Use it here.
                            //
                            // Wait, I am using `replace_file_content`. I can replace the whole file content or a large chunk to include the new component.
                            // Let's use `AddReviewForm` as the target for the replacement and just put the StarRating component inside `AddReviewForm` or outside it.
                            // I'll do a MultiReplace or just replace the component body.

                            return (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-2 block">Rating</FormLabel>
                                    <FormControl>
                                        <StarRating value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />

                    {/* Toggles */}
                    <div className="flex gap-8 border-t border-border pt-6">
                        <FormField
                            control={form.control}
                            name="hasSpoilers"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-3 space-y-0">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal text-muted-foreground">Contains Spoilers</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isRewatch"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-3 space-y-0">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal text-muted-foreground">Rewatch</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground font-bold py-6">
                        {isSubmitting ? "Saving..." : "Log Film"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
