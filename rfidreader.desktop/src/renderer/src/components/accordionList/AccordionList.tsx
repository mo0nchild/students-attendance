/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GroupByResult } from "@renderer/utils/processing"
import { CSSProperties, useCallback, useEffect, useMemo, useState } from "react"
import { Accordion, ListGroup, Dropdown, useAccordionButton, Card } from "react-bootstrap"
import style from './AccordionList.module.css'

export type AccordionListData = { 
    id: number,
    name: string,
}
export type ContextMenuData = { name: string, onClick: () => void }

interface CustomToggleProps {
    children: JSX.Element | string, 
    eventKey: string,
    actionMenu?: (ContextMenuData | undefined)[],
    currentKey: string
}

function CustomToggle({ children, eventKey, actionMenu, currentKey }: CustomToggleProps): JSX.Element {
    const [ toggled, setToggled ] = useState<boolean>(false)
    const decoratedOnClick = useAccordionButton(eventKey, () => {
        setToggled(!toggled)
    })
    useEffect(() => {
        if (eventKey != currentKey) setToggled(false)
    }, [currentKey])
    const togglerIconStyle = useMemo(() => toggled ? style.accordionIsToggledIcon : '', [toggled])
    return (
    <div className={`${style.accordionToggler} justify-content-between`} >
        <div onClick={decoratedOnClick} className={style.accordionToggler}>
            <div className={`${style.accordionTogglerIcon} ${togglerIconStyle}`}></div>
            <div>{children}</div>
        </div>
        {
        !actionMenu ? <></>
            : <Dropdown>
                <Dropdown.Toggle>Действия</Dropdown.Toggle>
                <Dropdown.Menu>
                {
                actionMenu.map((item, index) => {
                    if (!item) return <></>
                    return (
                    <Dropdown.Item key={`actionmenu-item${index}`} onClick={item.onClick}>
                        {item.name}
                    </Dropdown.Item>
                    )
                })
                }
                </Dropdown.Menu>
            </Dropdown>
        }
    </div>
    )
}
export interface AccordionListProps<TData extends AccordionListData> {
    listData: GroupByResult<TData> | undefined,
    contextMenu: (item: TData, key: string) => (ContextMenuData | undefined)[],

    actionMenu?: (keyName: string) => (ContextMenuData | undefined)[],
    additionalInfo?: (item: TData) => string
    minListLines?: number
}
export function AccordionList<TData extends AccordionListData>(props: AccordionListProps<TData>): JSX.Element {
    const { listData, contextMenu, additionalInfo, actionMenu, minListLines } = props
    const [activeKey, setActiveKey] = useState('-1')
    if (!listData) return (
        <div className='d-flex flex-column align-items-center mt-5'>
            <h4>Список групп пуст</h4>
        </div>
    )
    const handleSelect = useCallback(eventKey => {
        setActiveKey(eventKey)
        console.log(`Active key changed to: ${eventKey}`)
    }, [])
    return (<>
    <Accordion activeKey={activeKey} onSelect={handleSelect}>
    {
    Object.keys(listData).map((key, keyIndex, list) => {
        return (
        <Card key={`item#${keyIndex}`}>
            <Card.Header className={style.accordionHeader}>
                <CustomToggle eventKey={keyIndex.toString()} currentKey={activeKey}
                    { ...(actionMenu ? {actionMenu: actionMenu(key)} : {}) }>
                    {key}
                </CustomToggle>
            </Card.Header>
            <Accordion.Collapse className={style.accordionBody} eventKey={keyIndex.toString()} 
                {...(keyIndex == list.length - 1 ? {'data-end': 'true'} : {})}>
            <Card.Body>
                <ListGroup>
                { (() => {
                    if (listData[key].length <= 0) {
                        return <div>
                            <p className={style.emptyListLabel}>В данный момент список пуст</p>
                        </div>
                    }
                    return listData[key].map((item, index) => {
                        return (
                        <ListGroup.Item key={`item#${keyIndex}-${index}`} className='d-flex justify-content-between'>
                            <Dropdown>
                                <Dropdown.Toggle style={dropDownStyle}>{item.name}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                {
                                contextMenu(item, key).map((menuItem, menuIndex) => {
                                    if (!menuItem) return <></>
                                    return (
                                    <Dropdown.Item key={`context-item#${menuIndex}`} onClick={() => menuItem.onClick()}>
                                        {menuItem.name}
                                    </Dropdown.Item>
                                    )
                                })
                                }
                                </Dropdown.Menu>
                            </Dropdown>
                            {
                            !additionalInfo
                                ? <></>
                                : <div className='d-flex align-items-center'>
                                    <span>{additionalInfo(item)}</span>
                                </div>
                            }
                        </ListGroup.Item>
                        )
                    })
                })() }
                </ListGroup>
            </Card.Body>
            </Accordion.Collapse>
        </Card>
        )
    })
    }
    {
    minListLines && Object.keys(listData).length < minListLines 
        ? [...Array(minListLines - Object.keys(listData).length).keys()].map((_, index) => {
            return (
            <Card key={`empty-item#${index}`}>
                <Card.Header className={`${style.accordionHeader} ${style.emptyListLine}`}></Card.Header>
            </Card>
            )
        })
        : <></>
    }
    </Accordion>
    </>)
}
const dropDownStyle: CSSProperties = {
    width: '70%',
    textAlign: 'start',
    background: 'transparent',
    border: 'none'
}