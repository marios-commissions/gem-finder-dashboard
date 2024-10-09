import { ClientOptions, SessionName } from '~/constants';
import { TelegramClient } from 'telegram';
import config from '~/../config.json';
import * as Listeners from '~/events';
import input from 'input';


class Client extends TelegramClient {
	constructor() {
		super(
			SessionName,
			config.telegram.api.id,
			config.telegram.api.hash,
			ClientOptions
		);
	}

	async initialize() {
		await this.start({
			phoneNumber: config.telegram.phone,
			password: async () => input.text('Please enter your password: '),
			phoneCode: async () => input.text('Please enter the code you received: '),
			onError: (e) => console.error('Failed to log in:', e.message)
		});

		this._log.info('Successfully logged in.');

		for (const listener in Listeners) {
			const event = Listeners[listener as keyof typeof Listeners];

			this.addEventHandler(event.handler, event.listener);
		}
	}
}

export default new Client();