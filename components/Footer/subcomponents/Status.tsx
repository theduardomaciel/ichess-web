import { cn } from "@/lib/utils";

const STATUS = {
	OK: {
		color: "#0cc415",
		text: "Serviço em Operação",
	},
	MINOR: {
		color: "#ff8c00",
		text: "Serviço Parcialmente Degradado",
	},
	MAJOR: {
		color: "#ff8c00",
		text: "Serviço Parcialmente Degradado",
	},
	CRITICAL: {
		color: "#ff0000",
		text: "Serviço Fora do Ar",
	},
};

interface Incident {
	resolved: boolean;
	level: "MINOR" | "MAJOR" | "CRITICAL";
}

interface Project {
	name: string;
	incidents: Incident[];
}

interface StatusProps {
	className?: string;
}

export default async function Status({ className }: StatusProps) {
	const projects = await fetch(
		"https://theduardomaciel.vercel.app/api/status",
		{
			mode: "no-cors",
		}
	)
		.then((res) => res.json())
		.catch(() => null);

	if (!projects) return null;

	const ichess = projects.find(
		(project: Project) => project.name === "ichess-web"
	);

	const status =
		ichess && ichess.incidents && ichess.incidents.length > 0
			? STATUS[ichess.incidents[0].level as keyof typeof STATUS]
			: STATUS.OK;

	return (
		<a
			href={"https://theduardomaciel.vercel.app/status?utm_source=ichess"}
			target="_blank"
			className={cn(
				"flex flex-row items-center justify-center gap-x-3 px-3 py-2 transition w-full lg:w-fit outline outline-[0.75px] outline-transparent hover:bg-background-200 rounded-md font-medium",
				className
			)}
			title="Verifique o status de nossos serviços"
		>
			<div
				className="w-2 h-2 rounded-full"
				style={{
					backgroundColor: status.color,
				}}
			/>
			<p>{status.text}</p>
			<ExternalLinkIcon width={12} height={12} className="text-white" />
		</a>
	);
}

function ExternalLinkIcon({
	width,
	height,
	className,
}: {
	width: number;
	height: number;
	className: string;
}) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 15 15"
			fill="none"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
				fill={"currentColor"}
				fillRule="evenodd"
				clipRule="evenodd"
			></path>
		</svg>
	);
}
