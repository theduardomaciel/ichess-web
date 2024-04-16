import { useId } from "react";
import Link from "next/link";

// Icons
import ErrorFaceIcon from "@/public/icons/error_face.svg";

interface Props {
	hasFilters?: boolean;
}

export function Empty({ hasFilters = false }: Props) {
	return (
		<div className="inline-flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-primary-200/50 px-8 py-16">
			<ErrorFaceIcon />
			<p className="text-center font-title text-base font-bold text-neutral">
				Parece que não encontramos nada com base em sua pesquisa e
				filtros :(
			</p>
			<p className="text-center text-sm font-normal text-neutral sm:w-[50%]">
				Tente procurar por algo com outras palavras, ou remover alguns
				filtros pra ver se você acha dessa vez!
			</p>
			{hasFilters && <EmptyCleanFilters />}
		</div>
	);
}

export function EmptyCleanFilters() {
	const randomId = useId();

	return (
		<Link
			href={`/dashboard/events?r=${randomId}`}
			className="text-tertiary-200 underline"
		>
			Limpar filtros
		</Link>
	);
}