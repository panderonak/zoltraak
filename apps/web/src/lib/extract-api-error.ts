import { AxiosError } from "axios";

/**
 * Extracts a typed { code, message } pair from any thrown value.
 *
 * WHY THIS EXISTS
 * Every backend error response follows the shape { error: "CODE", message: "..." }.
 * Without this helper, every catch block would need to cast err.response?.data
 * itself — that's both repetitive and easy to get wrong. Centralising it here
 * means the casting logic is tested once and reused everywhere.
 *
 * WHY IT ACCEPTS `unknown`
 * TypeScript types catch-clause variables as `unknown` (since TS 4.0) because
 * anything can be thrown — not just Error instances. Accepting `unknown` forces
 * us to guard with `instanceof` before touching any properties, which is safer
 * than assuming the shape upfront.
 */
function extractApiError(err: unknown): { code: string; message: string } {
	if (err instanceof AxiosError) {
		// err.response is undefined on network errors (no internet, CORS, timeout),
		// so the optional chain produces `undefined` rather than throwing.
		// We cast to the known backend error shape and fall back on both fields
		// so callers always receive a safe string regardless of what the server sent.
		const data = err.response?.data as
			| { error?: string; message?: string }
			| undefined;

		return {
			code: data?.error ?? "UNKNOWN",
			message: data?.message ?? "Something went wrong. Please try again.",
		};
	}

	// Non-Axios errors (e.g. a programming mistake that threw a plain Error)
	// are treated as unknown failures. We don't expose the raw error message
	// because it may contain internal implementation details.
	return {
		code: "UNKNOWN",
		message: "Something went wrong. Please try again.",
	};
}

export { extractApiError };
