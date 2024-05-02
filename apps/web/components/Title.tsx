export function Title() {
	return (
		<div className="flex flex-col items-start justify-center z-20">
			<h2 className="text-neutral text-xl lg:text-2xl font-bold leading-tight lg:leading-tight font-title z-30">
				CONHEÇA O
			</h2>
			<div className="flex flex-col items-center justify-center text-neutral relative">
				<p className="absolute top-[200%] left-0 font-title font-black text-[56px] lg:text-9xl -z-10 select-none text-transparent font-outline-2 leading-tight lg:leading-tight">
					ICHESS
				</p>
				<p className="absolute top-[100%] left-0 font-title font-black text-[56px] lg:text-9xl -z-10 select-none text-transparent font-outline-1 leading-tight lg:leading-tight">
					ICHESS
				</p>
				<h1 className="font-title font-black text-neutral text-[56px] lg:text-9xl leading-tight lg:leading-tight">
					ICHESS
				</h1>
				<p className="absolute bottom-[100%] left-0 font-title font-black text-[56px] lg:text-9xl -z-10 select-none text-transparent font-outline-1 leading-tight lg:leading-tight">
					ICHESS
				</p>
				<p className="absolute bottom-[200%] left-0 font-title font-black text-[56px] lg:text-9xl -z-10 select-none text-transparent font-outline-2 leading-tight lg:leading-tight">
					ICHESS
				</p>
			</div>
			<p className="text-neutral text-lg lg:text-2xl font-medium leading-snug lg:max-w-[70%] z-30">
				O grupo de extensão de xadrez do Instituto de Computação da UFAL.
			</p>
		</div>
	);
}
