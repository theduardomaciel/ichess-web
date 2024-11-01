import { auth } from "@ichess/auth";

// Components
import JoinForm from "@/components/forms/JoinForm";

export default async function JoinPage() {
	const session = await auth();

	return (
		<main className="flex min-h-screen flex-col items-start justify-start">
			<div className="bg-vignette relative flex w-full flex-col items-center justify-center gap-4 px-wrapper pb-28 pt-48">
				<div className="bg-board absolute left-0 top-0 -z-10 h-full w-full" />
				<h1 className="text-center font-title text-4xl font-extrabold lg:max-w-[50%] lg:text-5xl">
					Formulário de Inscrição
				</h1>
				<h2 className="text-center font-semibold lg:max-w-[35%]">
					Cadastre-se para administrar eventos da SECOMP!
				</h2>
			</div>
			<JoinForm user={session?.user || undefined} />
		</main>
	);
}
