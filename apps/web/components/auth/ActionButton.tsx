import Link from "next/link";

import { cn } from "@/lib/utils";

// Icons
import { ArrowLeftIcon, Repeat2Icon } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";

const ERRORS = {
	AuthorizedCallbackError: {
		title: "Tentar novamente",
		href: "/sign-in",
		icon: {
			instance: Repeat2Icon,
			position: "left",
		},
	},
	default: {
		title: "Voltar",
		href: undefined,
		icon: {
			instance: ArrowLeftIcon,
			position: "left",
		},
	},
};

interface Params {
	error?: string;
	callbackUrl?: string;
}

export function ActionButton({ error, callbackUrl }: Params) {
	const isKeyInErrors = error && error in ERRORS;

	const { title, href, icon } = isKeyInErrors
		? ERRORS[error as keyof typeof ERRORS]
		: ERRORS.default;

	return (
		<Button
			asChild
			variant="outline"
			type="button"
			className={cn("w-full", {
				"flex-row-reverse": icon.position === "left",
			})}
		>
			<Link href={href || callbackUrl || "/"}>
				{title}
				<icon.instance className="ml-2 h-4 w-4" />
			</Link>
		</Button>
	);
}
