import ModalWindow from "@components/modal/ModalWindow"
import Processing, { LoadingStatus } from "@components/processing/Processing"
import CustomTable, { DataType, HeaderType } from "@components/table/CustomTable"
import { useScanner } from "@core/hooks/scanner"
import { IGroupInfo } from "@core/models/group"
import { IStudentInfo } from "@core/models/student"
import { groupService } from "@services/GroupService"
import { studentService } from "@services/StudentService"
import { AxiosError } from "axios"
import { createRef, CSSProperties, useCallback, useEffect, useState } from "react" 
import { Button, Col, Container, Dropdown, Form, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
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
interface StudentTableInfo extends DataType {
    surname: string
    name: string
    patronymic: string
    rfidCode: string
    group: string
}
const surnameRef = createRef<HTMLInputElement>()
const nameRef = createRef<HTMLInputElement>()
const patronymicRef = createRef<HTMLInputElement>()
const updateCheckRef = createRef<HTMLInputElement>()

function convertToTableInfo(info: IStudentInfo): StudentTableInfo {
    return {
        id: info.id,
        surname: info.surname,
        name: info.name,
        patronymic: info.patronymic,
        rfidCode: info.rfidCode,
        group: info.group.name
    } as StudentTableInfo
} 
export default function StudentPage(): JSX.Element {
    const [ students, setStudents ] = useState<StudentTableInfo[] | null>(null)
    const [ selected, setSelected ] = useState<StudentTableInfo | null>(null)
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    const [ scanning, setScanning ] = useState<boolean>(false)
    const [ rfidValue, setRfidValue ] = useState<string | null>(null)

    const [ groups, setGroups ] = useState<IGroupInfo[]>()
    const [ selectedGroup, setSelectedGroup ] = useState<IGroupInfo | null>(null)
    const [ updateUuid, setUpdateUuid ] = useState<string>(crypto.randomUUID())
    const { groupId, groupName } = useParams();
    useEffect(() => {
        if(!groupId) throw 'Группа не указана'
        studentService.getStudentsByGroup(parseInt(groupId))
            .then(response => {
                setStudents(response.data.map(p => convertToTableInfo(p)))
                console.log(response.data)
                setStatus('success') 
            })
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [groupId, groupName, updateUuid])
    useEffect(() => {
        groupService.getAllGroups()
            .then(item => setGroups(item.data))
            .catch(error => console.log(error))
    }, [])
    const onSelectStudentHandler = useCallback((id: number) => {
        const currentStudent = students!.find(item => item.id == id)!
        const currentGroup = groups!.find(item => item.name == currentStudent.group)!
        {
            setSelected(currentStudent)
            setRfidValue(currentStudent.rfidCode)
            setSelectedGroup(currentGroup)
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        updateCheckRef.current!.checked = true
    }, [groups, students])
    const onApplyStudentHandler = useCallback(async () => {
        if (rfidValue == null || rfidValue.length <= 0) {
            alert('Значение код пропуска не установлено')
            return
        }
        const requestData = {
            surname: surnameRef.current!.value,
            name: nameRef.current!.value,
            patronymic: patronymicRef.current!.value,
        }
        try {
            const response = selected == null ? await studentService.addStudent({
                ...requestData,
                groupId: parseInt(groupId!),
                rfidCode: rfidValue,
            }) : await studentService.updateStudent({
                ...requestData,
                id: selected.id,
                groupId: selectedGroup == null ? parseInt(groupId!) : selectedGroup.id,
                rfidCode: rfidValue
            })
            if (response.status == 200) {
                alert('Запрос успешно выполнен')
                setUpdateUuid(crypto.randomUUID())
                clearInputForm()
            }
        }
        catch(error) {
            if(error instanceof AxiosError && typeof error.response?.data == 'string') {
                if (error.response?.data.includes('RfidCode already exists:')) {
                    alert(`Код пропуска уже зарегистрирован: ${error.response?.data.split(':')[1]}`)
                }
            }
            else alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [groupId, rfidValue, selected, selectedGroup])
    const onRemoveStudentHandler = useCallback(async () => {
        if(selected != null) {
            if ((await studentService.removeStudent(selected.id)).status == 200) {
                alert('Запрос успешно выполнен')
                setUpdateUuid(crypto.randomUUID())
                clearInputForm()
            }
        }
    }, [selected])
    useEffect(() => {
        surnameRef.current!.value = selected == null ? '' : selected.surname
        nameRef.current!.value = selected == null ? '' : selected.name
        patronymicRef.current!.value = selected == null ? '' : selected.patronymic
    }, [selected, updateUuid])
    const clearInputForm = () => {
        updateCheckRef.current!.checked = false
        {
            setRfidValue(null)
            setSelected(null)
            setSelectedGroup(null)
        }
    }
    useScanner(value => {
        if(value != undefined && value.length > 0) {
            setScanning(false)
            setRfidValue(value)
        }
    }, scanning)
    return (
    <div>
    <Container fluid='sm'>
        <div style={pageHeaderStyle}>
            <Link style={headerLinkStyle} to={'/groups'}>&#8592;&nbsp;
                <span style={{textDecoration: 'underline', textUnderlineOffset: '5px'}}>Назад</span>
            </Link>
            <h2 style={{display: 'inline-block'}}>Управление студентами [{groupName}]</h2>
        </div>
        <Row className='gy-2 gy-lg-3 gx-3'>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Фамилия:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите фамилию' 
                        ref={surnameRef}/>  
                </Form.Group>  
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Имя:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите имя'
                        ref={nameRef}/>  
                </Form.Group>  
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Отчество:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите отчество'
                        ref={patronymicRef}/>  
                </Form.Group>  
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Dropdown style={drowDownStyle}>
                    <Dropdown.Toggle disabled={selected == null}>
                        { selectedGroup == null || selected == null ? 'Выбрать группу' : `${selectedGroup.faculty} ${selectedGroup.name}` }
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {
                        groups == undefined ? null : groups!.map((item, index) => {
                            return (
                            <Dropdown.Item key={index} eventKey={index} onClick={() => {
                                setSelectedGroup(item)
                            }}>{`${item.faculty} ${item.name}`}</Dropdown.Item>
                            )
                        })
                    }
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Row>
        <Row style={{margin: '10px 0px'}}>
            <Col sm={6} md={6} lg={4}>
                <p>Код пропуска: {rfidValue == null ? 'None' : rfidValue}</p>
            </Col>
            <Col sm={6} md={6} lg={4}>
            <Form.Check type='checkbox' disabled={selected == null} label='Обновление' 
                ref={updateCheckRef} onChange={(event) => {
                    const { checked } = event.currentTarget
                    if (checked == false && selected != null) {
                        setSelected(null)
                        setRfidValue(null)
                    }
                }}
            />
            </Col>
        </Row>
        <Row className='gy-2 gx-3' style={{margin: '0px 0px 20px'}}>
            <Col xs={12} sm={6} md={4} >
                <Button style={{width: '100%'}} onClick={(event) => {
                    event.currentTarget.blur()
                    setScanning(true)
                }}>
                    Считать пропуск
                </Button>
            </Col>
            <Col xs={12} sm={6} md={4}>
                <Button style={{width: '100%'}} disabled={selected == null} onClick={onRemoveStudentHandler}>
                    Удалить
                </Button>
            </Col>
            <Col xs={12} sm={6} md={4}>
                <Button style={{width: '100%'}} onClick={onApplyStudentHandler}>
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
    <ModalWindow isOpen={scanning} onClose={() => setScanning(false)}>
        <div style={scannerModalStyle}>
            <Spinner animation="grow" />
            <p>Сканирование пропуска...</p>
        </div>
    </ModalWindow>
    <ModalWindow isOpen={scanning} onClose={() => setScanning(false)}>
        <div style={scannerModalStyle}>
            <Spinner animation="grow" />
            <p>Сканирование пропуска...</p>
        </div>
    </ModalWindow>
    </div>
    )
}
const studentTableStyle: CSSProperties = {
    overflowX: 'auto'
}
const drowDownStyle: CSSProperties = {
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'end'
}
const pageHeaderStyle: CSSProperties = {
    marginBottom: '14px', 
}
const headerLinkStyle: CSSProperties = { 
    color: 'white', 
    display: 'inline-block', 
    marginRight: '10px',
}
const scannerModalStyle: CSSProperties = {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    gap: '10px'
}