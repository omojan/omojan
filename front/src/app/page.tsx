import Link from "next/link";
import CreateMatchingButton from "@/components/matchings/CreateMatchingButton";
import AuthGuard from "@/components/guards/AuthGuard";

export default async function Home() {


	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<AuthGuard>
				<CreateMatchingButton/>
				<Link href={'/matching'}>参加する</Link>
			</AuthGuard>
		</main>
	);
}
