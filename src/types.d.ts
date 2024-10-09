export interface Entity {
	updates: EntityUpdate[];
	liquidity: string;
	marketCap: string;
	holders: string;
	lastUpdated: number;
	name: string;
	image: string | undefined;
	fresh: string;
	topTen: string;
	twitterSearches: Record<string, string>;
}

export type EntityUpdate = {
	change: string;
	date: number;
};