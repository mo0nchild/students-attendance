/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Processing, { LoadingStatus } from "@renderer/components/processing/Processing"
import { useLessonContext } from "../contexts/LessonContext"
import { useEffect, useState } from "react"
import CustomTable, { DataType, HeaderType } from "@renderer/components/table/CustomTable"
import { lessonService } from "@renderer/services/LessonService"
import { IStudentOnLesson } from "@renderer/models/lesson"
import { IGroupInfo } from "@renderer/models/group"

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
interface LessonInfoProps { group: IGroupInfo | null }

export default function LessonInfo({group}: LessonInfoProps): JSX.Element {
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    const [ attendances, setAttendances ] = useState<AttendanceTableInfo[]>([])
    const [ groupStudents, setGroupStudents ] = useState<number>(0)
    const { selectedLessonId, selectLesson } = useLessonContext()
    useEffect(() => {
        if(!selectedLessonId) throw 'Не указан ИД занятия';
        if(!group) throw 'Не указана группа студентов';
        (async () => {
            const lessonResponse = (await lessonService.getInfo(selectedLessonId)).data
            const groupStudents = lessonResponse.filter(it => it.student.group.id == group.id)
                .map(it => convertToTableInfo(it))
            setAttendances([
                ...groupStudents,
                ...(lessonResponse.filter(it => it.student.group.id != group.id)
                    .map(it => convertToTableInfo(it)).sort((a, b) => a.groupInfo.localeCompare(b.groupInfo)))
            ])
            setGroupStudents(groupStudents.length - 1)
        })().then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [selectedLessonId])
    return (
    <div>
        <button onClick={() => selectLesson(undefined)}>Назад</button>
        <Processing status={status}>
            <CustomTable header={tableHeader} data={attendances} separators={[groupStudents]} tableMinSize={1}
                contextMenu={[
                    {
                        name: 'Отметить студента',
                        onClick: ({ id }) => {}
                    },
                    {
                        name: 'Удалить посещение',
                        onClick: ({ id }) => {}
                    }
                ]}/>
        </Processing>
    </div>
    )
}