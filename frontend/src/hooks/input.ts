import { useCallback, useState } from "react"

const useInput = <T>(initialState: T) => {
	const [state, setState] = useState<T>(initialState)
	const onChange = useCallback(
		<K extends keyof T>(property: K, value: string) =>
			setState((prev) => ({ ...prev, [property]: value })),
		[],
	)
	const resetInputs = useCallback(
		() => setState((prev) => initialState),
		[initialState],
	)

	return { state, onChange, resetInputs }
}

export { useInput }
