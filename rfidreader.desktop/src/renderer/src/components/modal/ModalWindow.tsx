import { createRef, ReactNode, useEffect } from "react";
import { CloseButton } from "react-bootstrap";

import style from './ModalWindow.module.css'

export interface ModalWindowProps {
    isOpen: boolean,
    children: ReactNode,
    onClose?: () => void,
}
export default function ModalWindow(props: ModalWindowProps): JSX.Element {
    const { isOpen, children, onClose } = props
    const dialogRef = createRef<HTMLDialogElement>();
    useEffect(() => {
        if(isOpen) dialogRef.current?.showModal();
        else dialogRef.current?.close();
    }, [dialogRef, isOpen])
    return (
    <dialog ref={dialogRef} className={style['modal-window']}>
        <div className={style['modal-window-header']}>
            <CloseButton style={{
                width: '1.1rem',
                height: '1.1rem',
                backgroundSize: '100% 100%'
            }} onClick={onClose}/>
        </div>
        <div style={{width: '100%', height: '1px', backgroundColor: '#FFF'}}></div>
        <div style={{marginTop: '20px'}}>{ children }</div>
    </dialog>
    )
}