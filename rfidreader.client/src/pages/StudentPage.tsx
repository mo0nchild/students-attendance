import Processing, { LoadingStatus } from "@components/processing/Processing"
import CustomTable, { HeaderType } from "@components/table/CustomTable"
import { useScanner } from "@core/hooks/scanner"
import { studentService } from "@services/StudentService"
import { createRef, CSSProperties, useEffect, useState } from "react" 
import { Button, Col, Container, Form, Row } from "react-bootstrap"
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
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
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
                setStatus('success') 
            })
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [groupId])
    const onSelectStudentHandler = (id: number) => {
        setSelected(students!.find(item => item.id == id)!)
        updateCheckRef.current!.checked = true
    }
    const onScanningRfidHandler = () => {}
    const [scanning, setScanning] = useState(false)
    useScanner(value => {
        console.log(value)
        setScanning(false)
    }, scanning)
    const surnameRef = createRef<HTMLInputElement>()
    const nameRef = createRef<HTMLInputElement>()
    const patronymicRef = createRef<HTMLInputElement>()
    const updateCheckRef = createRef<HTMLInputElement>()
    return (
    <Container fluid='md'>
        <h2 style={{marginBottom: '20px'}}>Управление студентами</h2>
        <Row>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Фамилия:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите фамилию' 
                        defaultValue={selected == null ? '' : selected.surname}/>  
                </Form.Group>  
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Имя:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите имя' 
                        defaultValue={selected == null ? '' : selected.name}/>  
                </Form.Group>  
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Отчество:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите отчество' 
                        defaultValue={selected == null ? '' : selected.patronymic}/>  
                </Form.Group>  
            </Col>
        </Row>
        <Row style={{margin: '10px 0px'}}>
            <Col sm={6} md={6} lg={4}>
                <p>Код пропуска: {selected?.rfidCode == null ? 'None' : selected.rfidCode}</p>
            </Col>
            <Col sm={6} md={6} lg={4}>
            <Form.Check type='checkbox' disabled={selected == null} label='Обновление' 
                ref={updateCheckRef} onChange={(event) => {
                    const { checked } = event.currentTarget
                    if (checked == false && selected != null) {
                        setSelected(null)
                    }
                }}
            />
            </Col>
        </Row>
        <Row className='gy-2 gx-3' style={{margin: '0px 0px 20px'}}>
            <Col sm={6} md={4}>
                <Button style={{width: '100%'}}>Считать пропуск</Button>
            </Col>
            <Col sm={6} md={4}>
                <Button style={{width: '100%'}}>
                    { selected == null ? 'Добавить' : 'Обновить' }
                </Button>
            </Col>
        </Row>
        <Row>
            <Processing status={status}>
                <div style={studentTableStyle}>
                    <CustomTable header={tableHeader} data={students!}
                        onClicked={(data) => onSelectStudentHandler(data.id)}/>
                </div>
            </Processing>
        </Row>
    </Container>
    )
}
const studentTableStyle: CSSProperties = {
    overflowX: 'auto'
}