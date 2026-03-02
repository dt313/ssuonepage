import { useEffect } from 'react';

export function useClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    handler: () => void,
    when: boolean = true,
) {
    useEffect(() => {
        if (!when || !ref) return;

        const listener = (event: MouseEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };

        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref, handler, when]);
}
