import AuthGuard from "@/components/guards/AuthGuard";
import CreateMatchingModal from "@/components/matchings/CreateMatchingModal";
import RuleForm from "@/components/matchings/RuleForm";
import Header from "@/components/util/Header";
import { MatchingOptionType } from "@/types/matchingType";
import { Button, Card, Container, Dropdown, Input, Spacer } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
	const [matchingOption, setMatchingOption] = useState<MatchingOptionType>({
		name: "誰でも歓迎",
		timeLimit: 30,
		playerCount: 4,
		turnCount: 4,
		isLock: false,
		password: "",
		error: false,
	});
	return (
		<>
			<main>
				<Container xs>
					<Card >
						<Card.Body css={{p: '40px 24px 32px'}} >
							<CreateMatchingModal matchingOption={matchingOption} setMatchingOption={setMatchingOption}>
								<RuleForm matchingOption={matchingOption} setMatchingOption={setMatchingOption} />
							</CreateMatchingModal>
							<Spacer />
							<Link href="/matching" className="w-full">
								<Button rounded size='lg' css={{ w: "100%" }}>
									部屋一覧
								</Button>
							</Link>
						</Card.Body>
					</Card>
				</Container>
			</main>
		</>
	);
}
