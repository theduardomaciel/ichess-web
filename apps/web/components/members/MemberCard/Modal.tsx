"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

// Components
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function MemberCardModal({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();

	return (
		<Dialog open={isOpen}>
			<DialogContent
				className="gap-6 sm:max-w-[600px]"
				// hasCloseButton={false}
				onOverlayClick={() => {
					setIsOpen(false);

					setTimeout(() => {
						router.back();
					}, 100);
				}}
			>
				{children}
			</DialogContent>
		</Dialog>
	);
}
