import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Hero() {
    return (
        <section className="relative w-full overflow-hidden bg-background border-b border-border/40 pb-16 pt-12 md:pb-32 md:pt-20 lg:py-32">
            <div className="container relative z-10 mx-auto px-4 flex flex-col items-center gap-8 text-center">
                <h1 className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                    Track films you've watched.
                    <br />
                    <span className="text-muted-foreground">Save those you want to see.</span>
                    <br />
                    <span className="text-primary">Tell your friends what's good.</span>
                </h1>
                <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
                    Lumen is the social network for film lovers. Keep a diary of every film you watch, rate and review them, and share your lists with friends.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Button asChild size="lg" className="h-12 px-8 text-lg font-bold rounded-full">
                        <Link href="/register">Get Started — It's Free!</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg font-medium rounded-full border-2">
                        <Link href="/films">Browse Films</Link>
                    </Button>
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 -z-10 h-full w-full opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" />
            </div>
        </section>
    )
}
