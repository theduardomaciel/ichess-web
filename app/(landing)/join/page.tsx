import Image from "next/image";

// Components
import JoinForm from "@/components/forms/JoinForm";

export default function JoinPage() {
	return (
		<main className="flex min-h-screen flex-col items-start justify-start">
			<div className="flex flex-col items-center justify-center relative pt-48 pb-28 px-wrapper w-full bg-background-300 gap-4">
				<h1 className="font-title font-extrabold text-4xl lg:text-5xl lg:max-w-[50%] text-center">
					Formulário de Inscrição
				</h1>
				<h2 className="text-center font-semibold lg:max-w-[35%]">
					O projeto de extensão IChess está aberto e gostaríamos de
					saber um pouco mais sobre você!
				</h2>
				<Image
					src={`/board.png`}
					priority
					width={2048}
					height={1024}
					className="opacity-5 absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none z-20"
					alt="Chess board for decoration"
				/>
			</div>
			<JoinForm />
		</main>
	);
}
