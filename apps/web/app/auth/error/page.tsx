import { Metadata } from "next";
import Link from "next/link";

// Icons
import IChessLogo from "@/public/logo.svg";
import { ArrowRight } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "./ErrorDisplay";

export const metadata: Metadata = {
	title: "Acesso negado",
};

export default function ErrorPage() {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full max-w-[500px] flex-col justify-center space-y-6">
				<div className="flex flex-col items-center space-y-8">
					<IChessLogo />

					<div className="space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Acesso negado!
						</h1>

						<p className="text-sm leading-relaxed text-muted-foreground">
							Parece que ocorreu um erro enquanto você tentava se
							autenticar.
						</p>

						<br />
						<ErrorDisplay />
					</div>
					<Button
						asChild
						variant="outline"
						type="button"
						className="w-full"
					>
						<Link href="/auth/sign-in">
							Tentar novamente
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
