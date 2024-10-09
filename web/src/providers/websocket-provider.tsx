import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import config from '../../../config.json';
import sleep from '../utilities/sleep';


export interface Entity {
	updates: EntityUpdate[];
	liquidity: string;
	marketCap: string;
	holders: string;
	image: string | undefined;
	lastUpdated: number;
	fresh: string;
	name: string;
	topTen: string;
	twitterSearches: Record<string, string>;
}

export type EntityUpdate = {
	change: string;
	date: number;
};

type DataProviderProps = {
	children: React.ReactNode;
};

type Data = {
	payload: {
		[key: string]: Entity;
	};
};

type DataProviderState = {
	data: Data;
	ws: WebSocket | null;
	isLoading: boolean;
	setData: (data: Data) => void;
};

const initial = {
	data: { payload: {} },
	ws: null,
	isLoading: true,
	setData: () => null
};

const DataProviderContext = createContext<DataProviderState>(initial);

function DataProvider({ children, ...props }: DataProviderProps) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [data, setData] = useState<Data>({ payload: {} });

	const ws = useRef<WebSocket | null>(null);

	const ctx = {
		data,
		setData,


		isLoading,
		get ws() {
			return ws.current;
		}
	};

	useEffect(() => {
		function onUnload() {
			ws.current?.close();
		}

		function createSocket() {
			if (ws.current) return;

			setIsLoading(true);

			const socket = new WebSocket('ws://' + config.web.externalIp + ':' + config.web.port);
			ws.current = socket;

			socket.addEventListener('close', async () => {
				ws.current = null;

				console.log('Socket closed, waiting 1000ms then retrying...');
				await sleep(1000);

				createSocket();
			});

			socket.addEventListener('open', () => {
				console.info('Socket opened');
				setIsLoading(false);
			});

			socket.addEventListener('message', (event) => {
				try {
					const payload = JSON.parse(event.data);

					switch (payload.type) {
						case 'STORE_UPDATE': {
							setData({ payload: payload.data });
						} break;
					}
				} catch (e) {
					console.error('!!! Failed parsing WebSocket message !!!');
				}
			});
		}

		createSocket();
		document.addEventListener('beforeunload', onUnload);

		return () => {
			document.removeEventListener('beforeunload', onUnload);
			ws.current!.close();
		};
	}, []);

	return <DataProviderContext.Provider key={Object.keys(data.payload).length} {...props} value={ctx} >
		{children}
	</DataProviderContext.Provider>;
}

export function useData() {
	const context = useContext(DataProviderContext);

	if (context === undefined) {
		throw new Error('useData must be used within an DataProvider');
	}

	return context;
}

export default DataProvider;