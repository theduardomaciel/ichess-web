"use client";

import { Panel, type PanelProps } from "@/components/forms";
import { useQueryString } from "@/hooks/use-query-string";
import Link from "next/link";

interface Error {
	type: PanelProps["type"];
	content: React.ReactNode;
}

const ERRORS: { [key: string]: Error } = {
	AuthorizedCallbackError: {
		type: "info",
		content: (
			<>
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
			</>
		),
	},
	PermissionLevelError: {
		type: "error",
		content: (
			<>
				Você não possui permissão para acessar essa página.
				<br />
				<strong>
					Se você acredita que isso é um erro, entre em contato com a
					administração.
				</strong>
			</>
		),
	},
	NotAuthenticated: {
		type: "error",
		content: (
			<>
				Somente <strong>membros cadastrados no IChess</strong> podem
				acessar essa página.
			</>
		),
	},
	default: {
		type: "error",
		content: (
			<>
				Ocorreu um erro inesperado. Por favor, tente novamente mais
				tarde.
			</>
		),
	},
};

export function ErrorDisplay() {
	const error = useQueryString().query.get("error");
	const { type, content } =
		ERRORS[error as keyof typeof ERRORS] || ERRORS.default;

	return (
		<Panel
			className="text-left text-sm leading-relaxed text-muted-foreground"
			type={type}
			showIcon
		>
			{content}
		</Panel>
	);
}
