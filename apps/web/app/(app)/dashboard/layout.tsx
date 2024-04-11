import Header from "@/components/dashboard/Header";
// import { env } from "@ichess/env";

// console.log(env);

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
