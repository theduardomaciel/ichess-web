
export interface EventProps {
	title?: string;
	description?: string;
	date?: string;
	url?: string;
	state: "error" | "not-logged" | "join" | "joining" | "read-only"; //ajeitar isso
}
