import { Spinner } from "react-bootstrap";

export interface ProcessingProps {
    children: JSX.Element
    status: LoadingStatus
}
export type LoadingStatus = 'loading' | 'failed' | 'success'

export default function Processing(props: ProcessingProps): JSX.Element {
    switch(props.status) {
        case 'failed': return <div>Failed. Try again</div>
        case 'loading': return <Spinner animation="grow" variant="light" />
        case 'success': return props.children
    }
}