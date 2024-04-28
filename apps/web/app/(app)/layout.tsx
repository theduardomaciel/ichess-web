import { Fragment, type ReactNode } from "react";

import Footer from "@/components/footer";

export default function AppLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<Fragment>
			{children}
			<Footer />
		</Fragment>
	);
}
