/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Processing, { LoadingStatus } from "@renderer/components/processing/Processing"
import { useLessonContext } from "../contexts/LessonContext"
import { CSSProperties, useEffect, useRef, useState } from "react"
import CustomTable, { DataType, HeaderType } from "@renderer/components/table/CustomTable"
import { lessonService } from "@renderer/services/LessonService"
import { ILessonInfo, IStudentOnLesson } from "@renderer/models/lesson"
import { IGroupInfo } from "@renderer/models/group"
import { Button, Form } from "react-bootstrap"
import useResolutions from "@renderer/hooks/breakpoints"
import { useNavigate } from "react-router-dom"

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
interface LessonInfoProps { 
    group: IGroupInfo | null,
    disciplineId: number | undefined,
    onScanning?: (lessonId: number) => void 
}
export default function LessonInfo({group, disciplineId, onScanning}: LessonInfoProps): JSX.Element {
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    const [ attendancesInfo, setAttendancesInfo ] = useState<AttendanceTableInfo[]>([])
    const [ groupStudents, setGroupStudents ] = useState<number>(0)
    const students = useRef<IStudentOnLesson[]>([])
    const { 
        selectedLessonId, 
        selectLesson,
        setAttendance,
        attendances,
        removeAttendance,
    } = useLessonContext()
    useEffect(() => {
        if(!selectedLessonId) throw 'Не указан ИД занятия';
        if(!group) throw 'Не указана группа студентов';
        (async () => {
            const lessonResponse = (await lessonService.getInfo(selectedLessonId)).data
            const groupStudents = lessonResponse.filter(it => it.student.group.id == group.id)
                .map(it => convertToTableInfo(it))
            setAttendancesInfo([
                ...groupStudents,
                ...(lessonResponse.filter(it => it.student.group.id != group.id)
                    .map(it => convertToTableInfo(it)).sort((a, b) => a.groupInfo.localeCompare(b.groupInfo)))
            ])
            students.current = lessonResponse
            setGroupStudents(groupStudents.length - 1)
        })().then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [selectedLessonId, attendances, group])
    
    const useAttendanceInfo = (id: number, action: (info: IStudentOnLesson) => void) => {
        if (students.current) {
            const result = students.current.find(it => it.student.id == id)
            if (result) action(result)
        } 
    }
    return (
    <div>
        <div className='mb-3 d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
                <button style={backButtonStyle} onClick={() => selectLesson(undefined)}></button>
                <h2 className='fs-4 mb-0 ms-3'>Информация о занятии</h2> 
            </div>
            <Button onClick={() => { if (selectedLessonId) onScanning?.(selectedLessonId) }}>
                Сканировать пропуски
            </Button>
        </div>
        <DisplayLessonInfo {...{disciplineId, lessonId: selectedLessonId}}/>
        <Processing status={status}>
            <CustomTable header={tableHeader} data={attendancesInfo.sort((a, b) => {
                return a.groupInfo.localeCompare(b.groupInfo) || a.studentFIO.localeCompare(b.studentFIO)
            })} 
                separators={[groupStudents]} tableMinSize={1}
                contextMenu={[
                    {
                        name: 'Отметить студента',
                        onClick: ({ id }) => useAttendanceInfo(id, ({ student }) => {
                            if (selectedLessonId) setAttendance(student.rfidCode, selectedLessonId)
                        })
                    },
                    {
                        name: 'Удалить посещение',
                        onClick: ({ id }) => useAttendanceInfo(id, ({ student }) => {
                            if (selectedLessonId) removeAttendance(student.rfidCode, selectedLessonId)
                        })
                    }
                ]}/>
        </Processing>
    </div>
    )
} 
function DisplayLessonInfo(props: { lessonId?: number, disciplineId?: number }): JSX.Element {
    const [ lessonInfo, setLessonInfo ] = useState<ILessonInfo>()
    const [ containerStyle, setContainerStyle ] = useState<CSSProperties>({})
    const navigate = useNavigate()
    useEffect(() => {
        (async() => {
            if (props.disciplineId) {
                const currentLesson = (await lessonService.getLessonsByDiscipline(props.disciplineId)).data
                    .find(it => it.id == props.lessonId)
                setLessonInfo(currentLesson)
            }
        })().catch(error => console.log(error))
    }, [props])
    useResolutions({
        onSmAction: () => setContainerStyle({
            gridTemplateColumns: '1fr'
        }),
        onMdAction: () => setContainerStyle({
            gridTemplateColumns: 'repeat(2, 1fr)'
        }),
        onLgAction: () => setContainerStyle({
            gridTemplateColumns: 'repeat(3, 1fr)'
        })
    })
    return (
    <div style={{...infoBoxStyle, ...containerStyle}} className='mb-3'>
        <div>
            <Form.Group>
                <Form.Label>Тема занятия:</Form.Label>
                <Form.Control type='text' value={lessonInfo?.theme}/>  
            </Form.Group>
        </div>
        <div>
            <Form.Group>
                <Form.Label>Время проведения:</Form.Label>
                <Form.Control type='text' value={lessonInfo?.time.split('T').join(' ').split('-').join('.')}/>  
            </Form.Group>
        </div>
        <div className='d-flex flex-column justify-content-end'>
            <Button onClick={() => navigate(`/lessons/${props.disciplineId}?lessonId=${props.lessonId}`)}>
                Редактировать
            </Button>
        </div>
    </div>
    )
}
const infoBoxStyle: CSSProperties = {
    display: 'grid',
    columnGap: '20px',
    rowGap: '10px'
}
const backButtonStyle: CSSProperties = {
    background: 'url(\'data:image/svg+xml,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="%23FFFFFF" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>\')',
    width: '30px',
    aspectRatio: '1 / 1',
    color: 'white',
    border: '2px solid white',
    padding: '10px',
    borderRadius: '20px'
}