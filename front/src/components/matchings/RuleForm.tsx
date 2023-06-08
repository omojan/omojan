// import { MatchingOption } from "@/types/matchingType";
import { MatchingOption } from "@/types/matchingType";
import { Input, Radio, Spacer, Switch, FormElement, Text, Row } from "@nextui-org/react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type Props = {
	matchingOption: MatchingOption;
	setMatchingOption: Dispatch<SetStateAction<MatchingOption>>;
};
export default function RuleForm(props: Props) {
	function handleName(e: ChangeEvent<FormElement>) {
		props.setMatchingOption((prev) => ({ ...prev, name: e.target.value }));
		props.setMatchingOption((prev) => ({ ...prev, errors: { ...prev.errors, name: false } }));
	}
	function handleTimeLimit(value: string) {
		props.setMatchingOption((prev) => ({ ...prev, timeLimit: Number(value) }));
	}
	function handlePlayerCount(value: string) {
		props.setMatchingOption((prev) => ({ ...prev, playerCount: Number(value) }));
	}
	function handleRoundCount(value: string) {
		props.setMatchingOption((prev) => ({ ...prev, roundCount: Number(value) }));
	}
	function frontAndBackToggle() {
		props.setMatchingOption((prev) => ({ ...prev, frontAndBack: !prev.frontAndBack }));
	}
	function lockToggle() {
		props.setMatchingOption((prev) => ({ ...prev, isLock: !prev.isLock }));
		props.setMatchingOption((prev) => ({ ...prev, errors: { ...prev.errors, password: false } }));
	}
	function handlePassword(e: ChangeEvent<FormElement>) {
		props.setMatchingOption((prev) => ({ ...prev, password: e.target.value }));
		props.setMatchingOption((prev) => ({ ...prev, errors: { ...prev.errors, password: false } }));
	}

	return (
		<>
			<Spacer />
			<Input
				required
				clearable
				bordered
				rounded
				color={props.matchingOption.errors.name ? "error" : "primary"}
				label="部屋名*"
				helperColor="error"
				helperText={props.matchingOption.errors.name ? "名前は必須です" : ""}
				value={props.matchingOption.name}
				onChange={handleName}
			/>
			<Spacer />
			{/* <Input
				required
				clearable
				rounded
				bordered
				color="primary"
				label="部屋名"
				value={props.matchingOption.name}
				onChange={handleName}
			/> */}

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
				value={String(props.matchingOption.roundCount)}
				onChange={handleRoundCount}
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
			<Row>
				<Text>前後両方に設置可能</Text>
				<Spacer/>
				<Switch
					size="sm"
					onChange={frontAndBackToggle}
					checked={props.matchingOption.frontAndBack}
				/>
			</Row>
			<Spacer />
			<Input.Password
				clearable
				bordered={!props.matchingOption.errors.password || props.matchingOption.isLock}
				contentLeftStyling
				disabled={!props.matchingOption.isLock}
				rounded
				color={
					props.matchingOption.errors.password ? "error" : props.matchingOption.isLock ? "primary" : "default"
				}
				label={`パスワード${props.matchingOption.isLock ? "*" : ""}`}
				helperColor="error"
				helperText={
					props.matchingOption.errors.password ? "パスワードを入力、またはパスワードをオフにしてください" : ""
				}
				type="password"
				contentLeft={
					<Switch
						css={{ marginBottom: "$2" }}
						size="xs"
						color={props.matchingOption.errors.password ? "error" : "primary"}
						onChange={lockToggle}
						checked={props.matchingOption.isLock}
					/>
				}
				value={props.matchingOption.isLock ? props.matchingOption.password : ""}
				onChange={handlePassword}
			/>
			<Spacer />
		</>
	);
}
