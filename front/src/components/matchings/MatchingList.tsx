"use client";

import LoadingIcon from "@/components/util/LoadingIcon";
import { Matching } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MatchingList() {
	const router = useRouter();
	const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/list`, {
		withCredentials: true,
	});
	const [matchings, setMatchings] = useState<Matching[]>([]);

	async function join(matchingId: string) {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${matchingId}/join`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.status === 400) {
				throw new Error("満員です");
			}
			router.push(`matching/${matchingId}`);
		} catch (error) {
			throw new Error(`参加に失敗${error}`);
		}
	}

	useEffect(() => {
		// 登録したイベントリスナーの処理で使われるmatchingsはリスナー登録時のものとなる
		// マウント時のmatchingsを使い続けるため、正しく比較されない
		// matchings更新時に新しいリスナーを登録し、リスナーで使われるmatchingsを更新する

		eventSource.onmessage = ({ data }: MessageEvent) => {
			if (data !== JSON.stringify(matchings)) {
				const rooms: Matching[] = JSON.parse(data);
				setMatchings(rooms);
			}
		};

		return () => {
			eventSource.close();
		};
	}, [matchings]);

	// if (eventSource.readyState === 1) {
	// 	return <LoadingIcon />;
	// } else {
	if (matchings.length === 0) {
		// if(eventSource.readyState === 1) {
		return <LoadingIcon />;
		// }else {
		// return <p>募集している部屋がありません</p>;
		// }
	} else {
		return (
			<ul>
				{matchings.map((room, index) => (
					<li key={index}>
						<button
							className={room.isRecruiting ? 'bg-blue-300' : 'bg-red-300'}
							onClick={() => {
								join(room.id);
							}}
						>
							{room.id}
							{room.name}
						</button>
					</li>
				))}
			</ul>
		);
	}
	// }
}
