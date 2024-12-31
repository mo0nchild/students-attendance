/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"

type SetValue<T> = (value: T | ((val: T) => T)) => void

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
    const readValue = (): T => {
        if (typeof window === 'undefined') return initialValue
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    };
    const [storedValue, setStoredValue] = useState<T>(readValue)
    const setValue: SetValue<T> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
        }
    };
    useEffect(() => setStoredValue(readValue()), [key])
    return [storedValue, setValue]
}