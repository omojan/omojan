import { Matching } from "@prisma/client";
import MatchingList from "../../components/matchings/MatchingList";
import AuthGuard from "@/components/guards/AuthGuard";


export default function Matching() {

	return (
		<AuthGuard>
			<MatchingList />
		</AuthGuard>
	);
}
