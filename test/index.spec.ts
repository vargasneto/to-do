import { env, createExecutionContext, waitOnExecutionContext, SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("to-do worker", () => {
	describe("unknown routes", () => {
		it("responds with 404 Not Found (unit style)", async () => {
			const request = new Request<unknown, IncomingRequestCfProperties>("http://example.com/api/missing");
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);

			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(404);
			expect(await response.text()).toBe("Not Found");
		});

		it("responds with 404 Not Found (integration style)", async () => {
			const request = new Request("http://example.com/api/missing");
			const response = await SELF.fetch(request);

			expect(response.status).toBe(404);
			expect(await response.text()).toBe("Not Found");
		});
	});
});
