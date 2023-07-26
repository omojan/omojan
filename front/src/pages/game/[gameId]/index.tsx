// import { UpdateGame } from "@/types/gameType";
import PlayerStatus from "@/components/game/PlayerStatus";
import { CandidacyWord, MountGame, UpdateGameState } from "@/types/gameType";
import { PlayerInUserAndWords } from "@/types/playerType";
import {
	Avatar,
	Badge,
	Container,
	Grid,
	Loading,
} from "@nextui-org/react";
// import { Game } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { useEffect, useRef, useState } from "react";
import { useHostGuard } from "@/hooks/useHostGuard";
import { useCountDown } from "@/hooks/useCountDown";
import { CountCircle } from "@/components/game/CountCircle";
import { PlayerHand } from "@/components/game/PlayerHand";
import Header from "@/components/util/Header";
import  GameHeader  from "@/components/util/GameHeader";

type Props = {
	mePlayer: PlayerInUserAndWords;
	game: MountGame;
};
export default function Game(props: Props) {
	// console.log(props.mePlayer);
	// console.log(props);
	// console.log(props.game.id);
	const eventSourceRef = useRef<EventSource | null>(null);
	const [game, setGame] = useState<MountGame>(props.game);
	const [mePlayer, setMePlayer] = useState<PlayerInUserAndWords>(props.mePlayer);
	const [candidacyWord, setCandidacyWord] = useState<CandidacyWord>({ word: "", position: "top" });

	const { hostGuard } = useHostGuard();
	const { count, setCount } = useCountDown(props.game.rule.timeLimit);

	useEffect(() => {
		// if (props.mePlayer.id === props.game.matching.hostPlayer.id) {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/game/${game.id}/join`, {
			method: "PATCH",
			credentials: "include",
		});
		// }
	}, []);

	useEffect(() => {
		if(!count) {

		}
	}, [count])

	useEffect(() => {
		eventSourceRef.current = new EventSource(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/game/${props.game.id}/state`,
			{
				withCredentials: true,
			}
		);
		eventSourceRef.current.onmessage = async ({ data }: MessageEvent) => {
			const eventData: UpdateGameState = JSON.parse(data);
			// console.log(eventData.mePlayer);
			// console.log(eventData.game.scene);
			if (game.scene === "RECRUITING" && eventData.game.scene === "OPENING") {
				//全員集まったら初期化
				await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/game/${game.id}/init`, {
					method: "PATCH",
					credentials: "include",
				});
				// if (game.matching.hostPlayer.id === props.mePlayer.id) {
				// 	//ホストのクライアントのみ実行する処理
				// 	await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/game/${game.id}/round`, {
				// 		method: "PATCH",
				// 		credentials: "include",
				// 	});
				// }
			}
			if (
				JSON.stringify(game.players) !== JSON.stringify(eventData.game.players) ||
				JSON.stringify(game.rounds) !== JSON.stringify(eventData.game.rounds) ||
				JSON.stringify(game.scene) !== JSON.stringify(eventData.game.scene)
			) {
				//Gameデータに差分があれば
				if (game.matching.hostPlayer.id === props.mePlayer.id) {
					//ホストのクライアントのみ実行する処理
					// fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/game/${game.id}/round`, {
					// 	method: "PATCH",
					// 	credentials: "include",
					// });
				}
				//ラウンドが進んだら
				if (game.rounds.length !== eventData.game.rounds.length) {
					setCount(props.game.rule.timeLimit);
				}
				setGame((prev) => ({
					...prev,
					players: eventData.game.players,
					scene: eventData.game.scene,
					rounds: eventData.game.rounds,
					parentWords: eventData.game.parentWords,
				}));
				// console.log(game.scene);
			}
			//Meデータに差分があれば
			if (JSON.stringify(mePlayer) !== JSON.stringify(eventData.mePlayer)) {
				setMePlayer(eventData.mePlayer);
			}
			// console.log(game);
		};
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
		};
	}, [game, mePlayer, eventSourceRef.current]);

	// console.log(game.rounds.length - 1);
	// console.log(game.parentWords[game.rounds.length - 1]);
	if (game.scene === "RECRUITING") {
		return (
			<>
				<Header />
				<Grid.Container justify="center">
					<Grid xs={12} md={6} justify="center">
						<Loading type="points" size="lg">
							ゲームに接続中です
						</Loading>
					</Grid>
				</Grid.Container>
			</>
		);
	} else if (game.scene === "OPENING") {
		return (
			<>
				<Header />
				<Grid.Container justify="center">
					<Grid xs={12} md={6} justify="center">
						<Loading type="points" size="lg">
							OPENING
						</Loading>
					</Grid>
				</Grid.Container>
			</>
		);
	} else {
		return (
			<>
				<GameHeader />
				<Container xs css={{ h: "100%" }}>
					<Grid.Container css={{ h: "100%" }}>
						<Grid xs={12}>
							<Grid.Container gap={1} css={{ h: "fit-content" }}>
								{game.rounds[game.rounds.length -1].orderPlayers.map((player, index) => (
								// {game.players.map((player, index) => (
									<PlayerStatus
										key={index}
										mePlayerId={mePlayer.id}
										game={game}
										player={player}
										index={index}
									/>
								))}
							</Grid.Container>
						</Grid>
						{/* <Spacer /> */}
						<Grid xs={12} justify="center">
							<Badge
								placement="top-left"
								// content={<Text small >あなたの番です</Text>}
								content="あなたの番です"
								horizontalOffset="50%"
								verticalOffset="-24px"
								isSquared
								variant="flat"
								color="success"
								isInvisible={
									game.rounds[game.rounds.length - 1].turns[
										game.rounds[game.rounds.length - 1].turns.length - 1
									].player.id !== mePlayer.id
								}
								css={{ bg: "transparent" }}
							>
								{/* <Tooltip
								content={<Text small>あなたの番です</Text>}
								visible={
									game.rounds[game.rounds.length - 1].turns[
										game.rounds[game.rounds.length - 1].turns.length - 1
									].player.id === mePlayer.id
								}
							> */}

								<CountCircle
									color="#17C964"
									r={23}
									strokeWidth={3}
									maxValue={props.game.rule.timeLimit}
									// value={20}
									value={count}
								/>

								<Avatar
									src={
										game.players.find(
											(player) =>
												game.rounds[game.rounds.length - 1].turns[
													game.rounds[game.rounds.length - 1].turns.length - 1
												].player.id === player.id
										)?.user.image ?? ""
									}
									color="success"
								/>
								{/* </Tooltip> */}
							</Badge>
						</Grid>
						<Grid xs={12} direction="column" alignItems="center">
							{candidacyWord.position === "top" && candidacyWord.word ? (
								<Badge size="lg" color="primary" variant="flat" isSquared>
									{candidacyWord.word}
								</Badge>
							) : (
								""
							)}
							<Badge size="lg" color="primary" variant="flat" isSquared>
								{game.parentWords[game.rounds.length - 1]}
							</Badge>
							{candidacyWord.position === "bottom" && candidacyWord.word ? (
								<Badge size="lg" color="primary" variant="flat" isSquared>
									{candidacyWord.word}
								</Badge>
							) : (
								""
							)}
						</Grid>
						<Grid xs={12} direction="row" justify="space-between" css={{ mt: "auto" }}>
							{mePlayer.words.map((word, index) => (
								<PlayerHand
									game={game}
									mePlayerId={mePlayer.id}
									word={word}
									key={index}
									candidacyWord={candidacyWord}
									setCandidacyWord={setCandidacyWord}
								/>
							))}
						</Grid>
					</Grid.Container>
				</Container>
			</>
		);
	}
}

export async function getServerSideProps({ params, req }: GetServerSidePropsContext) {
	try {
		const meRes = await fetch(`${process.env.BACKEND_URL}/player/me`, {
			credentials: "include",
			headers: {
				Authorization: `Bearer ${req.cookies["next-auth.session-token"] ?? ""}`,
			},
		});
		const mePlayer: PlayerInUserAndWords = await meRes.json();
		const gameRes = await fetch(`${process.env.BACKEND_URL}/game/${params?.gameId}`, {
			credentials: "include",
			headers: {
				Authorization: `Bearer ${req.cookies["next-auth.session-token"] ?? ""}`,
			},
		});
		const game: MountGame = await gameRes.json();
		return { props: { mePlayer, game } };
	} catch (error) {
		console.log(error);
		return { props: {} };
	}
}
