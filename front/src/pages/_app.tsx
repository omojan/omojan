import { NextUIProvider, createTheme } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import Layout from "./layout";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const lightTheme = createTheme({
		type: "light",
	});

	const darkTheme = createTheme({
		type: "dark",
	});

	const queryClient = new QueryClient();
	return (
		<ThemeProvider
			defaultTheme="system"
			attribute="class"
			value={{
				light: lightTheme.className,
				dark: darkTheme.className,
			}}
		>
			<NextUIProvider>
				<QueryClientProvider client={queryClient}>
					<ReactQueryDevtools />
					<SessionProvider session={session}>
						{/* <RecoilRoot> */}
						<Layout>
							<Component {...pageProps} />
						</Layout>
						{/* </RecoilRoot> */}
					</SessionProvider>
				</QueryClientProvider>
			</NextUIProvider>
		</ThemeProvider>
	);
}
