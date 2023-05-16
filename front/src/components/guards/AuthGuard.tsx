"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";
import LoadingIcon from "../util/LoadingIcon";

type Props = {
	children: ReactNode;
};
export default function AuthGuard(props: Props) {
	const { status } = useSession();

	if (status === "loading") {
		return <LoadingIcon />;
	} else if (status === "authenticated") {
		return (
			<>
				<button
					onClick={() => {
						signOut();
					}}
				>
					sign out
				</button>
				{props.children}
			</>
		);
	} else {
		return (
			<>
				<button
					onClick={() => {
						signIn();
					}}
				>
					sign in
				</button>
			</>
		);
	}
}
