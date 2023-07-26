import { Button, Navbar, Switch, useTheme } from "@nextui-org/react";

import { useSession } from "next-auth/react";
import { useTheme as useNextTheme } from "next-themes";

export default function GameHeader() {
	const { setTheme } = useNextTheme();
	const { isDark, type } = useTheme();
	return (
		<header>
			<Navbar isCompact>
				<Navbar.Content>
					<Button size="sm" bordered>
						退出
					</Button>
				</Navbar.Content>
				<Navbar.Content>
					<Switch
						size="xs"
						checked={isDark}
						onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
					/>
				</Navbar.Content>
			</Navbar>
		</header>
	);
}
