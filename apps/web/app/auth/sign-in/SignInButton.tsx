"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";

// Icons
import { Loader2 } from "lucide-react";
import GoogleColorIcon from "@/public/logos/google.svg";

import { Button } from "@/components/ui/button";

interface Props {
	className?: string;
}

export function GoogleButton({ className }: Props) {
	const [loading, setLoading] = useState(false);

	async function handleSignIn() {
		setLoading(true);

		await signIn("google", {
			callbackUrl: "/dashboard",
		});
	}

	return (
		<Button
			variant={"secondary"}
			type="button"
			className={cn(
				"inline-flex gap-3 border border-gray-100 px-3 py-5",
				className,
			)}
			onClick={handleSignIn}
			disabled={loading}
		>
			{loading ? (
				<Loader2 className="mr-2 h-4 w-4 animate-spin" />
			) : (
				<GoogleColorIcon className="h-5 w-5" />
			)}
			<div className="text-sm font-medium text-neutral">
				Continuar com Google
			</div>
		</Button>
	);
}
