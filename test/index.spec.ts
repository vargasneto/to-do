import { describe, expect, it } from "vitest";
import { getCompletionRate, getNextRankProgress, getRank } from "../app/todo-progress";

describe("to-do progress", () => {
	it("calculates completion rate without dividing by zero", () => {
		expect(getCompletionRate(0, 0)).toBe(0);
		expect(getCompletionRate(1, 3)).toBe(33);
		expect(getCompletionRate(3, 3)).toBe(100);
	});

	it("selects the current rank and rank progress from XP", () => {
		const rank = getRank(120);

		expect(rank.name).toBe("Executor");
		expect(getNextRankProgress(120, rank)).toBe(50);
		expect(getNextRankProgress(300, getRank(300))).toBe(100);
	});
});
