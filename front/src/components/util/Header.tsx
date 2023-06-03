import { useTheme as useNextTheme } from "next-themes";
import { Navbar, Button, Loading, User, Grid, Card, Text, useTheme, Switch, Spacer } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
export default function Header() {
	const { status, data: session } = useSession();
	const { setTheme } = useNextTheme();
	const { isDark, type } = useTheme();

	return (
		<header>
			<Navbar>
				<Navbar.Brand>
					<Text
						h1
						size="$2xl"
						css={{
							textGradient: "45deg, $blue600 -20%, $pink600 50%",
						}}
						weight="bold"
					>
						Omojan Online
					</Text>
				</Navbar.Brand>
				<Navbar.Content>
					<Switch size='sm' checked={isDark} onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} />

					{status === "loading" ? (
						<Button disabled auto bordered rounded size="md">
							<Loading type="points" color="currentColor" size="md" />
						</Button>
					) : status === "authenticated" ? (
						<>
							<User
								bordered
								color="primary"
								size="md"
								src={session.user?.image ?? ""}
								name={session.user?.name ?? ""}
							/>
							<Button
								auto
								size="md"
								color="primary"
								flat
								onClick={() => {
									signOut({ callbackUrl: "/" });
								}}
							>
								ログアウト
							</Button>
						</>
					) : (
						<Button
							auto
							size="md"
							color="primary"
							onClick={() => {
								signIn(undefined, { callbackUrl: "/" });
							}}
						>
							サインイン
						</Button>
					)}
					{/* {status === "authenticated" ? (
						<>
							<User
								bordered
								color="primary"
								size="md"
								src={session.user?.image ?? ""}
								name={session.user?.name ?? ""}
							/>
							<Button
								auto
								size="md"
								color="primary"
								onClick={() => {
									signIn(undefined, { callbackUrl: "/" });
								}}
							>
								サインイン
							</Button>
						</>
					) : status === "unauthenticated" ? (
						<Button
							auto
							size="md"
							color="primary"
							flat
							onClick={() => {
								signOut({ callbackUrl: "/" });
							}}
						>
							ログアウト
						</Button>
					) : (
						<Button disabled auto bordered rounded size="md">
							<Loading type="points" color="currentColor" size="md" />
						</Button>
					)} */}
				</Navbar.Content>
			</Navbar>
			<Spacer y={2} />
		</header>
	);
}
