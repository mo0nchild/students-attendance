/* eslint-disable @typescript-eslint/explicit-function-return-type */
import ModalWindow from "@components/modal/ModalWindow";
import CustomTable, { DataType, HeaderType } from "@components/table/CustomTable";
import { useScanner } from "@core/hooks/scanner";
import { IGroupInfo } from "@core/models/group";
import { INewStudent, IStudentInfo } from "@core/models/student";
import { getStudentsFromString, StudentFileData } from "@core/utils/fileSystem";
import { groupService } from "@services/GroupService";
import { studentService } from "@services/StudentService";
import { AxiosError } from "axios";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
        key: 'rfid',
        name: 'Код пропуска',
        formatter: (value) => value == '' ? 'Не указано' : `${value}`
    }
]

type ImportingTableInfo = StudentFileData & DataType & { rfid: string | null }
export default function ImportingPage(): JSX.Element {
    const [ students, setStudents ] = useState<ImportingTableInfo[]>([])
    const [ group, setGroup ] = useState<IGroupInfo | null>(null)
    const [ current, setCurrent ] = useState<number | null>(null) 

    const [ currentFilePath, setCurrentFilePath ] = useState<string>()
    const [ scanning, setScanning ] = useState<boolean>(false)

    const filePath = useLocation().state?.filePath as string | undefined
    const { groupId } = useParams()
    useEffect(() => {
        if (!filePath) throw 'Не передан путь к файлу'
        console.log(filePath)
        setCurrentFilePath(filePath)
    }, [filePath])
    useEffect(() => {
        if (!currentFilePath) return
        (async() => {
            const text = await window.api.getFileData({path: currentFilePath})
            let data = await getStudentsFromString(text)
            if (data.length <= 0) {
                setCurrentFilePath(undefined)
                alert('Импортированный список пуст')
                return window.electron.ipcRenderer.send('focus-fix')
            }
            if (groupId) {
                const currentStudents = (await studentService.getStudentsByGroup(parseInt(groupId))).data
                data = data.filter(item => !currentStudents.some(it => studentsEquals(it, item)))
                if (data.length <= 0) {
                    alert('Все студенты из списка уже добавлены')
                    window.electron.ipcRenderer.send('focus-fix')
                    return navigate(-1)
                }
            }
            setStudents(data.map((item, index) => ({ 
                surname: item.surname,
                name: item.name,
                patronymic: item.patronymic, 
                id: index,
                rfid: null
            }  as ImportingTableInfo)))
        })().catch(error => console.log(error))
    }, [currentFilePath])

    useScanner(value => {
        if(value != undefined && value.length > 0) {
            students[students.findIndex(it => it.id == current)].rfid = value
            setStudents([ 
                ...(students.filter(it => it.rfid)),
                ...(students.filter(it => !it.rfid)) 
            ])
            setScanning(false)
            setCurrent(null)
        }
    }, scanning)
    const navigate = useNavigate()

    useEffect(() => {
        groupService.getAllGroups()
            .then(({data}) => {
                setGroup(data.find(item => item.id == parseInt(groupId!)) ?? null)
            })
            .catch(error => console.log(error))
    }, [groupId])
    const onSelectStudentHandler = useCallback((id: number) => {
        setCurrent(id)
        setScanning(true)
    }, [])
    const onImportingHandler = useCallback(async () => {
        setCurrentFilePath(await window.api.openFileDialog())
    }, [])
    const onAcceptImportHandler = useCallback(async () => {
        if (students.length <= 0) {
            alert('Список студентов пуст')
            return window.electron.ipcRenderer.send('focus-fix')
        }
        const newStudents = students.filter(it => it.rfid != null)
            .map(({ name, surname, patronymic, rfid }) => ({ 
                rfidCode: rfid,
                groupId: parseInt(groupId!),
                surname,
                name,
                patronymic,
             }) as INewStudent)
        console.log(newStudents)
        if (newStudents.length > 0) {
            try {
                await studentService.addAllStudents(newStudents)
            }
            catch(error) {
                if (error instanceof AxiosError && error.response) {
                    const checkError = /^RfidCode (?<rfid>\w+) duplicate$/g.exec(error.response.data)
                    if (checkError && checkError.groups) {
                        alert(`Дублирование код пропуска: ${checkError.groups.rfid}`)
                        window.electron.ipcRenderer.send('focus-fix')
                    }
                }
                return
            }
            navigate(`/students/${groupId}/${group?.name}`)
        }
        else {
            alert(`Ни у одного студента не указан код пропуска`)
            window.electron.ipcRenderer.send('focus-fix')
        }
    }, [group?.name, groupId, navigate, students])
    return (
    <div>
        <Container fluid='sm'>
            <div style={pageHeaderStyle}>
                <a style={headerLinkStyle} onClick={() => navigate(-1)}>&#8592;&nbsp;
                    <span style={{textDecoration: 'underline', textUnderlineOffset: '5px', cursor: 'pointer'}}>Назад</span>
                </a>
                <h2 style={{display: 'inline-block'}}>
                    Управление группой [{`${group?.faculty} ${group?.name}`}]
                </h2>
            </div>
            <Row className='justify-content-center'>
            {
            (() => {
                if (students.length > 0) return (
                <>
                    <Col sm={12} md={6} lg={4} className='h-100 mb-3'>
                        <Button className='w-100' onClick={onImportingHandler}>Выбрать другой файл</Button>
                    </Col>
                    <Col sm={12} md={6} lg={4} className='h-100 mb-3'>
                        <Button className='w-100' onClick={onAcceptImportHandler}>Импортировать</Button>
                    </Col>
                    <div style={studentTableStyle}>
                        <CustomTable header={tableHeader} data={students}
                            onClicked={(data) => onSelectStudentHandler(data.id)}/>
                    </div>
                </>
                ) 
                else return (
                <Col sm={12} md={6} lg={4} className='h-100'>
                    <Button className='w-100' onClick={onImportingHandler}>Выбрать файл</Button>
                </Col>
                )
            })()
            }
            </Row>
        </Container>
        <ModalWindow isOpen={scanning} onClose={() => {
            setScanning(false)
            setCurrent(null)
        }}>
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
function studentsEquals(student1: IStudentInfo, student2: StudentFileData): boolean {
    const studentFIO1 = `${student1.surname} ${student1.name} ${student1.patronymic}`
    const studentFIO2 = `${student2.surname} ${student2.name} ${student2.patronymic}`
    return studentFIO1 == studentFIO2
}