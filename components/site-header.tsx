"use client"

import Link from "next/link"
import { Search, Menu, Film, User, LogOut } from "lucide-react"

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
import { LogFilmDialog } from "@/components/log-film-dialog"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SiteHeader() {
    const { user, logout } = useAuth();

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
                        <ModeToggle />

                        {user ? (
                            <>
                                <LogFilmDialog />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar_url || "/placeholder.png"} alt={user.username} />
                                                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.username}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => logout()}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                                    <Link href="/login">Log In</Link>
                                </Button>
                                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" asChild>
                                    <Link href="/register">Create Account</Link>
                                </Button>
                            </>
                        )}


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
