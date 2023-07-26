import { MountGame } from "@/types/gameType";
import { PlayerInUserAndWords } from "@/types/playerType";
import {
	Avatar,
	Badge,
	Button,
	Card,
	Grid,
	Progress,
	Text,
	Tooltip,
	User,
} from "@nextui-org/react";

type Props = {
	game: MountGame;
	player: PlayerInUserAndWords;
	mePlayerId: string;
	index: number;
};

export default function PlayerStatus(props: Props) {
	const currentRound = props.game.rounds[props.game.rounds.length - 1];
	const currentTurn = currentRound.turns[currentRound.turns.length - 1];
	const currentPlayer = currentTurn.player;
	const isCurrentPlayer = currentPlayer.id === props.player.id;
	const createTextObject =
		currentRound.turns[
			currentRound.orderPlayers.findIndex((player) => player.id === props.player.id)
		]?.text;
	// console.log(currentRound.turns[0].text);
	// console.log(createTextObject);
	const createText = createTextObject
		? createTextObject.backWord ??
		  "" + createTextObject.parentWord ??
		  "" + createTextObject.frontWord ??
		  ""
		: "";
	console.log(createText);

	// createTextObject?.backWord ??
	// "" + createTextObject?.parentWord ??
	// "" + createTextObject?.frontWord ??
	// "";
	return (
		<Grid xs={6} direction="column">
			<Badge
				size="md"
				placement="top-left"
				horizontalOffset="45%"
				color={isCurrentPlayer ? "success" : "default"}
				// color={props.index === 0 ? "success" : "default"}
				variant={isCurrentPlayer ? "bordered" : "flat"}
				// variant={props.index === 0 ? "bordered" : "flat"}
				content={props.index + 1}
			>
				<Card
					variant={isCurrentPlayer ? "bordered" : "shadow"}
					borderWeight="normal"
					css={{ borderColor: "$success", overflow: "visible" }}
					// css={{
					// 	borderColor: "$success",
					// 	overflow: "visible",
					// 	position: "relative",
					// 	ov: "visible",
					// 	pointerEvents: "none",
					// }}
				>
					<Badge
						size="xs"
						placement="top-left"
						content="あなた"
						// color='success'
						// variant='flat'
						horizontalOffset="12px"
						isInvisible={props.player.id !== props.mePlayerId}
					>
						<Card.Header>
							<Avatar size="xs" src={props.player.user.image ?? ""} css={{ mr: 8 }} />
							{/* <Avatar size="sm" src={props.player.user.image ?? ""} css={{ mr: 8 }} color='success' bordered={props.player.id == props.mePlayerId} /> */}
							<Text
								size="$xs"
								css={{
									fontSize: ".8rem",
									overflowWrap: "break-word",
									whiteSpace: "normal",
									maxW: "calc(100% - 36px)",
									lineHeight: ".8rem",
								}}
							>
								{props.player.user.name}
							</Text>
						</Card.Header>
					</Badge>
					<Card.Body css={{ pt: 0, pb: 0 }}>
						<Text
							b
							css={{ mb: 8, fontSize: ".8rem", lineHeight: ".7rem", overflowWrap: "break-word" }}
						>
							{/* {`${props.game.parentWords[props.game.rounds.length - 1]}${props.player.words[0]}`} */}
							{createText}
						</Text>
						<Progress
							size="xs"
							color="success"
							striped
							status="success"
							value={1}
							max={props.game.rule.roundCount}
						/>
					</Card.Body>
				</Card>
			</Badge>
		</Grid>
	);
}
