import { MatchingOption } from "@/types/matchingType";
import { Button, Modal, Text, useModal } from "@nextui-org/react";
import { useRouter } from "next/router";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
	children: ReactNode;
	matchingOption: MatchingOption;
	setMatchingOption: Dispatch<SetStateAction<MatchingOption>>;
};

export default function CreateMatchingModal(props: Props) {
	const router = useRouter();
	const { setVisible, bindings } = useModal();
	// const [isOpen, setIsOpen] = useState(false);

	// function open() {
	// 	setIsOpen(true);
	// }
	// function close() {
	// 	setIsOpen(false);
	// }

	async function createMatching() {
		if (!props.matchingOption.name || (props.matchingOption.isLock && !props.matchingOption.password)) {
			if (!props.matchingOption.name) {
				props.setMatchingOption((prev) => ({ ...prev, errors: { ...prev.errors, name: true } }));
			}
			if (props.matchingOption.isLock && !props.matchingOption.password) {
				props.setMatchingOption((prev) => ({ ...prev, errors: { ...prev.errors, password: true } }));
			}
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
					name: props.matchingOption.name,
					timeLimit: props.matchingOption.timeLimit,
					playerCount: props.matchingOption.playerCount,
					roundCount: props.matchingOption.roundCount,
					frontAndBack: props.matchingOption.frontAndBack,
					password: props.matchingOption.password,
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
			<Button auto size="lg" rounded onPress={() => setVisible(true)}>
				{/* <Button auto size='lg' rounded onPress={open}> */}
				部屋を作成する
			</Button>
			<Modal closeButton {...bindings}>
				{/* <Modal closeButton  open={isOpen} onClose={close}> */}
				<form onSubmit={createMatching}>
					<Modal.Header>
						<Text h2 size="$xl">
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
