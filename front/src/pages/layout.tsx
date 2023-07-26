import AuthGuard from "@/components/guards/AuthGuard";
import Header from "@/components/util/Header";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

type Props = {
	children: ReactNode;
};

export default function Layout(props: Props) {
	const { status } = useSession();

	useEffect(() => {
		if (status === "unauthenticated") {
			signOut();
		}
	}, []);
	return (
		<>
			{/* <div style={{ maxHeight: "100vh", minHeight: "100vh" }}> */}
			<div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
				{/* <Header /> */}
				<AuthGuard>{props.children}</AuthGuard>
			</div>
		</>
	);
}
