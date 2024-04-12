"use client";

import { useRouter } from "next/navigation";

// Icons
import { ArrowLeftIcon, Repeat2Icon } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { useQueryString } from "@/hooks/use-query-string";
import { cn } from "@/lib/utils";

const ERRORS = {
	AuthorizedCallbackError: {
		title: "Tentar novamente",
		href: "/",
		icon: {
			instance: Repeat2Icon,
			position: "left",
		},
	},
	default: {
		title: "Voltar",
		href: null,
		icon: {
			instance: ArrowLeftIcon,
			position: "left",
		},
	},
};

export function ActionButton() {
	const error = useQueryString().query.get("error");
	const router = useRouter();

	const isKeyInErrors = error && error in ERRORS;
	const { title, href, icon } = isKeyInErrors
		? ERRORS[error as keyof typeof ERRORS]
		: ERRORS.default;

	return (
		<Button
			variant="outline"
			type="button"
			className={cn("w-full", {
				"flex-row-reverse": icon.position === "left",
			})}
			onClick={() => (href ? router.push(href) : router.back())}
		>
			{title}
			<icon.instance className="ml-2 h-4 w-4" />
		</Button>
	);
}
