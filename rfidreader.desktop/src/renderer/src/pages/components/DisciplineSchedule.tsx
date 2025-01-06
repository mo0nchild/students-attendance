/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Processing, { LoadingStatus } from "@renderer/components/processing/Processing";
import CustomTable, { DataType, HeaderType } from "@renderer/components/table/CustomTable";
import { IDisciplineInfo } from "@renderer/models/discipline";
import { IGroupInfo } from "@renderer/models/group";
import { lessonService } from "@renderer/services/LessonService";
import { useEffect, useState } from "react";
import { useLessonContext } from "../contexts/LessonContext";

const tableHeader: HeaderType[] = [
    {
        key: 'theme',
        name: 'Тема занятия'
    },
    {
        key: 'time',
        name: 'Время проведения',
        formatter: (value) => {
            return typeof value == 'string' ? (value.split('T').join(' ').split('-').join('.')) : ''
        }
    },
    {
        key: 'groups',
        name: 'Группы',
        formatter: (value) => Array.isArray(value) ? value.join('\n') : ''
    },
]
interface DisciplineTableInfo extends DataType {
    theme: string,
    time: string,
    groups: string[]
}
export interface DisciplineScheduleProps {
    discipline: IDisciplineInfo | null,
    group: IGroupInfo | null
}
export function DisciplineSchedule({ discipline, group }: DisciplineScheduleProps): JSX.Element {
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    const [ schedules, setSchedules ] = useState<DisciplineTableInfo[]>([])
    const { selectLesson } = useLessonContext()
    useEffect(() => {
        if (!discipline || !group) return
        (async() => {
            const lessonsResponse = (await lessonService.getLessonsByDiscipline(discipline.id)).data
            const schedulesList = lessonsResponse.filter(it => it.groups.some(g => g.id == group.id))
                .map(({id, theme, time, groups}) => {
                    return {
                        id, 
                        theme, 
                        time,
                        groups: groups.map(({faculty, name}) => `${faculty} ${name}`)
                    } as DisciplineTableInfo
                }).sort((a, b) => b.time.localeCompare(a.time))
            setSchedules(schedulesList)
        })().then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [discipline, group])
    return (
    <div>
        <h2 className='fs-4 mb-3'>Расписание занятий:</h2>
        <Processing status={status}>
            <CustomTable data={schedules} header={tableHeader} contextMenu={[
                { name: 'Выбрать занятие', onClick: data => selectLesson(data.id) }
            ]}/>
        </Processing>
    </div>
    )
}