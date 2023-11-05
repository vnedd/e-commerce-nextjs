"use client"
import { useState, useEffect } from 'react';

function useDebounce(value: string, delay: number) {
    // State để lưu trữ giá trị đã debounce
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
