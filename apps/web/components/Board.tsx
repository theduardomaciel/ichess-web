"use client";

import { useEffect } from "react";

import Image from "next/image";
import VanillaTilt from "vanilla-tilt";

export default function BoardTilt() {
	useEffect(() => {
		const board = document.getElementById("board") as HTMLImageElement;
		VanillaTilt.init(board, {
			max: 7.5,
			speed: 400,
			glare: true,
			"max-glare": 0.5,
			gyroscope: true,
		});
	}, []);

	return (
		<div className="-z-10 order-3 flex translate-y-[15vh] scale-[1.35] select-none items-center justify-center max-md:w-full lg:order-1 lg:h-full lg:-translate-x-1/3 lg:translate-y-0">
			<Image
				id="board"
				src={`/board.svg`}
				width={1024}
				height={1024}
				alt="Chess board for decoration"
			/>
		</div>
	);
}
