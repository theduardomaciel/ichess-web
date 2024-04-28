import Header from "@/components/Header";
// import { auth } from "@ichess/auth";

export default function LandingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	/* const session = await auth();
	const isMember = !!session?.member?.role; */

	return (
		<>
			<Header />
			{children}
		</>
	);
}
