import ModalWindow from "@components/modal/ModalWindow";
import Processing, { LoadingStatus } from "@components/processing/Processing";
import CustomTable, { DataType, HeaderType } from "@components/table/CustomTable";
import { useScanner } from "@core/hooks/scanner";
import { INewAttendance } from "@core/models/attendance";
import { IStudentOnLesson } from "@core/models/lesson";
import { getPreviousPagePath } from "@core/utils/routers";
import { attendanceService } from "@services/AttendanceService";
import { lessonService } from "@services/LessonService";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

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
    const [ updateUuid, setUpdateUuid ] = useState<string>(crypto.randomUUID())
    const [ attendances, setAttendances ] = useState<IStudentOnLesson[] | null>()
    const [ lesson, setLesson ] = useState<string | null>(null)

    const rfidCodes = useRef<RfidScannerInfo[]>([])
    const [ scanning, setScanning ] = useState<boolean>(false)
    const { lessonId, disciplineId } = useParams()
    useEffect(() => {
        if(!lessonId || !disciplineId) throw 'Не указан ИД занятия или дисциплины';
        (async() => {
            setAttendances((await lessonService.getInfo(parseInt(lessonId))).data)
            const lessonResponse = (await lessonService.getLessonsByDiscipline(parseInt(disciplineId!)))
                .data.find(item => item.id == parseInt(lessonId))
            if (lessonResponse != undefined) {
                setLesson(lessonResponse.theme)
            }
            else throw 'Занятие не найдено'
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
                alert('Запрос успешно выполнен')
                setUpdateUuid(crypto.randomUUID())
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
                alert('Запрос успешно выполнен')
                setUpdateUuid(crypto.randomUUID())
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
                alert('Запрос успешно выполнен')
                setUpdateUuid(crypto.randomUUID())
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
                    setUpdateUuid(crypto.randomUUID())
                })
                .catch(error => {
                    console.log(error)
                    alert('Не удалось выполнить запрос')
                })
        }
    }, [lessonId, scanning])
    return (
    <div>
    <Container fluid='md'>
        <div style={pageHeaderStyle}>
            <Link style={headerLinkStyle} to={getPreviousPagePath()}>&#8592;&nbsp;
                <span style={{textDecoration: 'underline', textUnderlineOffset: '5px'}}>Назад</span>
            </Link>
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
            <Button onClick={() => setScanning(false)}>
                Зарегистрировать посещения
            </Button>
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