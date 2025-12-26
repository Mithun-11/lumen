"use client";

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import gsap from "gsap"

export function Hero() {
    const containerRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const subtitleRef = useRef<HTMLParagraphElement>(null)
    const buttonsRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial states
            gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], {
                opacity: 0,
                y: 30
            })

            // Timeline
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

            tl.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.5,
                stagger: 0.2
            })
                .to(subtitleRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1
                }, "-=1")
                .to(buttonsRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1
                }, "-=0.8")

            // Ambient animation for the glow
            if (glowRef.current) {
                gsap.to(glowRef.current, {
                    scale: 1.2,
                    opacity: 0.4,
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                })
            }
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="relative w-full overflow-hidden pb-16 pt-12 md:pb-32 md:pt-20 lg:py-32">
            <div className="container relative z-10 mx-auto px-4 flex flex-col items-center gap-8 text-center">
                <h1 ref={titleRef} className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-sm">
                    Track films you've watched.
                    <br />
                    <span className="text-muted-foreground">Save those you want to see.</span>
                    <br />
                    <span className="text-primary tracking-tight">Tell your friends what's good.</span>
                </h1>
                <p ref={subtitleRef} className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl font-medium">
                    Lumen is the social network for film lovers. Keep a diary of every film you watch, rate and review them, and share your lists with friends.
                </p>
                <div ref={buttonsRef} className="flex flex-col gap-4 sm:flex-row">
                    <Button asChild size="lg" className="h-12 px-8 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-shadow duration-300">
                        <Link href="/register">Get Started — It's Free!</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg font-medium rounded-full border-2 backdrop-blur-sm bg-background/50">
                        <Link href="/films">Browse Films</Link>
                    </Button>
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 -z-10 h-full w-full pointer-events-none">
                <div
                    ref={glowRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px]"
                />
            </div>
        </section>
    )
}
