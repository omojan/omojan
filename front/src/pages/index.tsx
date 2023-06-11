import AuthGuard from "@/components/guards/AuthGuard";
import CreateMatchingModal from "@/components/matchings/CreateMatchingModal";
import RuleForm from "@/components/matchings/RuleForm";
import { MatchingOption } from "@/types/matchingType";
import { Button, Card, Container, Spacer } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
	const [matchingOption, setMatchingOption] = useState<MatchingOption>({
		name: "誰でも歓迎",
		timeLimit: 30,
		playerCount: 4,
		roundCount: 4,
		frontAndBack: false,
		isLock: false,
		password: "",
		errors: { name: false, password: false },
	});
	return (
		<>
			<main>
				{/* <AuthGuard> */}
				<Container xs>
					<Card>
						<Card.Body css={{ p: "40px 24px 32px" }}>
							<CreateMatchingModal
								matchingOption={matchingOption}
								setMatchingOption={setMatchingOption}
							>
								<RuleForm matchingOption={matchingOption} setMatchingOption={setMatchingOption} />
							</CreateMatchingModal>
							<Spacer />
							<Link href="/matching" className="w-full">
								<Button rounded size="lg" css={{ w: "100%" }}>
									部屋一覧
								</Button>
							</Link>
						</Card.Body>
					</Card>
				</Container>
				{/* </AuthGuard> */}
			</main>
		</>
	);
}
