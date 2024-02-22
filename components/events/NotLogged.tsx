import { GoogleLoginButton } from "../GoogleLogin";

export function NotLogged() {
	return (
		<div className="flex justify-center items-center flex-wrap gap-3 w-10/12 p-6 m-auto border-4 border-dashed border-[#3b432b] rounded mt-10">
			<span className="font-title font-bold">Eita!</span>
			<span className="text-s flex-1">
				Para acessar os eventos internos você precisa ser membro
				integrante do IChess :( Caso você seja parte do IC, e tem
				interesse em participar,{" "}
				<a className="underline text-[#83b352]">ingresse já</a> no
				projeto!
			</span>
			<div>
				<GoogleLoginButton />
			</div>
		</div>
	);
}