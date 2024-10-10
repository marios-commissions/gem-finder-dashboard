import { useEffect, useRef, useState } from 'react';
import { CopyCheck, CopyIcon } from 'lucide-react';


interface CopyFieldProps extends React.ComponentProps<'div'> {
	value: string;
}

function CopyField(props: CopyFieldProps) {
	const inputRef = useRef<HTMLInputElement | null>(null); // To reference the input element
	const spanRef = useRef<HTMLSpanElement | null>(null);  // To reference the hidden span element
	const [copied, setCopied] = useState(false);

	// Use effect to update width when inputValue changes
	useEffect(() => {
		if (spanRef.current && inputRef.current) {
			const spanWidth = spanRef.current!.offsetWidth;
			inputRef.current!.style.width = `${spanWidth + 4}px`;
		}
	}, [spanRef.current, inputRef.current]);

	useEffect(() => {
		if (copied) {
			navigator.clipboard.writeText(props.value);

			const timeout = setTimeout(() => setCopied(false), 1000);
			return () => clearTimeout(timeout);
		}
	}, [copied]);

	const content = props.value.slice(0, 3) + '...' + props.value.slice(-3);

	return <div {...props} className='flex items-center justify-center'>
		<input
			ref={inputRef}
			className='w-auto bg-transparent outline-none font-semibold text-neutral-400'
			type='text'
			value={content}
		/>
		<span ref={spanRef} className='invisible absolute whitespace-pre'>
			{content}
		</span>
		<button className='' onClick={() => !copied && setCopied(true)}>
			{copied ? <CopyCheck size={16} /> : <CopyIcon size={16} />}
		</button>
	</div>;
}

export default CopyField;