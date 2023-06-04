import { GameInMtchingInRule } from "@/types/gameType";
import { Game } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { decode } from "next-auth/jwt";

type Props = {
	meId: string | undefined;
	game: GameInMtchingInRule;
};
export default function Game(props: Props) {
    console.log(props.game)
	return (
        <>game</>
    );
}

export async function getServerSideProps({ params, req }: GetServerSidePropsContext) {
	try {
		const decodeResult = await decode({
			token: req.cookies["next-auth.session-token"],
			secret: process.env.NEXTAUTH_SECRET ?? "",
		});
		const res = await fetch(`${process.env.BACKEND_URL}/game/${params?.gameId}`, {
			credentials: "include",
			headers: {
				Authorization: `Bearer ${req.cookies["next-auth.session-token"] ?? ""}`,
			},
		});
		const game: GameInMtchingInRule = await res.json();
		return { props: { meId: decodeResult?.sub, game } };
	} catch (error) {
		console.log(error);
		return { props: {} };
	}
}
