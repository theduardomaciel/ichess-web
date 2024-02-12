"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Computer } from "lucide-react";

const ICONS = {
	light: <Sun className="h-3.5 w-3.5" />,
	dark: <Moon className="h-3.5 w-3.5" />,
	system: <Computer className="h-3.5 w-3.5" />,
};

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function ThemePicker() {
	const [mounted, setMounted] = useState(false);
	const { setTheme, theme } = useTheme();

	const changeTheme = React.useCallback(
		(theme: string) => {
			setTheme(theme);
		},
		[setTheme]
	);

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Select>
				<SelectTrigger className="w-[125px] border-black dark:border-muted relative py-1.5 pl-9">
					<SelectValue />
				</SelectTrigger>
			</Select>
		);
	}

	return (
		<Select value={theme} onValueChange={changeTheme}>
			<SelectTrigger className="w-[125px] border-black dark:border-muted relative py-1.5 pl-9">
				<span className="absolute left-3 flex items-center justify-center">
					{ICONS[theme as keyof typeof ICONS]}
				</span>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="light">Claro</SelectItem>
				<SelectItem value="dark">Escuro</SelectItem>
				<SelectItem value="system">Sistema</SelectItem>
			</SelectContent>
		</Select>
	);
}
