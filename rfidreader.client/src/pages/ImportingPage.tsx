import ModalWindow from "@components/modal/ModalWindow";
import CustomTable, { DataType, HeaderType } from "@components/table/CustomTable";
import { useScanner } from "@core/hooks/scanner";
import { IGroupInfo } from "@core/models/group";
import { INewStudent } from "@core/models/student";
import { getStudentsFromFile, StudentFileData } from "@core/utils/fileSystem";
import { groupService } from "@services/GroupService";
import { studentService } from "@services/StudentService";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

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

    const [ scanning, setScanning ] = useState<boolean>(false)
    useScanner(value => {
        if(value != undefined && value.length > 0) {
            students[students.findIndex(it => it.id == current)].rfid = value

            setScanning(false)
            setCurrent(null)
        }
    }, scanning)
    const navigate = useNavigate()
    const { groupId } = useParams()
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
        const data = await getStudentsFromFile()
        if (data.length <= 0) {
            alert('Импортированный список пуст')
            return
        }
        setStudents(data.map((item, index) => ({ 
            surname: item.surname,
            name: item.name,
            patronymic: item.patronymic, 
            id: index,
            rfid: null
        }  as ImportingTableInfo)))
    }, [])
    const onAcceptImportHandler = useCallback(async () => {
        if (students.length <= 0) {
            alert('Список студентов пуст')
            return
        }
        const newStudents = students.filter(it => it.rfid != null)
            .map(({ name, surname, patronymic, rfid }) => ({ 
                rfidCode: rfid,
                groupId: parseInt(groupId!),
                surname,
                name,
                patronymic,
             }) as INewStudent)
        if (newStudents.length > 0) {
            await studentService.addAllStudents(newStudents)
            navigate(`/students/${groupId}/${group?.name}`)
        }
        else alert(`Ни у одного студента не указан код пропуска`)
    }, [group?.name, groupId, navigate, students])
    return (
    <div>
        <Container fluid='sm'>
            <div style={pageHeaderStyle}>
                <a style={headerLinkStyle} onClick={() => navigate(-1)}>&#8592;&nbsp;
                    <span style={{textDecoration: 'underline', textUnderlineOffset: '5px'}}>Назад</span>
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