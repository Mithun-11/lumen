import Link from "next/link"
import { Search, Menu, Film } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center mx-auto px-4">
                <div className="mr-8 flex items-center gap-2">
                    <Film className="h-6 w-6 text-primary" />
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tight">Lumen</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link href="/films" className="transition-colors hover:text-primary">Films</Link>
                    <Link href="/lists" className="transition-colors hover:text-primary">Lists</Link>
                    <Link href="/members" className="transition-colors hover:text-primary">Members</Link>
                    <Link href="/journal" className="transition-colors hover:text-primary">Journal</Link>
                </nav>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    <div className="w-full max-w-sm hidden sm:block">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search films, lists, members..."
                                className="pl-8 bg-muted/50 border-input focus:bg-background transition-colors"
                            />
                        </div>
                    </div>
                    <nav className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                            <Link href="/login">Log In</Link>
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" asChild>
                            <Link href="/register">Create Account</Link>
                        </Button>
                        <ModeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Films</DropdownMenuItem>
                                <DropdownMenuItem>Lists</DropdownMenuItem>
                                <DropdownMenuItem>Members</DropdownMenuItem>
                                <DropdownMenuItem>Journal</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </nav>
                </div>
            </div>
        </header>
    )
}
