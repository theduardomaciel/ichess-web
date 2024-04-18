import { Metadata } from "next";
import Link from "next/link";

// Icons
import IChessLogo from "@/public/logo.svg";

// Components
import { GoogleButton } from "../../../components/auth/SignInButton";

export const metadata: Metadata = {
	title: "Entrar no IChess",
};

export default function SignInPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const callbackUrl = searchParams.callbackUrl as string | undefined;

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
				<div className="flex flex-col items-center space-y-8">
					<IChessLogo />

					<div className="space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							IChess
						</h1>
					</div>
				</div>
				<GoogleButton callbackUrl={callbackUrl} />
				<p className="px-8 text-center text-sm leading-relaxed text-muted-foreground">
					Ao continuar, você concorda com os{" "}
					<a
						href={"/terms"}
						className="underline underline-offset-4 hover:text-primary"
					>
						Termos de Serviço
					</a>{" "}
					e a{" "}
					<Link
						href={"/privacy"}
						className="underline underline-offset-4 hover:text-primary"
					>
						Política de Privacidade
					</Link>
					.
				</p>
			</div>
		</div>
	);
}
