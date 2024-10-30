"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

// Icons
import { Loader2 } from "lucide-react";
import GoogleColorIcon from "@/public/logos/google.svg";

import { Button, type ButtonProps } from "@/components/ui/button";

// Navigation
import Link from "next/link";
import { login } from "@/app/auth/actions";

interface Props extends ButtonProps {
	callbackUrl?: string;
}

export function GoogleButton({
	className,
	disabled,
	callbackUrl,
	...rest
}: Props) {
	const [loading, setLoading] = useState(false);

	async function handleSignIn() {
		setLoading(true);

		login(callbackUrl);
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
			disabled={disabled || loading}
			{...rest}
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

export function ContinueRegistrationButton({ className, ...rest }: Props) {
	return (
		<Button
			variant={"default"}
			type="button"
			className={cn("inline-flex gap-3 px-3 py-5", className)}
			{...rest}
		>
			<Link className="text-sm font-medium text-neutral" href={"/join"}>
				Continuar cadastro
			</Link>
		</Button>
	);
}
