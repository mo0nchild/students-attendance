import { CSSProperties } from "react"
import { Dropdown, ListGroup } from "react-bootstrap"

type MenuItems<TItem> = { name: string, onClick: (item: TItem) => void }
type DateItems<TItem> = { name: string, data: TItem[] | null }
export interface CustomListGroupProps<TItem> {
    data: DateItems<TItem>[]
    menuItems: MenuItems<TItem>[]
}
export default function CustomListGroup<TItem>({ data, menuItems }: CustomListGroupProps<TItem>): JSX.Element {
    return (
    <div>
    <ListGroup>
        {
        data == null ? <div></div> : data!.map(({data, name}, index) => {
            return (
            <ListGroup.Item key={`listgroup#${index}`}>
                <Dropdown>
                    <Dropdown.Toggle style={toggleStyle}>{ name }</Dropdown.Toggle>
                    <Dropdown.Menu>
                    {
                        menuItems.map(it => {
                            return <Dropdown.Item onClick={() => it.onClick(data)}>{it.name}</Dropdown.Item>
                        })
                    }
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup.Item>
            )
        })
        }
        </ListGroup>
    </div>
    )
}
const toggleStyle: CSSProperties = {
    background: 'transparent',
    border: 'none'
}