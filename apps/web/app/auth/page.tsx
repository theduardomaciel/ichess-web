import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";

// Auth
import { auth, signOut } from "@ichess/auth";

export default async function AuthenticatedPage() {
	const session = await auth();
	const isAuthenticated = session && !!session.member?.role;

	async function signOutAction() {
		"use server";

		await signOut({
			redirectTo: "/",
		});
	}

	return (
		<form
			action={signOutAction}
			className="relative flex min-h-screen flex-col items-center justify-center"
		>
			<div className="mx-wrapper inline-flex max-w-md flex-col items-start justify-start gap-4 rounded-lg border border-gray-200 bg-gray-400 p-6">
				<div className="text-center text-lg font-bold text-neutral">
					👋 Olá, {session?.user.name}!
				</div>
				<div className="text-sm font-medium leading-tight text-muted">
					{isAuthenticated ? (
						<>
							Caso seu cargo não tenha sido atribuído, deslogue e logue novamente.
							<br />
							<br />
							Você está logado com: {session?.user.email}
						</>
					) : (
						<>
							Caso seu cargo não tenha sido atribuído, deslogue e logue novamente.
							<br />
							<br />
							Você está logado com: {session?.user.email}
						</>
					)}
				</div>
				<div className="inline-flex items-center justify-end gap-2.5 self-stretch">
					<Button variant={"outline"}>Deslogar</Button>
				</div>
			</div>
		</form>
	);
}
