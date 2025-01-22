"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export function LoginButton() {
	const { data: session, status } = useSession();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async () => {
		setIsLoading(true);
		try {
			const result = await signIn("discord", { callbackUrl: "/" });
			if (result?.error) {
				toast({
					title: "Error",
					description: "Failed to sign in. Please try again.",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Sign in error:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (status === "loading" || isLoading) {
		return (
			<Button
				variant='outline'
				disabled>
				Loading...
			</Button>
		);
	}

	if (session) {
		return (
			<Button
				variant='outline'
				onClick={() => signOut()}>
				Logout
			</Button>
		);
	}

	return (
		<Button
			variant='outline'
			onClick={handleSignIn}>
			Login with Discord
		</Button>
	);
}
