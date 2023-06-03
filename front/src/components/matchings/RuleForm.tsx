import { MatchingOptionType } from "@/types/matchingType";
import {
	Dropdown,
	Input,
	Progress,
	Radio,
	Spacer,
	Switch,
	Text,
	Row,
	Col,
	Grid,
	FormElement,
	Loading,
} from "@nextui-org/react";
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useEffect, useMemo, useState } from "react";

type Props = {
	matchingOption: MatchingOptionType;
	setMatchingOption: Dispatch<SetStateAction<MatchingOptionType>>;
};
export default function RuleForm(props: Props) {
	function handleName(e: ChangeEvent<FormElement>) {
		props.setMatchingOption((prev) => ({ ...prev, name: e.target.value }));
	}
	function handleTimeLimit(value: string) {
		props.setMatchingOption((prev) => ({ ...prev, timeLimit: Number(value) }));
	}
	function handlePlayerCount(value: string) {
		props.setMatchingOption((prev) => ({ ...prev, playerCount: Number(value) }));
	}
	function handleTurnCount(value: string) {
		props.setMatchingOption((prev) => ({ ...prev, turnCount: Number(value) }));
	}
	function lockToggle() {
		props.setMatchingOption((prev) => ({ ...prev, isLock: !prev.isLock }));
		props.setMatchingOption((prev) => ({ ...prev, error: false }));
	}
	function handlePassword(e: ChangeEvent<FormElement>) {
		props.setMatchingOption((prev) => ({ ...prev, password: e.target.value }));
		props.setMatchingOption((prev) => ({ ...prev, error: false }));
	}

	return (
		<>
			<Spacer />

			<Input
				required
				clearable
				rounded
				bordered
				color="primary"
				label="部屋名"
				value={props.matchingOption.name}
				onChange={handleName}
			/>

			<Radio.Group
				label="制限時間"
				orientation="horizontal"
				value={String(props.matchingOption.timeLimit)}
				onChange={handleTimeLimit}
			>
				<Radio size="xs" value="20">
					20秒
				</Radio>
				<Radio size="xs" value="30">
					30秒
				</Radio>
				<Radio size="xs" value="40">
					40秒
				</Radio>
				<Radio size="xs" value="50">
					50秒
				</Radio>
				<Radio size="xs" value="60">
					60秒
				</Radio>
			</Radio.Group>

			<Radio.Group
				label="参加人数"
				orientation="horizontal"
				value={String(props.matchingOption.playerCount)}
				onChange={handlePlayerCount}
			>
				<Radio size="xs" value="3">
					3人
				</Radio>
				<Radio size="xs" value="4">
					4人
				</Radio>
				<Radio size="xs" value="5">
					5人
				</Radio>
				<Radio size="xs" value="6">
					6人
				</Radio>
			</Radio.Group>

			<Radio.Group
				label="ターン数"
				orientation="horizontal"
				value={String(props.matchingOption.turnCount)}
				onChange={handleTurnCount}
			>
				<Radio size="xs" value="3">
					3ターン
				</Radio>
				<Radio size="xs" value="4">
					4ターン
				</Radio>
				<Radio size="xs" value="5">
					5ターン
				</Radio>
				<Radio size="xs" value="6">
					6ターン
				</Radio>
			</Radio.Group>
			<Spacer />

			{/* <Grid.Container>
				<Grid alignItems="center" css={{ display: "flex" }}>
					<Text size="$md" color={props.matchingOption.isLock ? "primary" : "$gray800"}>
						パスワードをかける
					</Text>
				</Grid>
				<Spacer />
				<Grid>
					<Switch onChange={lockToggle} checked={props.matchingOption.isLock} />
				</Grid>
			</Grid.Container> */}
			<Input.Password
				clearable
				bordered={!props.matchingOption.error || props.matchingOption.isLock}
				contentLeftStyling
				disabled={!props.matchingOption.isLock}
				rounded
				color={props.matchingOption.error ? "error" : props.matchingOption.isLock ? "primary" : "default"}
				label="パスワード"
				helperColor="error"
				helperText={props.matchingOption.error ? "パスワードを入力、またはパスワードをオフにしてください" : ""}
				type="password"
				contentLeft={
					<Switch
						css={{ marginBottom: "$2" }}
						size="xs"
						color={props.matchingOption.error ? "error" : "primary"}
						onChange={lockToggle}
						checked={props.matchingOption.isLock}
					/>
				}
				value={props.matchingOption.isLock ? props.matchingOption.password : ""}
				onChange={handlePassword}
			/>
			<Spacer />

			{/* <Input.Password
			bordered
	// color="error"
	color="success"
/> */}
		</>
	);
}
