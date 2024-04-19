interface Props {
	children: React.ReactNode;
}

export function Filters({ children }: Props) {
	return (
		<div className="flex w-full min-w-60 flex-col items-start justify-start gap-4 lg:w-[35%] lg:max-w-[17.5vw]">
			<div className="flex w-full flex-col items-start justify-start gap-9 rounded-lg bg-gray-400 p-6 ">
				<h6>Filtros</h6>
				{children}
			</div>
		</div>
	);
}
