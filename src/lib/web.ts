import config from '~/../config.json';
import { WebSocketServer } from 'ws';
import store from '~/lib/store';


export const ws = new WebSocketServer({ port: config.web.port });

ws.on('connection', (socket) => {
	console.info('Client connected to WebSocket server.');

	function sendUpdate() {
		const payload = JSON.stringify({
			type: 'STORE_UPDATE',
			data: Object.fromEntries(store.entries()),
		});

		socket.send(payload);
	}

	store.events.on('store-updated', sendUpdate);

	socket.on('error', console.error);

	socket.on('close', () => {
		console.info('Client disconnected from WebSocket server.');
		store.events.on('store-updated', sendUpdate);
	});

	sendUpdate();
});

ws.on('listening', () => {
	console.info('WebSocket server listening on port 8098');
});