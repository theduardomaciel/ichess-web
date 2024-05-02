import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// Components
import {
	ContinueRegistrationButton,
	GoogleButton,
} from "@/components/auth/SignInButton";

interface Props {
	className?: string;
	href?: string;
	isAuthenticated?: boolean;
	children: ReactNode;
}

export function NotLogged({
	className,
	href,
	isAuthenticated,
	children,
}: Props) {
	return (
		<div
			className={cn(
				"flex w-full flex-col flex-wrap items-start justify-center gap-4 rounded-md border-2 border-dashed border-primary-200/50 px-8 py-8 text-base font-medium md:flex-row md:items-center md:gap-9 md:py-4",
				className,
			)}
		>
			<span className="font-title font-bold">Eita!</span>
			<span className="flex-1 text-left">
				{children || "Você precisa estar logado para ver os eventos internos."}
			</span>
			{isAuthenticated ? (
				<ContinueRegistrationButton className="px-8 max-md:w-full" />
			) : (
				<GoogleButton className="px-8 max-md:w-full" callbackUrl={href} />
			)}
		</div>
	);
}
