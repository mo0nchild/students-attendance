import { Table } from "react-bootstrap";
import style from './CustomTable.module.css'
import { CSSProperties, useCallback, useEffect, useState } from "react";

type PropertyType = string | string[] | number
export interface DataType {
    [key: string]: PropertyType | undefined
    id: number
}
export type HeaderType = { 
    key: string, 
    name: string, 
    formatter?: (value: PropertyType) => string
}

export type TableContextMenu = {
    name: string,
    onClick: (data: DataType) => void
}
export interface ICustomTableProps {
    data: DataType[]
    header: HeaderType[]
    onClicked?: (data: DataType) => void
    contextMenu?: TableContextMenu[]
    minSize?: number
}
type ContextPosition = { x: number, y: number }
type TableRowClickedEvent = React.MouseEvent<HTMLElement, MouseEvent>

const contextOffset = { offsetX: 10, offsetY: 30 }
const tableMinSize = 5

export default function CustomTable(props: ICustomTableProps): JSX.Element {
    const { data, header, contextMenu, onClicked } = props
    const minSize = props.minSize == undefined ? tableMinSize : props.minSize

    const [ contextPosition, setContextPosition ] = useState<ContextPosition | null>(null)
    const [ selected, setSelected ] = useState<DataType | null>()
    const windowClickHandler = () => {
        if (contextMenu != undefined) setContextPosition(null)
    }
    useEffect(() => {
        window.addEventListener('click', windowClickHandler)
        window.addEventListener('resize', windowClickHandler)
        return () => {
            window.removeEventListener('click', windowClickHandler)
            window.removeEventListener('resize', windowClickHandler)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const rowClickedHandler = useCallback((event: TableRowClickedEvent, item: DataType) => {
        event.stopPropagation()
        if (contextMenu == undefined || contextMenu.length <= 0) {
            onClicked?.(item)
        }
        else {
            if(contextPosition == null) {
                const { top, left } = event.currentTarget.getBoundingClientRect()
                const { offsetX, offsetY } = contextOffset
                setContextPosition({ x: left + offsetX, y: top + offsetY })
                setSelected(item)
            }
            else setContextPosition(null)
        }
    }, [contextMenu, contextPosition, onClicked])
    return (
    <div>
    <Table striped bordered hover className={style.tableMain} variant='dark'>
        <thead>
            <tr>{ header.map((item, index) => <th key={`table-header#${index}`}>{item.name}</th>) }</tr>
        </thead>
        <tbody key={crypto.randomUUID()}>
        {
        data.map((item, index) => {
            return (
            <tr key={`table-row#${index}`}>
            { 
                header.map((p, i) => {
                    const value = (p.formatter == undefined ? item[p.key] : p.formatter(item[p.key] ?? ''))
                    return (
                    <td onClick={(event) => rowClickedHandler(event, item)} key={`tdata#${index}-${i}`}>
                    {
                        typeof value == 'string' 
                            ? value.split('\n').map((out, t) => {
                                return <p key={`insidelist#${index}-${i}-${t}`} className='m-0'>{out}</p>
                            })
                            : value
                    }
                    </td>
                    )
                }) 
            }
            </tr>
            )
        })
        }
        {
        data.length < minSize ? Array.from(Array(minSize - data.length).keys()).map((_, index) => {
            return (
            <tr key={`table-fake#${index}`}>
                { header.map((_, i) => <td key={`tfake#${i}`}>&nbsp;</td>) }
            </tr>
            )
        }) : null
        } 
        </tbody>
    </Table>
    <div className={style.rowContextMenu} style={contextMenuStyle(contextPosition)}>
    {
        contextMenu == undefined || contextMenu.length <= 0 || selected == null ? <></>
            : contextMenu.map((item, index) => {
                return (
                <button key={`context-btn#${index}`} onClick={() => item.onClick(selected)}>
                    {item.name}
                </button>
                )
            })
    }
    </div>
    </div>
    )
}
const contextMenuStyle = (position: ContextPosition | null): CSSProperties => {
    return {
        display: position == null ? 'none' : 'flex',
        position: 'absolute',
        top: position == null ? '0px' : `${position.y.toFixed(0)}px`,
        left: position == null ? '0px' : `${position.x.toFixed(0)}px`,
    }
}