"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clapperboard, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function RegisterPage() {
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form handlers
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            await register({ email, username, password });
        } catch (err: any) {
            setError(err.message || "Registration failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Cinematic Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] opacity-40" />
            </div>

            <div className="w-full max-w-md p-4 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 group-hover:bg-primary/20 transition-colors">
                            <Clapperboard className="w-8 h-8 text-primary" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Lumen
                        </span>
                    </Link>
                </div>

                <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center pb-2">
                        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Join the community of film lovers
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="bg-background/50 border-input/50 focus:border-primary/50 focus:bg-background transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    placeholder="cinephile123"
                                    className="bg-background/50 border-input/50 focus:border-primary/50 focus:bg-background transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="bg-background/50 border-input/50 focus:border-primary/50 focus:bg-background transition-all"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded">{error}</p>
                            )}

                            <Button disabled={loading} className="w-full font-bold shadow-lg shadow-primary/20" size="lg">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
                        <p className="mt-2">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-primary hover:underline transition-all">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
