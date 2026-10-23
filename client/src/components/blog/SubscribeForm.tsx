import { subscribeEmail } from "@/api/axios";
import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SubscribeForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setMessage("");
        setIsError(false);

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            setMessage("Please enter your email address.");
            setIsError(true);
            toast.error("Please enter your email address.");
            return;
        }

        try {
            setIsLoading(true);

            const response = await subscribeEmail(normalizedEmail);

            setMessage(response.message);
            toast.success(response.message);
            
            setEmail("");
        } catch (error: unknown) {
            setIsError(true);

            const errorMessage =
                typeof error === "object" &&
                    error !== null &&
                    "response" in error &&
                    typeof error.response === "object" &&
                    error.response !== null &&
                    "data" in error.response &&
                    typeof error.response.data === "object" &&
                    error.response.data !== null &&
                    "message" in error.response.data &&
                    typeof error.response.data.message === "string"
                    ? error.response.data.message
                    : "Unable to subscribe. Please try again.";

            setMessage(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <Card className="mx-auto max-w-4xl">
                    <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
                        {/* Email icon */}
                        <div className="rounded-full bg-primary/10 p-3">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>

                        {/* Heading and description */}
                        <div>
                            <h2 className="text-2xl font-bold sm:text-3xl">
                                Stay in the loop
                            </h2>

                            <p className="mt-2 text-muted-foreground">
                                Get the latest developer articles and technology insights
                                directly in your inbox.
                            </p>
                        </div>

                        {/* Subscription form */}
                        <form
                            onSubmit={handleSubscribe}
                            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
                        >
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                aria-label="Email address"
                                autoComplete="email"
                                maxLength={254}
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                disabled={isLoading}
                                className="flex-1"
                            />

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Subscribing..." : "Subscribe"}
                            </Button>
                        </form>

                        {/* Success or error message */}
                        {message && (
                            <p
                                role="status"
                                aria-live="polite"
                                className={`text-sm ${isError ? "text-destructive" : "text-green-600"
                                    }`}
                            >
                                {message}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}