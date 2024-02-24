import Image from "next/image";

// Components
import JoinForm from "@/components/forms/JoinForm";
import { Suspense } from "react";

export default function JoinPage() {
	return (
		<main className="flex min-h-screen flex-col items-start justify-start">
			<div className="flex flex-col items-center justify-center relative pt-48 pb-28 px-wrapper w-full bg-board gap-4">
				<h1 className="font-title font-extrabold text-4xl lg:text-5xl lg:max-w-[50%] text-center">
					Formulário de Inscrição
				</h1>
				<h2 className="text-center font-semibold lg:max-w-[35%]">
					O projeto de extensão IChess está aberto e gostaríamos de
					saber um pouco mais sobre você!
				</h2>
			</div>
			<Suspense fallback={<p>testando...</p>}>
				<JoinForm />
			</Suspense>
		</main>
	);
}
