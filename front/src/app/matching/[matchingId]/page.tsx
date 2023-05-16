import AuthGuard from "@/components/guards/AuthGuard";
import ParticipantList from "@/components/matchings/ParticipantList";
import { Matching } from "@prisma/client";
import { cookies } from "next/dist/client/components/headers";

type Props = {
	params: { matchingId: string };
};

async function getMatching(matchingId: string, token: string) {
	const res = await fetch(`${process.env.BACKEND_URL}/matching/${matchingId}`, {
		credentials: "include",
		headers: {
			authorization: token,
		},
	});
	return res.json();
}

export default async function MatchingRoom({ params }: Props) {
	const cookie = (await cookies().get("next-auth.session-token")?.value) ?? "";

	const matching: Matching = await getMatching(params.matchingId, cookie);
	return (
		<AuthGuard>
			<h2>{matching.name}</h2>
			<ParticipantList matching={matching} />
		</AuthGuard>
	);
}
