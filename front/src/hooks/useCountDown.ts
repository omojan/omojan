import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useCountDown(timeLimit: number) {
	const [count, setCount] = useState(timeLimit);

	useEffect(() => {
		const countDownInterval = setInterval(() => {
			if (count === 0) {
				clearInterval(countDownInterval);
			}
			if (count > 0) {
				setCount((prev) => prev - 1);
			}
		}, 1000);
        return () => {
            clearInterval(countDownInterval)
        }
	}, [count]);

	// function countDown(count: number, setCount: Dispatch<SetStateAction<number>>) {}

	return {count, setCount};
}
