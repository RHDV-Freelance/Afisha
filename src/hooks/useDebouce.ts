import { useEffect, useCallback } from 'react';

// @ts-ignore
export default function useDebounce(effect, dependencies, delay) {
    const callback = useCallback(effect, dependencies);

    useEffect(() => {
        const timeout = setTimeout(callback, delay);
        return () => clearTimeout(timeout);
    }, [callback, delay]);
}