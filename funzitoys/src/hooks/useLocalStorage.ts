import { useState } from 'react'
export function useLocalStorage<T>(key: string, initial: T): [T, (val: T) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : initial } catch { return initial }
  })
  const set = (val: T) => { setValue(val); try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }
  const remove = () => { setValue(initial); try { localStorage.removeItem(key) } catch {} }
  return [value, set, remove]
}
