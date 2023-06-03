import AuthGuard from "@/components/guards/AuthGuard";
import Header from "@/components/util/Header";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export default function Layout(props: Props) {
	return (
		<>
			<Header />
			<AuthGuard>{props.children}</AuthGuard>
		</>
	);
}
