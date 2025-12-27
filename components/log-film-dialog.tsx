"use client"

import * as React from "react"
import { CalendarIcon, Clapperboard, Star, X } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

// Schema
const reviewSchema = z.object({
    rating: z.number().min(0.5).max(5),
    content: z.string().optional(),
    watchedDate: z.date(),
    hasSpoilers: z.boolean(),
    isRewatch: z.boolean(),
})

type SearchResult = {
    id: number
    title: string
    release_date: string
    poster_path: string | null
    backdrop_path: string | null
}

export function LogFilmDialog({ children }: { children?: React.ReactNode }) {
    const { user } = useAuth()
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [selectedMovie, setSelectedMovie] = React.useState<SearchResult | null>(null)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [searching, setSearching] = React.useState(false)

    // Debounced search
    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([])
                return
            }
            setSearching(true)
            try {
                const res = await fetch(`/api/search/movie?query=${encodeURIComponent(query)}`)
                const data = await res.json()
                setResults(data.results || [])
            } catch (e) {
                console.error(e)
            } finally {
                setSearching(false)
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [query])

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

    // Submit Handler
    async function onSubmit(values: z.infer<typeof reviewSchema>) {
        if (!selectedMovie || !user) return

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tmdbId: selectedMovie.id,
                    title: selectedMovie.title,
                    releaseDate: selectedMovie.release_date,
                    posterPath: selectedMovie.poster_path,
                    backdropPath: selectedMovie.backdrop_path,
                    ...values,
                }),
            })

            if (!res.ok) throw new Error("Failed to post review")

            setOpen(false)
            // Reset state
            setSelectedMovie(null)
            form.reset()
            router.refresh()
        } catch (error) {
            console.error(error)
        }
    }

    // If user is not logged in, clicking trigger should maybe redirect to login or show alert?
    // For now, we assume trigger is hidden if not logged in (handled by parent), 
    // or we redirect here.

    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen && !user) {
            router.push("/login")
            return
        }
        setOpen(newOpen)
        if (!newOpen) {
            // slight delay to not jar the UI
            setTimeout(() => {
                setSelectedMovie(null)
                setQuery("")
            }, 300)
        }
    }


    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-wider">
                        <span className="mr-2 text-lg leading-none">+</span> Log Film
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-zinc-950 border-zinc-800 text-zinc-100">
                {!selectedMovie ? (
                    // STEP 1: SEARCH
                    <div className="flex flex-col h-[500px]">
                        <DialogHeader className="p-4 border-b border-zinc-800">
                            <DialogTitle className="text-center">Log a Film</DialogTitle>
                        </DialogHeader>
                        <Command className="bg-transparent rounded-none flex-1" shouldFilter={false}>
                            <div className="flex items-center border-b border-zinc-800 px-3">
                                <CommandInput
                                    placeholder="Name of film..."
                                    className="placeholder:text-zinc-500"
                                    value={query}
                                    onValueChange={setQuery}
                                />
                            </div>
                            <CommandList className="flex-1 overflow-y-auto p-2">
                                {searching && <div className="py-6 text-center text-sm text-zinc-500">Searching TMDB...</div>}

                                {!searching && results.length === 0 && query.length > 2 && (
                                    <CommandEmpty>No films found.</CommandEmpty>
                                )}

                                {results.map((movie) => (
                                    <CommandItem
                                        key={movie.id}
                                        value={movie.title}
                                        onSelect={() => setSelectedMovie(movie)}
                                        className="flex items-center gap-3 p-2 cursor-pointer hover:bg-zinc-900 rounded-md aria-selected:bg-zinc-900"
                                    >
                                        {movie.poster_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-10 h-14 object-cover rounded shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-10 h-14 bg-zinc-800 rounded flex items-center justify-center">
                                                <Clapperboard className="w-4 h-4 text-zinc-600" />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-bold text-zinc-100">{movie.title}</span>
                                            <span className="text-xs text-zinc-500">{movie.release_date?.split("-")[0]}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </div>
                ) : (
                    // STEP 2: REVIEW FORM
                    <div className="flex flex-col max-h-[85vh] overflow-y-auto">
                        <div className="relative h-48 w-full bg-zinc-900 shrink-0">
                            {selectedMovie.backdrop_path && (
                                <div className="absolute inset-0">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w780${selectedMovie.backdrop_path}`}
                                        className="w-full h-full object-cover opacity-40"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                                </div>
                            )}
                            <div className="absolute bottom-4 left-6 flex items-end gap-4 z-10">
                                {selectedMovie.poster_path && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w154${selectedMovie.poster_path}`}
                                        className="w-20 h-auto rounded border border-white/20 shadow-xl"
                                    />
                                )}
                                <div className="mb-1">
                                    <h2 className="text-2xl font-black text-white leading-tight shadow-black drop-shadow-md">{selectedMovie.title}</h2>
                                    <p className="text-zinc-400 text-sm">{selectedMovie.release_date?.split("-")[0]}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white z-20"
                                onClick={() => setSelectedMovie(null)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                    {/* Date Picker */}
                                    <FormField
                                        control={form.control}
                                        name="watchedDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Watched On</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white",
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
                                                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                            className="bg-zinc-900 text-zinc-100"
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
                                                <FormLabel className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Review</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Add a review..."
                                                        className="resize-none min-h-[120px] bg-zinc-900 border-zinc-800 focus:ring-green-500/50 focus:border-green-500"
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
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-400 text-xs uppercase font-bold tracking-wider mb-2 block">Rating</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-1 group">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                className={cn(
                                                                    "transition-all hover:scale-110 focus:outline-none",
                                                                    field.value >= star ? "text-green-500" : "text-zinc-800 group-hover:text-zinc-700"
                                                                )}
                                                                onClick={() => field.onChange(star)}
                                                            >
                                                                <Star className="w-8 h-8 fill-current" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Toggles */}
                                    <div className="flex gap-8 border-t border-zinc-800 pt-6">
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
                                                    <FormLabel className="font-normal text-zinc-300">Contains Spoilers</FormLabel>
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
                                                    <FormLabel className="font-normal text-zinc-300">I've watched this before</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-6">
                                        Save
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
