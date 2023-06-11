import AuthGuard from "@/components/guards/AuthGuard";
import { MatchingInUsersAndHostAndRule } from "@/types/matchingType";
import {
	Badge,
	Button,
	Card,
	Container,
	Modal,
	Spacer,
	Table,
	Text,
	User,
	useModal,
} from "@nextui-org/react";
import { Matching } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

type Props = {
	matchings: MatchingInUsersAndHostAndRule[];
};
export default function Matching(props: Props) {
	const eventSourceRef = useRef<EventSource | null>(null);
	const router = useRouter();
	const [matchings, setMatchings] = useState(props.matchings);
	const { setVisible, bindings } = useModal();

	async function join(matchingId: string, playersLength: number, playerCount: number) {
		if (playersLength >= playerCount) {
			setVisible(true);
		} else {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/${matchingId}/join`,
					{
						method: "PATCH",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				if (res.status === 400) {
					throw new Error("満員です");
				}
				router.replace(`/matching/${matchingId}`);
			} catch (error) {
				throw new Error(`参加に失敗${error}`);
			}
		}
	}

	useEffect(() => {
		eventSourceRef.current = new EventSource(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/list`,
			{
				withCredentials: true,
			}
		);
		eventSourceRef.current.onmessage = async ({ data }: MessageEvent<string>) => {
			if (data !== JSON.stringify(matchings)) {
				const rooms: MatchingInUsersAndHostAndRule[] = JSON.parse(data);
				setMatchings(rooms);
			}
		};
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
		};
	}, [matchings, eventSourceRef.current]);

	if (matchings.length === 0) {
		return (
			<>
				{/* <AuthGuard> */}
				<Container xs>
					<Link href="/">
						<Button auto rounded ghost>
							ホームへ戻る
						</Button>
					</Link>
					<Spacer />
					<Card>
						<Card.Body>
							<Text css={{ textAlign: "center" }}>募集している部屋がありません</Text>
						</Card.Body>
					</Card>
				</Container>
				{/* </AuthGuard> */}
			</>
		);
	} else {
		return (
			<>
				{/* <AuthGuard> */}
				<Container sm>
					<Link href="/">
						<Button auto ghost rounded>
							ホームへ戻る
						</Button>
					</Link>
					<Spacer />
					<Card>
						<Card.Header>
							<Text
								size="$xl"
								weight="bold"
								css={{ d: "flex", w: "100%", justifyContent: "center" }}
							>
								部屋一覧
							</Text>
						</Card.Header>
						<Card.Body>
							<Table aria-label="部屋一覧" shadow={false}>
								<Table.Header>
									<Table.Column width={240}>状態</Table.Column>
									<Table.Column>部屋名</Table.Column>
									<Table.Column>参加者</Table.Column>
								</Table.Header>
								<Table.Body>
									{matchings.map((room, index) => (
										<Table.Row key={index}>
											<Table.Cell css={{ d: "flex", alignItems: "center" }}>
												<Badge variant="dot" color={room.isRecruiting ? "success" : "warning"} />
												<Spacer />
												<Button
													auto
													rounded
													size="sm"
													disabled={!room.isRecruiting}
													onPress={() => {
														join(room.id, room.players.length, room.game.rule.playerCount);
													}}
												>
													参加する
												</Button>
											</Table.Cell>
											<Table.Cell>
												<Text>{room.name}</Text>
											</Table.Cell>
											<Table.Cell css={{ flexWrap: "wrap" }}>
												{room.players.map((player, index) => (
													<User
														key={index}
														src={player.user.image ?? ""}
														name={player.user.name ?? player.user.email}
														size="sm"
														// squared
													/>
												))}
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table>
						</Card.Body>
					</Card>
				</Container>
				<Modal closeButton {...bindings}>
					<Modal.Body>
						<Spacer />
						<Text size="$xl" color="error" css={{ d: "flex", justifyContent: "center" }}>
							この部屋は満員です
						</Text>
						<Spacer />
					</Modal.Body>
				</Modal>
				{/* </AuthGuard> */}
			</>
		);
	}
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
	try {
		const res = await fetch(`${process.env.BACKEND_URL}/matching`, {
			credentials: "include",
			headers: {
				Authorization: `Bearer ${req.cookies["next-auth.session-token"] ?? ""}`,
			},
		});
		const matchings: MatchingInUsersAndHostAndRule[] = await res.json();
		return { props: { matchings } };
	} catch (error) {
		console.log(error);
		return { props: { matchings: [] } };
	}
}
