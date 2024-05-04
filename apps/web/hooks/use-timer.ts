import { useEffect, useState } from "react";

interface Props {
	timeInMs: number;
	autoStart?: boolean;
	autoReset?: boolean;
}

export function useTimer({
	autoReset = false,
	autoStart = false,
	timeInMs,
}: Props) {
	// For refresh support, we save the initial time in local storage

	const initialTime = localStorage.getItem("initialTime");

	const [time, setTime] = useState<number>(
		initialTime
			? timeInMs - (Date.now() - Number.parseInt(initialTime))
			: timeInMs,
	);

	const [isActive, setIsActive] = useState(autoStart);
	const [isReset, setIsReset] = useState(autoReset);

	useEffect(() => {
		if (autoStart) {
			start();
		}
	}, [autoStart]);

	useEffect(() => {
		if (autoReset) {
			reset();
		}
	}, [autoReset]);

	useEffect(() => {
		if (isReset) {
			reset();
		}
	}, [isReset]);

	useEffect(() => {
		if (isActive) {
			const interval = setInterval(() => {
				setTime((time) => time - 1000);
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [isActive]);

	useEffect(() => {
		if (time <= 0) {
			setIsActive(false);
		}
	}, [time]);

	function start() {
		setIsActive(true);
	}

	function stop() {
		setIsActive(false);
	}

	function reset() {
		setIsReset(false);
		setTime(timeInMs);
		localStorage.setItem("initialTime", Date.now().toString());
	}

	return { time, isActive, isReset, start, stop, reset };
}
