"use client";

import { MatchingIdResponseType } from "@/types/matchingType";
import { useRouter } from "next/navigation";

export default function CreateMatchingButton() {
	const router = useRouter();

	async function createMatching() {
		try{

			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: "誰でも歓迎",
					timeLimit: 30,
					playerCount: 4,
					turnCount: 4,
					password: "",
				}),
			});
			const result = await res.json()
			router.push(`/matching/${result.matchingId}`);
		}catch(error){
			throw new Error('部屋の作成に失敗しました')
		}
	}
	return <button onClick={createMatching}>部屋作成</button>;
}
