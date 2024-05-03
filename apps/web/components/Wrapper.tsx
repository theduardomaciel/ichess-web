import { Slot } from "@radix-ui/react-slot";
import type { ReactNode } from "react";

export function Wrapper({ children }: { children: ReactNode }) {
	return (
		<Slot className="flex min-h-screen flex-col items-start justify-start gap-[var(--wrapper)] px-wrapper py-12 lg:flex-row lg:gap-12">
			{children}
		</Slot>
	);
}
