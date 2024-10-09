import EventEmitter from 'node:events';
import type { Entity } from '~/types';


class Store extends Map<string, Entity> {
	events = new EventEmitter();

	constructor() {
		super();
	}

	delete(key: string): boolean {
		const res = super.delete(key);
		this.events.emit('store-updated');

		return res;
	}

	set(key: string, value: Entity): this {
		const res = super.set(key, value);
		this.events.emit('store-updated');

		return res;
	}

	clear(): void {
		super.clear();
		this.events.emit('store-updated');
	}
}

const store = new Store();

export default store;