import ModalWindow from "@components/modal/ModalWindow";
import Processing, { LoadingStatus } from "@components/processing/Processing";
import CustomTable, { DataType, HeaderType } from "@components/table/CustomTable";
import { useScanner } from "@core/hooks/scanner";
import { INewAttendance } from "@core/models/attendance";
import { IGroupInfo } from "@core/models/group";
import { IStudentOnLesson } from "@core/models/lesson";
import { attendanceService } from "@services/AttendanceService";
import { lessonService } from "@services/LessonService";
import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Accordion, Button, Col, Container, Dropdown, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'

const tableHeader: HeaderType[] = [
    {
        key: 'studentFIO',
        name: 'ФИО студента'
    },
    {
        key: 'groupInfo',
        name: 'Группа'
    }, 
    {
        key: 'time',
        name: 'Время посещения',
        formatter: (value) => {
            return typeof value == 'string' 
                ? (value.split('T').join(' ').split('-').join('.')) : ''
        }
    }
]
interface AttendanceTableInfo extends DataType {
    studentFIO: string
    groupInfo: string
    time: string | undefined
}
function convertToTableInfo({ student, time }: IStudentOnLesson): AttendanceTableInfo {
    const { name, surname, patronymic, group, id } = student
    return {
        groupInfo: `${group.faculty} ${group.name}`,
        studentFIO: `${surname} ${name[0]}. ${patronymic[0]}.`,
        id: id,
        time: time == null ? 'Отсутствует' : time
    }
}
type RfidScannerInfo = { code: string, time: Date }

