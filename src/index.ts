import handler from "vinext/server/app-router-entry";

export default {
	async fetch(request): Promise<Response> {
		return handler.fetch(request);
	},
} satisfies ExportedHandler<Env>;
