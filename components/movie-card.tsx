import Image from "next/image"
import { cn } from "@/lib/utils"

interface MovieCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    year?: string
    imageSrc: string
    rating?: number
}

export function MovieCard({ title, year, imageSrc, rating, className, ...props }: MovieCardProps) {
    return (
        <div className={cn("group relative aspect-[2/3] overflow-hidden rounded-md border border-border/50 bg-muted transition-all hover:ring-2 hover:ring-primary hover:border-transparent cursor-pointer", className)} {...props}>
            <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4">
                <h3 className="font-bold text-white leading-tight mb-1">{title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-300">
                    {year && <span>{year}</span>}
                    {rating && (
                        <div className="flex items-center text-primary-foreground">
                            <span className="text-green-500 mr-1">★★★★</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
