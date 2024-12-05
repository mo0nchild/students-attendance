import { Table } from "react-bootstrap";
import style from './CustomTable.module.css'

export interface DataType {
    [key: string]: string | number | undefined,
    id: number
}
export type HeaderType = { key: string, name: string }

export interface ICustomTableProps {
    data: DataType[]
    header: HeaderType[]
    onClicked?: (data: DataType) => void
    minSize?: number
}
const tableMinSize = 5
export default function CustomTable(props: ICustomTableProps): JSX.Element {
    const { data, header, onClicked } = props
    const minSize = props.minSize == undefined ? tableMinSize : props.minSize
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
    </div>
    )
}