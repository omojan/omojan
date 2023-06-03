import { useEffect, useState, useRef } from "react";
import AuthGuard from "@/components/guards/AuthGuard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Matching, User as UserType } from "@prisma/client";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { decode, getToken } from "next-auth/jwt";
import { useRouter } from "next/router";
// import { useRouter } from "next/navigation";
import { MatchingInPlayers, MatchingInPlayersAndRule } from "@/types/matchingType";
import { Avatar, Badge, Button, Card, Container, Grid, Loading, Spacer, Text, Tooltip, User } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Props = {
	meId: string | undefined;
	matching: MatchingInPlayersAndRule;
};

export default function MatchingRoom(props: Props) {
	// console.log(props);
	const eventSourceRef = useRef<EventSource | null>(null);
	const router = useRouter();
	const [players, setPlayers] = useState<UserType[]>(props.matching.players);

	async function exit() {
		if (players.length === 1) {
			await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}`, {
				method: "DELETE",
				credentials: "include",
			});
			return;
		} else {
			await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}/exit`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
	}
	useEffect(() => {
		function routeChange(url: string, { shallow }: { shallow: boolean }) {
			console.log(url, shallow);
			// if (shallow) {
			exit();
			// }
		}
		router.events.on("routeChangeStart", routeChange);
		return () => {
			router.events.off("routeChangeStart", routeChange);
		};
	}, [router]);

	useEffect(() => {
		eventSourceRef.current = new EventSource(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}/participant`,
			{
				withCredentials: true,
			}
		);
		// 登録したイベントリスナーの処理で使われるmatchingsはリスナー登録時のものとなる
		// マウント時のmatchingsを使い続けるため、正しく比較されない
		// matchings更新時に新しいリスナーを登録し、リスナーで使われるmatchingsを更新する

		eventSourceRef.current.onmessage = async ({ data }: MessageEvent) => {
			if (data !== JSON.stringify(players)) {
				const players: UserType[] = JSON.parse(data);
				setPlayers(players);
				if (players.length === props.matching.rule.playerCount) {
					await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${props.matching.id}/close`, {
						method: "PATCH",
						credentials: "include",
					});
					router.replace("/battle");
				}
			}
		};
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
		};
	}, [players, eventSourceRef.current]);

	return (
		<AuthGuard>
			<Container xs>
				<Card>
					<Card.Header>
						<Spacer />
						<Text size="$2xl" weight="bold" >
							参加者一覧
						</Text>
					</Card.Header>
					<Card.Divider />
					<Card.Body>
						<Spacer y={2} />
						<Loading type="points" size="xl">
							<Text>
								{players.length - 1 === props.matching.rule.playerCount
									? "ゲームに接続しています"
									: "参加者を探しています"}
							</Text>
						</Loading>
						<Spacer />
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
											<Spacer/>
											<Text size="$xl" css={{ d: "flex", alignItems: "center"}}>
												{player.name}
											</Text>
										</Grid>
									</Grid.Container>
								</li>
							))}
						</ul>
					</Card.Body>
					<Card.Footer>
						<Spacer y={4} />
						<Tooltip content="ホストが抜けるか人数が0になったら部屋が消えます">
							{/* <Button rounded ghost onPress={exit} css={{ m: "0 0 16px 32px" }}>
								退出
							</Button> */}
							<Link href="/matching">
								<Button rounded ghost className="mb-3">
									部屋一覧へ
								</Button>
							</Link>
						</Tooltip>
					</Card.Footer>
				</Card>
			</Container>
		</AuthGuard>
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
