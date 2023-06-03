// const prisma = new PrismaClient()
import LineProvider from "next-auth/providers/line";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth/next";

const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID ?? "",
			clientSecret: process.env.GOOGLE_SECRET ?? "",
		}),
		LineProvider({
			clientId: process.env.LINE_ID ?? "",
			clientSecret: process.env.LINE_SECRET ?? "",
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID ?? "",
			clientSecret: process.env.GITHUB_SECRET ?? "",
		}),
	],
	session: {
		strategy: "jwt",
	},
	jwt: {
		maxAge: 60 * 60 * 24, //1日
	},
};

export default NextAuth(authOptions);
