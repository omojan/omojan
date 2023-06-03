import { MatchingOptionType } from "@/types/matchingType";
import { Button, Modal, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
	children: ReactNode;
	matchingOption: MatchingOptionType;
	setMatchingOption: Dispatch<SetStateAction<MatchingOptionType>>;
};

export default function CreateMatchingModal(props: Props) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	function open() {
		setIsOpen(true);
	}
	function close() {
		setIsOpen(false);
	}
	async function createMatching() {
		if (props.matchingOption.isLock && !props.matchingOption.password) {
			props.setMatchingOption((prev) => ({ ...prev, error: true }));
			return;
		}
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matching`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					// ...props.matchingOption,
					name: props.matchingOption.name,
					timeLimit: props.matchingOption.timeLimit,
					playerCount: props.matchingOption.playerCount,
					turnCount: props.matchingOption.turnCount,
					password: props.matchingOption.password
				}),
			});
			const result = await res.json();
			router.replace(`/matching/${result.matchingId}`);
		} catch (error) {
			throw new Error("部屋の作成に失敗しました");
		}
	}
	return (
		<>
			<Button auto size='lg' rounded onPress={open}>
				部屋を作成する
			</Button>
			<Modal closeButton  open={isOpen} onClose={close}>
				{/* <Modal closeButton scroll aria-labelledby="modal-title" open={isOpen} onClose={close}> */}
				<form onSubmit={createMatching}>
					<Modal.Header>
						<Text h2 size="$xl">
							{/* <Text id="modal-title" h2 size="$xl"> */}
							ルール設定
						</Text>
					</Modal.Header>
					<Modal.Body>{props.children}</Modal.Body>
					<Modal.Footer>
						<Button auto shadow rounded onPress={createMatching}>
							募集を開始する
						</Button>
					</Modal.Footer>
				</form>
			</Modal>
		</>
	);
}
