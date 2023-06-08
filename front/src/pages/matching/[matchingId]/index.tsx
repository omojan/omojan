import { useEffect, useState, useRef } from "react";
import AuthGuard from "@/components/guards/AuthGuard";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { MatchingInUsersAndHostAndRule } from "@/types/matchingType";
import { Avatar, Badge, Button, Card, Container, Grid, Loading, Spacer, Text, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { PlayerInUser } from "@/types/playerType";
import { MatchingInUsersAndGame } from "@/types/matchingType";

type Props = {
	mePlayer: PlayerInUser;
	matching: MatchingInUsersAndHostAndRule;
};

export default function MatchingRoom(props: Props) {
	const eventSourceRef = useRef<EventSource | null>(null);
	const router = useRouter();
	const [players, setPlayers] = useState<PlayerInUser[]>(props.matching.players);

	async function exit() {
		if (players.length === 1) {
			console.log("消去");
			await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}`, {
				method: "DELETE",
				credentials: "include",
			});
		} else {
			console.log("退出");
			await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/exit`, {
				method: "DELETE",
				credentials: "include",
			});
			// await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}/exit`, {
			// 	method: "PATCH",
			// 	credentials: "include",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// });
		}
	}
	// useEffect(() => {
	// 	function routeChange(url: string, { shallow }: { shallow: boolean }) {
	// 		console.log(url, shallow);
	// 	}

	// 	router.events.on("routeChangeStart", routeChange);
	// 	// router.events.on("routeChangeComplete", routeChange);
	// 	return () => {
	// 		router.events.off("routeChangeStart", routeChange);
	// 		// router.events.off("routeChangeComplete", routeChange);
	// 	};
	// }, [router]);

	useEffect(() => {
		eventSourceRef.current = new EventSource(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}/participant`,
			{
				withCredentials: true,
			}
		);
		eventSourceRef.current.onmessage = async ({ data }: MessageEvent) => {
			const eventData: MatchingInUsersAndGame = JSON.parse(data);
			// console.log(JSON.stringify(eventData.players) !== JSON.stringify(players))
			// console.log(eventData.players)
			// console.log(players)

			// console.log(players.length);
			// console.log(props.matching.game.rule.playerCount);
			if (JSON.stringify(eventData.players) !== JSON.stringify(players)) {
				//データに差分があれば
				setPlayers(eventData.players);
			}
			// console.log(props.matching.hostPlayer.id);
			// console.log(props.mePlayer.id);
			if (props.matching.hostPlayer.id === props.mePlayer.id) {
				//ホストのクライアントのみ実行する処理
				if (players.length === props.matching.game.rule.playerCount) {
					//満員になったら
					await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}/close`, {
						method: "PATCH",
						credentials: "include",
					});
				}
			}
			if (!eventData.isRecruiting) {
				//全員をゲームページへ移動
				router.replace(`/game/${eventData.game.id}`);
			}
		};
		// if(eventSourceRef.current.onerror = () => {exit()})
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
		};
	}, [players, eventSourceRef.current]);

	return (
		<>
			{/* <AuthGuard> */}
			<Container xs>
				<Card>
					<Card.Header>
						<Spacer />
						<Text size="$lg">参加者一覧</Text>
					</Card.Header>
					<Card.Divider />
					<Card.Body>
						<Text size="$2xl" weight="bold" css={{ d: "flex", justifyContent: "center" }}>
							{props.matching.name}
						</Text>

						<Spacer y={2} />
						<ul>
							{players.map((player, index) => (
								<li key={index}>
									<Grid.Container>
										<Grid css={{ d: "flex" }}>
											{player.id === props.mePlayer.id ? (
												<Badge size="xs" color="primary" content="あなた">
													<Avatar size="lg" src={player.user.image ?? ""}></Avatar>
												</Badge>
											) : (
												<Avatar size="lg" src={player.user.image ?? ""}></Avatar>
											)}
											<Spacer />
											<Text size="$xl" css={{ d: "flex", alignItems: "center" }}>
												{player.user.name}
											</Text>
										</Grid>
									</Grid.Container>
								</li>
							))}
						</ul>
						<Loading type="points" size="xl">
							<Text>
								{players.length - 1 === props.matching.game.rule.playerCount
									? "ゲームに接続しています"
									: "参加者を探しています"}
							</Text>
						</Loading>
					</Card.Body>
					<Card.Footer>
						<Spacer y={4} />
						<Tooltip content="ホストが抜けるか人数が0になったら部屋が消えます">
							<Link href="/matching">
								<Button rounded ghost className="mb-3" onPress={exit}>
									部屋一覧へ
								</Button>
							</Link>
						</Tooltip>
						<Spacer />
						<Link href="/">
							<Button rounded ghost className="mb-3" onPress={exit}>
								ホームへ
							</Button>
						</Link>
					</Card.Footer>
				</Card>
			</Container>
			{/* </AuthGuard> */}
		</>
	);
}

export async function getServerSideProps({ params, req }: GetServerSidePropsContext) {
	try {
		const meRes = await fetch(`${process.env.BACKEND_URL}/player/me`, {
			credentials: "include",
			headers: {
				Authorization: `Bearer ${req.cookies["next-auth.session-token"] ?? ""}`,
			},
		});
		const mePlayer: PlayerInUser = await meRes.json();
		const matchingRes = await fetch(`${process.env.BACKEND_URL}/matching/${params?.matchingId}`, {
			credentials: "include",
			headers: {
				Authorization: `Bearer ${req.cookies["next-auth.session-token"] ?? ""}`,
			},
		});
		const matching: MatchingInUsersAndHostAndRule = await matchingRes.json();
		return { props: { mePlayer, matching } };
	} catch (error) {
		console.log(error);
		return { props: {} };
	}
}
