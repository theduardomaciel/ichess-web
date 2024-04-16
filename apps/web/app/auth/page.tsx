export default function AuthenticatedPage() {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center">
			<div className="inline-flex h-56 w-96 flex-col items-start justify-start gap-4 rounded-lg border border-stone-700 bg-stone-800 p-6">
				<div className="text-center font-['Manrope'] text-lg font-bold text-white">
					👋 Olá, Eduardo Maciel!
				</div>
				<div className="self-stretch font-['Manrope'] text-sm font-medium leading-tight text-zinc-300">
					Você já pode visualizar seus dados pessoais, marcar presença
					em eventos e realizar todas as atividades de um membro do
					IChess! <br />
					<br />
					Você está logado com: ema2@ic.ufal.br
				</div>
				<div className="inline-flex items-center justify-end gap-2.5 self-stretch">
					<div className="inline-flex flex-col items-center justify-center gap-2.5 rounded-lg">
						<div className="inline-flex items-center justify-center gap-4 self-stretch rounded-md border border-zinc-300 px-4 py-2 shadow">
							<div className="font-['Manrope'] text-base font-semibold tracking-tight text-white">
								Deslogar
							</div>
						</div>
					</div>
					<div className="inline-flex flex-col items-center justify-center gap-2.5 rounded-lg">
						<div className="inline-flex items-center justify-center gap-4 self-stretch rounded-md bg-lime-500 px-4 py-2 shadow">
							<div className="font-['Manrope'] text-base font-semibold tracking-tight text-white">
								Ver meu perfil
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
