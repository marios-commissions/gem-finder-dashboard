import { Api } from 'telegram';


export function parseAddress(content: string) {
	return content.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/mi)?.[0];
}

export function parseFresh(content: string) {
	return content.match(/Fresh: (\d+\.?\d*)%/mi)?.[1];
}

export function parseHolders(content: string) {
	return content.match(/Holders: (\d+)/mi)?.[1];
}

export function parseLiquidity(content: string) {
	return content.match(/Liq: \$(\d{1,3}(?:,\d{3})*)/mi)?.[1];
}

export function parseMarketCap(content: string) {
	return content.match(/MC \$(\d{1,3}(?:,\d{3})*)/mi)?.[1];
}

export function parseTopTen(content: string) {
	return content.match(/Top 10: (\d+\.?\d*)%/mi)?.[1];
}

export function parseCoinName(content: string) {
	return content.split('\n')[0];
}

export function parseUpdate(content: string) {
	return content.match(/(\d+\.?\d*)x/mi)?.[0];
}

export function parseLinks(text: string, entities: Api.TypeMessageEntity[] | undefined): Record<string, string> {
	if (!entities) return {};

	return Object.fromEntries(entities
		.filter(e => e.className === 'MessageEntityTextUrl')
		.map(e => {
			const entity = (e as Api.MessageEntityTextUrl);
			const name = text.substr(entity.offset, entity.length);

			return [name, entity.url];
		}));
}

export function parseCoinDetails(text: string, entities: Api.TypeMessageEntity[]) {
	return {
		liquidity: parseLiquidity(text) ?? 'Unknown',
		marketCap: parseMarketCap(text) ?? 'Unknown',
		holders: parseHolders(text) ?? 'Unknown',
		fresh: parseFresh(text) ?? 'Unknown',
		topTen: parseTopTen(text) ?? 'Unknown',
		twitterSearches: parseLinks(text, entities) ?? [],
		name: parseCoinName(text)
	};
}

export default { parseCoinDetails, parseAddress, parseCoinName, parseMultiplier: parseUpdate, parseTwitterSearches: parseLinks, parseFresh, parseHolders, parseTopTen, parseMarketCap, parseLiquidity };