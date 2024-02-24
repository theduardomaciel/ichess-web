import Link from "next/link";

// Components
import { GoogleLoginButton } from "../GoogleLogin";
import React from "react";

interface Props {
	className?: string;
	children: React.ReactNode;
}

export function NotLogged({ className, children }: Props) {
	return (
		<div className="flex flex-col md:flex-row justify-center items-start md:items-center flex-wrap w-full px-8 py-8 md:py-4 gap-4 md:gap-9 m-auto border-2 border-dashed border-primary-200/50 rounded-md mt-10 text-base font-medium">
			<span className="font-title font-bold">Eita!</span>
			<span className="text-left flex-1">
				{children ||
					"Você precisa estar logado para ver os eventos internos."}
			</span>
			<GoogleLoginButton className="px-8 max-md:w-full" />
		</div>
	);
}
