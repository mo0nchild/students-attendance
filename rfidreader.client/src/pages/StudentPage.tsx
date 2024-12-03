import ModalWindow from "@components/modal/ModalWindow"
import CustomTable, {HeaderType} from "@components/table/CustomTable"
import { useScanner } from "@core/hooks/scanner"
import { studentService } from "@services/StudentService"
import { createRef, CSSProperties, useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useParams } from "react-router-dom"

const tableHeader: HeaderType[] = [
    {
        key: 'surname',
        name: 'Фамилия'
    },
    {
        key: 'name',
        name: 'Имя'
    },
    {
        key: 'patronymic',
        name: 'Отчество'
    },
    {
        key: 'rfidCode',
        name: 'Код пропуска'
    },
    {
        key: 'group',
        name: 'Группа'
    },
]
interface StudentTableInfo {
    [key: string]: string | number
    id: number
    surname: string
    name: string
    patronymic: string
    rfidCode: string
    group: string
}
export default function StudentPage(): JSX.Element {
    const [ students, setStudents ] = useState<StudentTableInfo[] | null>(null)
    const [ selected, setSelected ] = useState<StudentTableInfo | null>(null)
    const { groupId } = useParams();
    useEffect(() => {
        if(!groupId) throw ''
        studentService.getStudentsByGroup(parseInt(groupId))
            .then(item => {
                const data = item.data.map(p => ({
                    id: p.id,
                    surname: p.surname,
                    name: p.name,
                    patronymic: p.patronymic,
                    rfidCode: p.rfidCode,
                    group: p.group.name
                } as StudentTableInfo))
                setStudents(data) 
            })
            .catch(error => console.log(error))
    }, [groupId])
    const onSelectStudent = (id: number) => {
        setSelected(students!.find(item => item.id == id)!)
    }
    const [scanning, setScanning] = useState(false)
    useScanner(value => {
        console.log(value)
        setScanning(false)
    }, scanning)
    const updateNameRef = createRef<HTMLInputElement>()
    const updateSurnameRef = createRef<HTMLInputElement>()
    const updatePatronymicRef = createRef<HTMLInputElement>()
    return (
    <div>
        <NavLink to='/groups'>Назад</NavLink>
        {
            students == null ? <br/> :
                <div style={studentTableStyle}>
                <CustomTable header={tableHeader} data={students}
                    onClicked={(data) => onSelectStudent(data.id)}/>
                </div>
        }
        <ModalWindow isOpen={selected != null} onClose={() => setSelected(null)}>
            <div>
                <input type="text" ref={updateSurnameRef} defaultValue={selected?.surname}/>
                <input type="text" ref={updateNameRef} defaultValue={selected?.name}/>
                <input type="text" ref={updatePatronymicRef} defaultValue={selected?.patronymic}/>
                <p>rfidCode: {selected?.rfidCode}</p>
                <div>
                <Button onClick={() => {
                    setScanning(!scanning)
                }}> 
                    { !scanning ? 'Сканировать пропуск' : 'Отменить' }
                </Button>
                <Button>
                    Обновить
                </Button>
                </div>
            </div>
        </ModalWindow>
    </div>
    )
}
const studentTableStyle: CSSProperties = {
    overflowX: 'auto'
}