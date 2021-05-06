import { DependencyList, useEffect, useState } from "react"

function useDebouncedValue<T>(value: T, delay: number) {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedValue(value), delay);
  
        return () => clearTimeout(timeout)

    }, [value, delay])
    
    return debouncedValue
}

function useDebounce(func: () => void, delay: number, dependencies?: DependencyList) {

    useEffect(() => {

        const timeout = setTimeout(func, delay)

        return () => clearTimeout(timeout)

    }, dependencies)
}

export { useDebounce, useDebouncedValue }