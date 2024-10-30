import type { Metadata } from "next";

// Icons
import IChessLogo from "@/public/logo.svg";

// Components
import { ErrorDisplay } from "@/components/auth/ErrorDisplay";
import { ActionButton } from "@/components/auth/ActionButton";

export const metadata: Metadata = {
	title: "Acesso negado",
};

export default async function ErrorPage(
    props: {
        searchParams: Promise<{ [key: string]: string | undefined }>;
    }
) {
    const searchParams = await props.searchParams;
    return (
		<div className="relative flex min-h-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
				<div className="flex flex-col items-center space-y-8">
					<IChessLogo />

					<div className="space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Algo não está certo...
						</h1>

						{/* <p className="text-sm leading-relaxed text-muted-foreground">
							Parece que ocorreu um erro enquanto você tentava se
							autenticar.
						</p> */}

						<br />
						<ErrorDisplay />
					</div>
					<ActionButton error={searchParams.error} />
				</div>
			</div>
		</div>
	);
}
