"use client"

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SearchResult = {
    id: number
    media_type: 'movie' | 'tv'
    title: string
    release_date: string
    poster_path: string | null
    backdrop_path: string | null
}

export function SiteSearch() {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [searching, setSearching] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([])
                return
            }
            setSearching(true)
            try {
                const res = await fetch(`/api/search/multi?query=${encodeURIComponent(query)}`)
                const data = await res.json()
                // Filter to only show movies as we only have movie details pages currently
                const movies = (data.results || []).filter((item: SearchResult) => item.media_type === 'movie')
                setResults(movies)
            } catch (e) {
                console.error(e)
            } finally {
                setSearching(false)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [query])

    const handleSelect = (item: SearchResult) => {
        setOpen(false)
        setQuery("")
        // For now, always assume film route, though API returns 'tv' too.
        // If we have TV routes later, we can switch based on item.media_type
        router.push(`/film/${item.id}`)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full max-w-sm justify-start text-muted-foreground bg-muted/50 border-input hover:bg-background hover:text-foreground p-0 px-3 relative h-10 overflow-hidden"
                >
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <span className="truncate">
                        {query ? query : "Search films..."}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] sm:w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search films..."
                        value={query}
                        onValueChange={setQuery}
                        className="h-11"
                    />
                    <CommandList>
                        {searching && (
                            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching...
                            </div>
                        )}
                        {!searching && results.length === 0 && query.length > 1 && (
                            <CommandEmpty className="py-6 text-center text-sm">No results found.</CommandEmpty>
                        )}
                        {!searching && results.length > 0 && (
                            <CommandGroup heading="Results">
                                {results.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.title + " " + item.id}
                                        onSelect={() => handleSelect(item)}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-8 h-12 bg-muted rounded overflow-hidden shrink-0">
                                                {item.poster_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-zinc-800" />
                                                )}
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-medium truncate">{item.title}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {item.release_date?.split('-')[0] || "Unknown"}
                                                </span>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
