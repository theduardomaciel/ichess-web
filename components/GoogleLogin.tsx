// Icons
import GoogleColorIcon from "@/public/google.svg";

import { Button } from "@/components/ui/button";

export function GoogleLoginButton() {
	return (
		<Button
			variant={"secondary"}
			type="button"
			className="w-full px-3 py-5 gap-3 inline-flex border border-gray-100"
		>
			<GoogleColorIcon className="w-5 h-5" />
			<div className="text-neutral text-sm font-medium">
				Continuar com Google
			</div>
		</Button>
	);
}
