import { useState } from 'react';

import { useData } from './providers/websocket-provider';


const ImageOverlay = ({ src, onClose }: { src: string, onClose: React.MouseEventHandler<HTMLDivElement>; }) => (
	<div
		className="fixed inset-0 bg-black/50 pointer-events-none flex items-center justify-center z-999999999"
		onClick={onClose}
	>
		<div className="bg-white p-2 rounded-lg">
			<img
				src={src}
				alt="Full size"
				className="max-w-[90vw] max-h-[90vh]object-contain"
			/>
		</div>
	</div>
);

function App() {
	const [hoveredImage, setHoveredImage] = useState<string | null>(null);
	const { data } = useData();

	return <>
		<div className='grid p-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2'>
			{Object.entries(data.payload).length === 0 && 'No coins have been captured yet.'}
			{Object.entries(data.payload).sort(([, detailsA], [, detailsB]) => detailsB.lastUpdated - detailsA.lastUpdated).map(([address, details]) => {
				const latestUpdate = details.updates.sort((a, b) => b.date - a.date)[0];

				return <div className='bg-neutral-600 rounded-md p-2 flex gap-4 relative items-center'>
					{details.image && (
						<div
							className='relative'
							onMouseEnter={() => setHoveredImage(`data:image/png;base64,${details.image}`)}
							onMouseLeave={() => setHoveredImage(null)}
						>
							<img
								className='object-cover min-w-12 min-h-12 w-12 h-12 rounded-md'
								src={`data:image/png;base64,${details.image}`}
								alt={details.name}
							/>
						</div>
					)}				{/* Details */}
					<div className='relative flex flex-col w-full h-full overflow-hidden flex-nowrap'>
						<span className='overflow-hidden font-bold text-sm'>{details.name.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')}</span>
						<div className='flex items-center flex-nowrap text-sm'>
							<span className='overflow-ellipsis'>MC: ${details.marketCap}</span>
							<div className='h-full bg-neutral-200/10 mx-1 w-0.5' />
							<span className='overflow-ellipsis'>L: ${details.liquidity}</span>
							<div className='h-full bg-neutral-200/10 mx-1 w-0.5' />
							<span className='overflow-ellipsis'>H: {details.holders}</span>
							<div className='h-full bg-neutral-200/10 mx-1 w-0.5' />
							<span className='overflow-ellipsis'>T10: {details.topTen}%</span>
							<div className='h-full bg-neutral-200/10 mx-1 w-0.5' />
							<span className='overflow-ellipsis'>F: {details.fresh}%</span>
						</div>
						<p className='font-semibold overflow-ellipsis text-xs'>{address}</p>
						<div className='flex gap-2 overflow-hidden'>{Object.entries(details.twitterSearches).map(([name, url]) => <a className='hover:underline' href={url}>{name.charAt(0).toUpperCase()}</a>)}</div>
					</div>
					{/* Twitter Links */}
					{latestUpdate !== void 0 && <span className='text-xl right-2 font-bold text-red-500 ml-auto'>{latestUpdate.change}</span>}
				</div>;
			})}
		</div>
		{hoveredImage && <ImageOverlay src={hoveredImage} onClose={() => setHoveredImage(null)} />}
	</>;
}

export default App;