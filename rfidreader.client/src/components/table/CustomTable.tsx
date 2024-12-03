import { Table } from "react-bootstrap";
import style from './CustomTable.module.css'

export interface DataType {
    [key: string]: string | number | undefined,
    id: number
}
export type HeaderType = { key: string, name: string }

export interface ICustomTableProps {
    data: DataType[]
    header: HeaderType[],
    onClicked?: (data: DataType) => void
}
export default function CustomTable(props: ICustomTableProps): JSX.Element {
    const { data, header, onClicked } = props
    return (
    <div>
    <Table striped bordered hover className={style.tableMain} variant='dark'>
        <thead>
            <tr>{ header.map((item, index) => <th key={`table-header#${index}`}>{item.name}</th>) }</tr>
        </thead>
        <tbody>
        {
        data.map((item, index) => {
            return (
            <tr key={`table-row#${index}`} onClick={() => onClicked?.(item)}>
                { header.map((p, i) => <td key={`tdata#${index}-${i}`}>{item[p.key]}</td>) }
            </tr>
            )
        })
        }
        </tbody>
    </Table>
    </div>
    )
}