export default function AttendancePage(): JSX.Element {
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    const [ updateUuid, setUpdateUuid ] = useState<string>(uuidv4())
    const [ attendances, setAttendances ] = useState<IStudentOnLesson[] | null>()
    
    const [ lesson, setLesson ] = useState<string | null>(null)
    const [ lessonGroups, setLessonGroups ] = useState<IGroupInfo[] | null>(null)
    
    const rfidCodes = useRef<RfidScannerInfo[]>([])
    const [ scanning, setScanning ] = useState<boolean>(false)
    const { lessonId, disciplineId } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if(!lessonId || !disciplineId) throw 'Не указан ИД занятия или дисциплины';
        (async() => {
            const attendancesResponse = (await lessonService.getInfo(parseInt(lessonId))).data
            setAttendances(attendancesResponse)

            const lessonResponse = (await lessonService.getLessonsByDiscipline(parseInt(disciplineId!)))
                .data.find(item => item.id == parseInt(lessonId))
            if (lessonResponse != undefined) {
                setLesson(lessonResponse.theme)
            }
            else throw 'Занятие не найдено'
            setLessonGroups((() => {
                const groups: IGroupInfo[] = [] 
                for(const { student } of attendancesResponse) {
                    if(!groups.some(item => item.id == student.group.id)) groups.push(student.group)
                }
                return groups
            })())
        })()
            .then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [disciplineId, lessonId, updateUuid])
    const onRemoveAttendanceHandler = useCallback(async (id: number) => {
        const { student } = attendances!.find(it => it.student.id == id)!
        try {
            if ((await attendanceService.removeAttendance(student.rfidCode, parseInt(lessonId!))).status == 200) {
                
                setUpdateUuid(uuidv4())
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [attendances, lessonId])
    const onAcceptAttendanceHandler = useCallback(async (id: number) => {
        const { student } = attendances!.find(it => it.student.id == id)!
        const request: INewAttendance = {
            lessonId: parseInt(lessonId!),
            rfidCodes: [ 
                {
                    code: student.rfidCode,
                    time: convertDateToString(new Date())
                }
            ]
        }
        try {
            if ((await attendanceService.addAttendances(request)).status == 200) {
                setUpdateUuid(uuidv4())
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [attendances, lessonId])
    const onRemoveAllAttendanceHandler = useCallback(async () => {
        try {
            if ((await attendanceService.removeAllAttendances(parseInt(lessonId!))).status == 200) {
                setUpdateUuid(uuidv4())
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [lessonId])
    useScanner(value => {
        if(value != undefined && value.length > 0) {
            rfidCodes.current.push({ code: value, time: new Date() })
        }
    }, scanning)
    useEffect(() => {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
            activeElement.blur()
        }
        if (!scanning && rfidCodes.current.length > 0) {
            console.log(rfidCodes.current)
            attendanceService.addAttendances({
                lessonId: parseInt(lessonId!),
                rfidCodes: rfidCodes.current.map(item => {
                    return { code: item.code, time: convertDateToString(item.time) }
                })
            })
                .then(() => {
                    alert('Запрос выполнен успешно')
                    setUpdateUuid(uuidv4())
                })
                .catch(error => {
                    console.log(error)
                    alert('Не удалось выполнить запрос')
                })
        }
    }, [lessonId, scanning])
    const attendanceAllProcent = useMemo<number | undefined>(() => {
        return !attendances ? undefined 
            : attendances?.filter(item => item.time != null).length / attendances.length
    }, [attendances]) 
    return (
    <div>
    <Container fluid='md'>
        <div style={pageHeaderStyle}>
            <a style={headerLinkStyle} onClick={() => navigate(-1)}>&#8592;&nbsp;
                <span style={{textDecoration: 'underline', textUnderlineOffset: '5px'}}>Назад</span>
            </a>
            <h2 style={{display: 'inline-block'}}>Управление занятием [{lesson}]</h2>
        </div>
        <Row className='gy-2 gy-lg-3 gx-3 mb-4 justify-content-center'>
            <Col sm={12} md={6} lg={4}>
                <Button style={{width: '100%'}} onClick={(event) => {
                    event.currentTarget.blur()
                    setScanning(true)
                }}>
                    Сканировать пропуски
                </Button>
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Button style={{width: '100%'}} onClick={onRemoveAllAttendanceHandler}>
                    Удалить все посещения
                </Button>
            </Col>
        </Row>
        <Row className='gy-2 gy-lg-3 gx-3 mb-4 justify-content-center'>
            <Col sm={12} md={6} lg={4}>
                <AnalyticGroupInfo groupsList={lessonGroups} attendances={attendances}/>
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Accordion>
                    <Accordion.Item eventKey='1'>
                        <Accordion.Header>Общая статистика</Accordion.Header>
                        <Accordion.Body className='d-flex flex-column gap-2'>
                            <div style={{color: 'white'}}>
                                <p className='m-0'>
                                    Процент посещения пары: {((attendanceAllProcent ?? 0) * 100).toFixed(2)}%
                                </p>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
        <Row>
            <Processing status={status}>
                <div style={attendanceTableStyle}>
                    <CustomTable header={tableHeader} data={attendances == null ? [] : attendances?.map(it => {
                        return convertToTableInfo(it)
                    })}
                    contextMenu={[
                        {
                            name: 'Отметить студента',
                            onClick: ({ id }) => onAcceptAttendanceHandler(id)
                        },
                        {
                            name: 'Удалить посещение',
                            onClick: ({ id }) => onRemoveAttendanceHandler(id)
                        }
                    ]}/>
                </div>
            </Processing>
        </Row>
    </Container>
    <ModalWindow isOpen={scanning} onClose={() => {
        setScanning(false)
        rfidCodes.current = []
    }}>
        <div style={scannerModalStyle}>
            <Spinner animation="grow" />
            <p>Сканирование пропусков...</p>
            <Button onClick={() => setScanning(false)}>Зарегистрировать посещения</Button>
        </div>
    </ModalWindow>
    </div>
    )
}
const attendanceTableStyle: CSSProperties = {
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
function convertDateToString(date: Date): string {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
interface AnalyticGroupInfoProps {
    groupsList: IGroupInfo[] | null
    attendances: IStudentOnLesson[] | undefined | null
}
function AnalyticGroupInfo({ groupsList, attendances } : AnalyticGroupInfoProps): JSX.Element {
    const [ analyticGroup, setAnalyticGroup ] = useState<IGroupInfo | null>(null)
    const selectedGroupName = useMemo(() => {
        return analyticGroup == null ? 'Выберите группу' : (() => {
            const { name, faculty } = analyticGroup
            return `${faculty} ${name}`
        })()
    }, [analyticGroup])
    const shitValue = useMemo(() => {
        const filtered = attendances?.filter(({student}) => student.group.id == analyticGroup?.id)
        return filtered ? { 
            value: filtered?.filter(({time}) => time != null).length / filtered?.length
        } : undefined
    }, [analyticGroup, attendances])
    return(
    <div>
    <Accordion defaultActiveKey={null} onSelect={item => {if(item == null) setAnalyticGroup(null)}}>
        <Accordion.Item eventKey='0'>
            <Accordion.Header>Статистика по группам</Accordion.Header>
            <Accordion.Body className='d-flex flex-column gap-4'>
                <Dropdown>
                    <Dropdown.Toggle className='w-100'>{selectedGroupName}</Dropdown.Toggle>
                    <Dropdown.Menu>
                    {
                        groupsList?.map((item, index) => {
                            const { faculty, name } = item
                            return (
                            <Dropdown.Item key={`lesson-group#${index}`} onClick={() => setAnalyticGroup(item)}>
                                {`${faculty} ${name}`}
                            </Dropdown.Item>
                            )
                        })
                    }
                    </Dropdown.Menu>
                </Dropdown>
                <div style={{color: 'white'}}>
                { !shitValue || analyticGroup == null ? <></> 
                    : <p className='m-0'>Посещения от группы: {(shitValue.value * 100).toFixed(2)}%</p> }
                </div>
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
    </div>
    )
}