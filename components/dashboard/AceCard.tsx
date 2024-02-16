// Icons
import ACE_Icon from "@/public/icons/ace.svg";

// Types
import { ACEs } from "@/lib/validations/AddEventForm";

export default function AceCard() {
	return <div className=""></div>;
}

export function AceLabel({ ace }: { ace: (typeof ACEs)[number] }) {
	return (
		<div className="flex flex-row items-center justify-start gap-4">
			<ACE_Icon className="opacity-80 text-muted min-w-fit" />
			<p className="text-left leading-tight text-sm">{ace.name}</p>
		</div>
	);
}
