/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useState } from "react"

export interface ResolutionActionType {
	onSmAction?: () => void,
	onMdAction?: () => void,
	onLgAction?: () => void
}

export default function useResolutions(actions: ResolutionActionType): void {
	const breakpoint = useBreakpoints()
	useEffect(() => {
		switch(breakpoint) {
			case 'sm': actions.onSmAction?.(); break
			case 'md': actions.onMdAction?.(); break
			case 'lg': actions.onLgAction?.(); break
			default: actions.onLgAction?.()
		}
	}, [breakpoint])
} 

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export const SIZE_XS: Breakpoint = 'xs'
export const SIZE_SM: Breakpoint = 'sm'
export const SIZE_MD: Breakpoint = 'md'
export const SIZE_LG: Breakpoint = 'lg'
export const SIZE_XL: Breakpoint = 'xl'
export const SIZE_XXL: Breakpoint = 'xxl'

const resolveBreakpoint = ( width: number ): Breakpoint => {
	if ( width < 576 ) return SIZE_XS
	else if ( width >= 576 && width < 768 ) return SIZE_SM
	else if ( width >= 768 && width < 992 ) {
		return SIZE_MD
	} else if ( width >= 992 && width < 1200 ) {
		return SIZE_LG
	} else if ( width >= 1200 && width < 1440 ) {
		return SIZE_XL
	} else return SIZE_XXL
};
const windowResizeEvent = new EventTarget()
window.electron.ipcRenderer.on('resize', () => {
	windowResizeEvent.dispatchEvent(new Event('resize'))
})
export function useBreakpoints(): Breakpoint {
    const [size, setSize] = useState(() => resolveBreakpoint(window.innerWidth))
	useEffect(() => {
		console.log(size, window.innerWidth)
	}, [size])
	useEffect(() => {
		const calcInnerWidth = function() {
			setSize(resolveBreakpoint(window.innerWidth))
		}
		window.addEventListener('resize', calcInnerWidth)
		windowResizeEvent.addEventListener('resize', calcInnerWidth)
		return () => {
			window.removeEventListener('resize', calcInnerWidth)
			windowResizeEvent.removeEventListener('resize', calcInnerWidth)
		}
	}, [])
	return size
}
