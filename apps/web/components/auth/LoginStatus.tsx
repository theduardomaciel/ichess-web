import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

// Icons
import ManageAccountIcon from "@/public/icons/manage_account.svg";

// Components
import {
	ContinueRegistrationButton,
	GoogleButton,
} from "@/components/auth/SignInButton";
import { Panel } from "@/components/forms";

interface NotLoggedProps {
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
}: NotLoggedProps) {
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

interface LoggedProps {
	email: string;
}

export function Logged({ email }: LoggedProps) {
	return (
		<Panel type="success" showIcon>
			Você está logado como <strong>{email}</strong>.
			<Link href="/auth" className="absolute top-1/2 right-4 -translate-y-1/2">
				<ManageAccountIcon width={22} height={22} />
			</Link>
		</Panel>
	);
}
