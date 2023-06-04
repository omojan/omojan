import { useEffect, useState, useRef } from "react";
import AuthGuard from "@/components/guards/AuthGuard";
import { User as UserType } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { decode } from "next-auth/jwt";
import { useRouter } from "next/router";
import { MatchingInPlayersAndGame, MatchingInPlayersAndRule } from "@/types/matchingType";
import { Avatar, Badge, Button, Card, Container, Grid, Loading, Spacer, Text, Tooltip } from "@nextui-org/react";
import Link from "next/link";

type Props = {
	meId: string | undefined;
	matching: MatchingInPlayersAndRule;
};

export default function MatchingRoom(props: Props) {
	const eventSourceRef = useRef<EventSource | null>(null);
	const router = useRouter();
	const [players, setPlayers] = useState<UserType[]>(props.matching.players);

	async function exit() {
		if (players.length === 1) {
			console.log("消去");
			await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}`, {
				method: "DELETE",
				credentials: "include",
			});
		} else {
			console.log("退出");
			await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}/exit`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
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
			const eventData: MatchingInPlayersAndGame = JSON.parse(data);
			console.log(eventData.players)
			console.log(players)
			if (eventData.players !== players) {
			// if (data !== JSON.stringify(players)) {
				//データに差分があれば
				setPlayers(eventData.players);
			}
			if (props.matching.hostUser.id === props.meId ) {
				//ホストのクライアントのみ実行する処理
				if( players.length === props.matching.rule.playerCount){
					//満員になったら
					await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}/close`, {
						method: "PATCH",
						credentials: "include",
					});
				}
			}
			if(eventData.game) {
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
											{player.id === props.meId ? (
												<Badge size="xs" color="primary" content="あなた">
													<Avatar size="lg" src={player.image ?? ""}></Avatar>
												</Badge>
											) : (
												<Avatar size="lg" src={player.image ?? ""}></Avatar>
											)}
											<Spacer />
											<Text size="$xl" css={{ d: "flex", alignItems: "center" }}>
												{player.name}
											</Text>
										</Grid>
									</Grid.Container>
								</li>
							))}
						</ul>
						<Loading type="points" size="xl">
							<Text>
								{players.length - 1 === props.matching.rule.playerCount
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
		const decodeResult = await decode({
			token: req.cookies["next-auth.session-token"],
			secret: process.env.NEXTAUTH_SECRET ?? "",
		});
		const res = await fetch(`${process.env.BACKEND_URL}/matching/${params?.matchingId}`, {
			credentials: "include",
			headers: {
				Authorization: `Bearer ${req.cookies["next-auth.session-token"] ?? ""}`,
			},
		});
		const matching: MatchingInPlayersAndRule = await res.json();
		return { props: { meId: decodeResult?.sub, matching } };
	} catch (error) {
		console.log(error);
		return { props: {} };
	}
}
