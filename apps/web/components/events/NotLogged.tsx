import React from "react";

// Components
import { GoogleButton } from "@/app/auth/sign-in/SignInButton";

interface Props {
	className?: string;
	children: React.ReactNode;
}

export function NotLogged({ className, children }: Props) {
	return (
		<div className="m-auto mt-10 flex w-full flex-col flex-wrap items-start justify-center gap-4 rounded-md border-2 border-dashed border-primary-200/50 px-8 py-8 text-base font-medium md:flex-row md:items-center md:gap-9 md:py-4">
			<span className="font-title font-bold">Eita!</span>
			<span className="flex-1 text-left">
				{children ||
					"Você precisa estar logado para ver os eventos internos."}
			</span>
			<GoogleButton className="px-8 max-md:w-full" />
		</div>
	);
}
