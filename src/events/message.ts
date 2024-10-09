import { NewMessage, type NewMessageEvent } from 'telegram/events';
import events from '~/lib/events';
import store from '~/lib/store';
import { Client } from '~/lib';
import { Api } from 'telegram';
import Parser from '~/parser';


export const listener = new NewMessage();

export async function handler(event: NewMessageEvent) {
	const text = event.message.rawText;
	if (!text) return;

	console.log(text);

	const chatId = event.chatId!.toString();
	Client._log.info(`New message from ${chatId}`);

	if (chatId !== '7097576821') return;
	if (!event.isPrivate) return;

	const sender = await event.message.getSender();
	if (!(sender instanceof Api.User)) return;

	const media = await event.message.downloadMedia();
	const image = media?.toString('base64');
	// if (sender.id.toString() !== '7097576821') return;

	const address = Parser.parseAddress(text);
	const update = text.split('\n').find(l => l.startsWith('Up '));

	if (!address) return console.error('No address found in text: ', text);

	if (update) {
		const reply = await event.message.getReplyMessage();
		if (!reply) return;

		const details = Parser.parseCoinDetails(reply.rawText, reply.entities ?? []);
		const existing = store.get(address);

		const multiplier = Parser.parseMultiplier(update);
		if (!multiplier) return;

		const entityUpdate = {
			date: Date.now(),
			change: multiplier
		};

		if (existing) {
			existing.lastUpdated = Date.now();
			existing.updates = [...existing.updates, entityUpdate];
		} else {
			store.set(address, {
				...details,
				lastUpdated: Date.now(),
				image,
				updates: [entityUpdate]
			});
		}

		return events.emit('update-coin', address);
	}

	const details = Parser.parseCoinDetails(text, event.message.entities ?? []);

	store.set(address, {
		...details,
		lastUpdated: Date.now(),
		image,
		updates: []
	});

	events.emit('new-coin', address);
}