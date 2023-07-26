import { useTheme as useNextTheme } from "next-themes";
import {
	Navbar,
	Button,
	Loading,
	User,
	Grid,
	Card,
	Text,
	useTheme,
	Switch,
	Spacer,
	Dropdown,
	Avatar,
} from "@nextui-org/react";
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
						size="$md"
						css={{
							textGradient: "45deg, $blue600 -20%, $pink600 50%",
						}}
						b
					>
						Omojan Online
					</Text>
				</Navbar.Brand>
				{/* <Navbar.Content>

				</Navbar.Content> */}
				<Navbar.Content>
					<Switch
						size="xs"
						checked={isDark}
						onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
					/>
					{status === "loading" ? (
						<Button disabled auto bordered rounded size="md">
							<Loading type="points" color="currentColor" size="md" />
						</Button>
					) : status === "authenticated" ? (
						<>
							<Dropdown placement="bottom-right">
								<Navbar.Item>
									<Dropdown.Trigger>
										<Avatar bordered color="primary" size="sm" src={session.user?.image ?? ""} />
									</Dropdown.Trigger>
								</Navbar.Item>
								<Dropdown.Menu aria-label="User menu actions">
									<Dropdown.Item key={1}>
										<Text>Menu1</Text>
									</Dropdown.Item>
									<Dropdown.Item key={2} withDivider>
										<Text>Menu2</Text>
									</Dropdown.Item>
									<Dropdown.Item key={3} withDivider>
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
									</Dropdown.Item>
									{/* 
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
										</Button> */}
								</Dropdown.Menu>
							</Dropdown>
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
				</Navbar.Content>
			</Navbar>
			<Spacer />
		</header>
	);
}
