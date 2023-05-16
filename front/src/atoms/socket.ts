import { atom } from "recoil";
import { io } from "socket.io-client";

export const socketState = atom({
	key: "socket",
	default: io("http://localhost:8000", {
		withCredentials: true,
	}),
});
