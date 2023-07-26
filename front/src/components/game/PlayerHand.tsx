import { CandidacyWord, MountGame } from "@/types/gameType";
import { Badge, Button, Grid, Popover } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
	game: MountGame;
	mePlayerId: string;
	word: string;
	candidacyWord: CandidacyWord;
	setCandidacyWord: Dispatch<SetStateAction<CandidacyWord>>;
};

export function PlayerHand(props: Props) {
	const isCurrent =
		props.game.rounds[props.game.rounds.length - 1].turns[
			props.game.rounds[props.game.rounds.length - 1].turns.length - 1
		].player.id === props.mePlayerId;
	const [isOpen, setIsOpen] = useState(false);

	function handleTop() {
		if (props.candidacyWord.word === props.word && props.candidacyWord.position === "top") {
			setIsOpen(false);
			//テキスト選択処理
		} else {
			props.setCandidacyWord({ word: props.word, position: "top" });
		}
	}
	function handleBottom() {
		if (props.candidacyWord.word === props.word && props.candidacyWord.position === "bottom") {
			setIsOpen(false);
		} else {
			props.setCandidacyWord({ word: props.word, position: "bottom" });
		}
	}

	return (
		<Popover
			placement="right-top"
			offset={16}
			isOpen={isOpen}
			onOpenChange={isCurrent ? setIsOpen : undefined}
		>
			<Popover.Trigger>
				<Badge
					isSquared
					disableOutline
					size={isOpen ? "md" : "sm"}
					css={
						isCurrent && isOpen
							? {
									cursor: "pointer",
									p: "6px 4px",
									writingMode: "vertical-rl",
									textOrientation: "upright",
									whiteSpace: "normal",
									h: "30vh",
									color: "$gray900",
									bgColor: "transparent",
									border: "1px solid $green400",
									transition: ".2s",
									boxShadow: " 0px 0px 12px #aaa",
									transform: "translate(0px, -24px)",
							  }
							: isCurrent
							? {
									cursor: "pointer",
									p: "6px 4px",
									writingMode: "vertical-rl",
									textOrientation: "upright",
									whiteSpace: "normal",
									h: "30vh",
									color: "$gray600",
									bgColor: "transparent",
									border: "1px solid $gray300",
									transition: ".2s",
									boxShadow: " 0px 0px 12px #ddd",
							  }
							: {
									cursor: "default",
									p: "6px 4px",
									writingMode: "vertical-rl",
									textOrientation: "upright",
									whiteSpace: "normal",
									h: "30vh",
									color: "$gray500",
									bgColor: "transparent",
									border: "1px solid $gray100",
									transition: ".2s",
									boxShadow: " 0px 0px 12px #eee",
							  }
					}
				>
					{props.word}
				</Badge>
			</Popover.Trigger>
			<Popover.Content

			// css={{ background: "transparent" }}
			>
				<Grid.Container css={{ gap: "$4 0", flexDirection: "column" }}>
					<Button size="sm" color="primary" auto rounded ghost onPress={handleTop}>
						上
					</Button>
					<Button size="sm" color="primary" auto rounded ghost onPress={handleBottom}>
						下
					</Button>
					{/* <Button.Group size='xs' vertical light shadow rounded  >
						<Button>前</Button>
						<Button>後</Button>
					</Button.Group> */}
				</Grid.Container>
			</Popover.Content>
		</Popover>
	);
}
