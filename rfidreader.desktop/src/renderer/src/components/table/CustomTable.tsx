/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Table } from "react-bootstrap";
import style from './CustomTable.module.css'
import { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid'

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
    tableMinSize?: number,
    striped?: boolean,
    separators?: number[]
    defaultSort?: SortingColumnInfo
}
type ContextPosition = { x: number, y: number }
type TableRowClickedEvent = React.MouseEvent<HTMLElement, MouseEvent>

const contextOffset = { offsetX: 10, offsetY: 30 }
const tableMinSizeDefault = 5

type SortingColumnInfo = {
    columnName: string,
    sortDirection: 'up' | 'down'
}
export default function CustomTable(props: ICustomTableProps): JSX.Element {
    const { data, header, contextMenu, onClicked, striped, separators } = props
    const minSize = useMemo(() => {
        return props.tableMinSize == undefined ? tableMinSizeDefault : props.tableMinSize
    }, [props.tableMinSize])

    const [ contextPosition, setContextPosition ] = useState<ContextPosition | null>(null)
    const [ selected, setSelected ] = useState<DataType | null>()
    const [ sortingColumn, setSortingColumn ] = useState<SortingColumnInfo | undefined>(props.defaultSort)
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
    const onSortingClickedHandler = useCallback((columnName) => {
        if (sortingColumn && columnName == sortingColumn.columnName) {
            switch (sortingColumn.sortDirection) {
                case 'down':
                    setSortingColumn({...sortingColumn, sortDirection: 'up'})
                    break
                case 'up': 
                    setSortingColumn({...sortingColumn, sortDirection: 'down'})
                    break
                default: break
            }
        }
        else setSortingColumn({columnName, sortDirection: 'up'})
    }, [sortingColumn])
    const sortingData = useMemo(() => {
        if (sortingColumn) return data.sort((a, b) => {
            if (a[sortingColumn.columnName] && b[sortingColumn.columnName]) {
                return sortingColumn.sortDirection == 'up' 
                    ? a[sortingColumn.columnName]!.toString().localeCompare(b[sortingColumn.columnName]!.toString())
                    : b[sortingColumn.columnName]!.toString().localeCompare(a[sortingColumn.columnName]!.toString())
            }
            else throw 'Невозможно отсортировать'
        })
        else return data
    }, [data, sortingColumn])
    return (
    <div>
    <Table striped={striped ?? false} bordered hover className={style.tableMain} variant='dark'>
        <thead>
            <tr>{ header.map((item, index) => {
                return (
                    <th key={`table-header#${index}`}>
                        <div className='d-flex justify-content-between align-items-center' style={{cursor: 'pointer'}} 
                                onClick={() => onSortingClickedHandler(item.key)}>
                            <span>{item.name}</span>
                            { 
                            sortingColumn && sortingColumn.columnName == item.key 
                                ? <div className={`${style.sortingArrow} ${sortingColumn.sortDirection == 'up' ? style.sortingArrowIsToggled : null}`}></div> 
                                : <></> 
                            }
                        </div>
                    </th>
                )
            }) }</tr>
        </thead>
        <tbody key={uuidv4()}>
        {
        sortingData.map((item, index) => {
            const separatedStyle = separators && separators.some(it => it == index) && index != data.length - 1
                ? { borderBottom: '3px solid darkorchid' } as CSSProperties
                : { }
            return (
            <tr key={`table-row#${index}`} style={{...separatedStyle}}>
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