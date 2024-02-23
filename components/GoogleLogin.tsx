import { cn } from "@/lib/utils";

// Icons
import GoogleColorIcon from "@/public/google.svg";

import { Button } from "@/components/ui/button";

interface Props {
	className?: string;
	fullWidth?: boolean;
}

export function GoogleLoginButton({ className, fullWidth }: Props) {
	return (
		<Button
			variant={"secondary"}
			type="button"
			className={cn(
				"px-3 py-5 gap-3 inline-flex border border-gray-100",
				{
					"w-full": fullWidth, // É necessário aplicar esse estilo separadamente pois alguns navegadores não suportam o uso de width: fit-content, o que impossibilitaria o uso do botão em casos que fugissem do padrão,
				},
				className,
			)}
		>
			<GoogleColorIcon className="w-5 h-5" />
			<div className="text-neutral text-sm font-medium">
				Continuar com Google
			</div>
		</Button>
	);
}
