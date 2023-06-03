import { Loading, Button, Text, Grid, Spacer } from "@nextui-org/react";

import { signIn, signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};
export default function AuthGuard(props: Props) {
	const { status } = useSession();

	if (status === "loading") {
		return (
			<Grid.Container justify="center">
				<Grid xs={12} md={6} justify="center">
					<Loading type="points" size="lg">
						Now Loading
					</Loading>
				</Grid>
			</Grid.Container>
		);
	} else if (status === "authenticated") {
		return <>{props.children}</>;
	} else {
		return (
			<>
				<Grid.Container>
					<Grid md={12} justify="center">
						<Text size="$xl" weight="bold" color="warning">
							サインインしていません。サインインしてください。
						</Text>
					</Grid>
					<Spacer y={2} />
					<Grid md={12} justify="center">
						<Button
							// auto
							size="lg"
							rounded
							shadow
							onClick={() => {
								signIn(undefined, { callbackUrl: "/" });
							}}
						>
							sign in
						</Button>
					</Grid>
				</Grid.Container>
			</>
		);
	}
}
