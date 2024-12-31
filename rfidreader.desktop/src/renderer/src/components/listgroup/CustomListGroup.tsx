import { CSSProperties, useMemo } from "react"
import { Dropdown, ListGroup } from "react-bootstrap"

type MenuItems<TItem> = { name: string, onClick: (item: TItem) => void }
type DateItems<TItem> = { name: string, data: TItem | null }
export interface CustomListGroupProps<TItem> {
    data: DateItems<TItem>[] | undefined
    menuItems: MenuItems<TItem>[],
    listMinSize?: number
}
const listMinSizeDefault = 5
export default function CustomListGroup<TItem>({ data, menuItems, listMinSize }: CustomListGroupProps<TItem>): JSX.Element {
    const dataLength = useMemo(() => data?.length ?? 0, [data])
    const minSize = useMemo(() => listMinSize == undefined ? listMinSizeDefault : listMinSize, [listMinSize])
    return (
    <div>
    <ListGroup>
        { data == null ? <></> : data!.map(({data, name}, index) => {
            return (
            <ListGroup.Item key={`listgroup#${index}`}>
                <Dropdown>
                    <Dropdown.Toggle style={toggleStyle}>{ name }</Dropdown.Toggle>
                    <Dropdown.Menu>
                    {
                        menuItems.map(it => {
                            return <Dropdown.Item onClick={() => it.onClick(data!)}>{it.name}</Dropdown.Item>
                        })
                    }
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup.Item>
            )
        }) }
        {
        (dataLength < minSize ? Array.from(Array(minSize - dataLength).keys()).map((_, index) => {
            return (
            <ListGroup.Item key={`listgroup-fake#${index}`}>
                <p style={{margin: '0', padding: '5px 0px'}}>&nbsp;</p>
            </ListGroup.Item>
            )
        }) : null)
        }
    </ListGroup>
    </div>
    )
}
const toggleStyle: CSSProperties = {
    background: 'transparent',
    border: 'none'
}