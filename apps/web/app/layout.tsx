import type { Metadata } from "next";
import { Manrope as FontSans, Inknut_Antiqua } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";

import "./globals.css";
import "@dotlottie/react-player/dist/index.css";

import { cn } from "@/lib/utils";

// Components
import Footer from "@/components/Footer/Footer";

export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const titleFont = Inknut_Antiqua({
	subsets: ["latin"],
	weight: ["400", "700", "900"],
	variable: "--title-font",
});

export const metadata: Metadata = {
	title: "IChess",
	description: "Um hub para os jogadores de xadrez do IC.",
	icons: [
		{
			media: "(prefers-color-scheme: dark)",
			url: "/images/favicon_dark.ico",
			href: "/images/favicon_dark.ico",
		},
		{
			media: "(prefers-color-scheme: light)",
			url: "/images/favicon.ico",
			href: "/images/favicon.ico",
		},
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen font-sans antialiased relative",
					fontSans.variable,
					titleFont.variable
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{/* <div vaul-drawer-wrapper=""> */}
					{children}
					{/* </div> */}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
