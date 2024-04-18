import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isDateDifferent = (date1: Date, date2: Date) => {
	return (
		date1.getDate() !== date2.getDate() ||
		date1.getMonth() !== date2.getMonth() ||
		date1.getFullYear() !== date2.getFullYear()
	);
};

export const wait = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
export const waitRandom = (min: number, max: number) =>
	wait(Math.floor(Math.random() * (max - min + 1) + min));
