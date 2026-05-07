export type Rank = {
	name: string;
	minXp: number;
};

export const ranks: Rank[] = [
	{ name: "Aprendiz", minXp: 0 },
	{ name: "Executor", minXp: 80 },
	{ name: "Estrategista", minXp: 160 },
	{ name: "Mestre do Foco", minXp: 260 },
];

export function getCompletionRate(completedCount: number, totalCount: number) {
	return totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
}

export function getRank(xp: number) {
	return ranks.reduce((current, next) => (xp >= next.minXp ? next : current), ranks[0]);
}

export function getNextRankProgress(xp: number, rank: Rank) {
	const nextRank = ranks.find((item) => item.minXp > xp);

	if (!nextRank) {
		return 100;
	}

	return Math.min(100, Math.round(((xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100));
}
