"use client";
import { Matching, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
	matching: Matching;
};

export default function ParticipantList(props: Props) {
	const router = useRouter();
	const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/participant`, {
		withCredentials: true,
	});
	const [players, setPlayers] = useState<User[]>([]);

	async function exit() {
		if (players.length === 1) {
			await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}`, {
				method: "DELETE",
				credentials: "include",
			});
			await router.replace("/matching");
			return;
		}
		await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}/exit`, {
			method: "PATCH",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});
		router.replace("/matching");
	}

	useEffect(() => {
		// 登録したイベントリスナーの処理で使われるmatchingsはリスナー登録時のものとなる
		// マウント時のmatchingsを使い続けるため、正しく比較されない
		// matchings更新時に新しいリスナーを登録し、リスナーで使われるmatchingsを更新する

		eventSource.onmessage = ({ data }: MessageEvent) => {
			(async () => {

				if (data !== JSON.stringify(players)) {
					const players: User[] = JSON.parse(data);
					setPlayers(players);
					if (players.length === props.matching.playerCount) {
						await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}/end`, {
							method: "PATCH",
							credentials: "include",
						});
						router.push('/battle')
					}
				}
			})()
		};
		return () => {
			eventSource.close();
			// exit(props.matching.id);
		};
	}, [players]);

	return (
		<>
			<ul>
				{players.map((player, index) => (
					<li key={index}>{player.email}</li>
				))}
			</ul>
			<button onClick={exit}>退出</button>
		</>
	);
}
