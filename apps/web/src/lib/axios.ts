import { env } from "@zoltraak/env/web";
import axios from "axios";

const api = axios.create({
	baseURL: `${env.NEXT_PUBLIC_SERVER_URL}/api`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

export { api };
