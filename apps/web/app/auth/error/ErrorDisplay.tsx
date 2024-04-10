"use client";

import { Panel } from "@/components/forms";
import { useQueryString } from "@/hooks/use-query-string";
import Link from "next/link";

export function ErrorDisplay() {
	const query = useQueryString().query;

	if (query.get("error") === "AuthorizedCallbackError") {
		return (
			<Panel showIcon type="warning">
				Eita! Pelo visto você não inseriu um e-mail institucional...
				<br />
				<strong>
					Para ingressar no IChess é necessário ser discente do IC.
				</strong>
				<br />
				Caso você não faça parte mas deseja se envolver em nossas
				atividades, confira os{" "}
				<Link
					className="underline hover:text-primary-100"
					href={`/events`}
				>
					Eventos abertos ao público
				</Link>
				!
			</Panel>
		);
	}

	return (
		<Panel showIcon type="error">
			Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.
		</Panel>
	);
}
