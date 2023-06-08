import AuthGuard from "@/components/guards/AuthGuard";
import Header from "@/components/util/Header";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

type Props = {
	children: ReactNode;
};

export default function Layout(props: Props) {
	const {status} = useSession()

	useEffect(() => {
		if(status === 'unauthenticated'){
			signOut()
		}
	}, [])
	return (
		<>
			<Header />
			<AuthGuard>{props.children}</AuthGuard>
		</>
	);
}
