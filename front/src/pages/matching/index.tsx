import AuthGuard from "@/components/guards/AuthGuard";
import { MatchingInPlayers } from "@/types/matchingType";
import { Badge, Button, Card, Col, Container, Row, Spacer, Table, Text, User } from "@nextui-org/react";
import { Matching } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";


type Props = {
	matchings: MatchingInPlayers[];
};

export default function Matching(props: Props) {
	const eventSourceRef = useRef<EventSource | null>(null);

	const router = useRouter();
	const [matchings, setMatchings] = useState(props.matchings);

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
			router.replace(`matching/${matchingId}`);
		} catch (error) {
			throw new Error(`参加に失敗${error}`);
		}
	}

	useEffect(() => {
		eventSourceRef.current = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching/list`, {
			withCredentials: true,
		});
		eventSourceRef.current.onmessage = async ({ data }: MessageEvent) => {
			if (data !== JSON.stringify(matchings)) {
				const rooms: MatchingInPlayers[] = JSON.parse(data);
				// const rooms:  MatchingInPlayers[] = JSON.parse(data);
				setMatchings(rooms);
			}
		};
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
		};
	}, [matchings]);

	return (
		<AuthGuard>
			<Container md>
				<Card>
					{matchings.length === 0 ? (
						<Card.Header>
							<Text size="$2xl" weight="bold" css={{ d: "flex", w: "100%", justifyContent: "center" }}>
								募集している部屋がありません
							</Text>
						</Card.Header>
					) : (
						<>
							<Card.Header>
								<Text
									size="$2xl"
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
													<Badge
														variant="dot"
														color={room.isRecruiting ? "success" : "warning"}
													/>
													<Spacer/>
													<Button
														auto
														rounded
														size="sm"
														disabled={!room.isRecruiting}
														onClick={() => {
															join(room.id);
														}}
													>
														参加する
													</Button>
												</Table.Cell>
												<Table.Cell>
													<Text>{room.name}</Text>
												</Table.Cell>
												<Table.Cell>
													{room.players.map((player, index) => (
														<User
															key={index}
															src={player.image ?? ""}
															name={player.name}
															size="sm"
															squared
														/>
													))}
												</Table.Cell>
											</Table.Row>
										))}
									</Table.Body>
								</Table>
							</Card.Body>
						</>
					)}
					<Card.Footer >
					<Spacer y={4} />

						<Link href="/">
							<Button ghost rounded >
								ホームへ戻る
							</Button>
						</Link>
					</Card.Footer>
				</Card>
			</Container>
		</AuthGuard>
	);
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
	try {
		const res = await fetch(`${process.env.BACKEND_URL}/matching`, {
			credentials: "include",
			headers: {
				Authorization: `Bearer ${req.cookies["next-auth.session-token"] ?? ""}`,
			},
		});
		const matchings: MatchingInPlayers[] = await res.json();
		return { props: { matchings } };
	} catch (error) {
		console.log(error);
		return { props: { matchings: [] } };
	}
}
