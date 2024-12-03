import { useEffect, useState } from "react";

export const useScanner = (onComplete: (value: string) => void, allow: boolean) => {
    const [value, setValue] = useState('')
    const handleKeyDown = (event: KeyboardEvent) => {
        if(!allow) return
        if (event.key === 'Enter') {
            const result = value;
            setValue('')
            onComplete(result);
        }
        else setValue(value + event.key)
    };
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onComplete]);
}