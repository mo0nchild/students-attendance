import { createRef, CSSProperties, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react"
import style from './Notifications.module.css'
import { Button, Toast } from "react-bootstrap"

interface NotificationsProps {
    list?: string[]
    onMessageRemove?: (index: number) => void 
}
const notificationListRef = createRef<HTMLDivElement>()
function NotificationsFC({list = [], ...props}: NotificationsProps = {}): JSX.Element {
    useEffect(() => {
        const scrollTarget = notificationListRef.current!.scrollHeight
        notificationListRef.current!.scrollTop = scrollTarget
    }, [list])
    return (
    <div style={{display: list.length <= 0 ? 'none': 'flex'}} className={style.notificationList}
            ref={notificationListRef}>
        
        {
        list.map((item, index) => {
            return (
            <div tabIndex={-1} key={`notification-${index}`}>
                <Toast style={notificationMessageStyle} onClose={() => props.onMessageRemove?.(index)}>
                    <Toast.Header>
                        <strong className="me-auto">Уведомление</strong>
                        <small>{index == list.length - 1 ? `Новое` : ``}</small>
                    </Toast.Header>
                    <Toast.Body>{item}</Toast.Body>
                </Toast>
            </div>
            )
        })
        }
        
    </div>
    )
}
export type NotificationsHandler = {
    readonly add: (message: string) => Promise<void>
    readonly clear: () => Promise<void>
}
const Notifications = forwardRef<NotificationsHandler, {}>((_, ref) => {
    const [ list, setList ] = useState<string[]>([])
    useImperativeHandle(ref, () => ({
        add: async message => setList([...list, message]),
        clear: async () => setList([])
    }))
    const onMessageRemoveHandler = useCallback((index: number) => {
        setList([...list.filter((_, i) => i != index)])
    }, [list])
    const onAllRemoveHandler = useCallback(() => setList([]), [list])
    if (list.length <= 0) return <></>
    return (
    <div className={style.notificationContainer}>
        <div style={{backgroundColor: '#222', fontWeight: 'bold'}}>Кол-во уведомлений: {list.length}</div>
        <NotificationsFC list={list} onMessageRemove={onMessageRemoveHandler}/>
        <Button tabIndex={-1} onMouseDown={onAllRemoveHandler}>Очистить уведомления</Button>
    </div>
    )
})
export default Notifications
const notificationMessageStyle: CSSProperties = {
    border: '1px solid white',
    width: '240px',
    borderRadius: '10px',
}