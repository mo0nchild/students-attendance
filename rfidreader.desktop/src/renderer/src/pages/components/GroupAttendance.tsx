/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Processing, { LoadingStatus } from "@renderer/components/processing/Processing"
import { ReportTable } from "@renderer/components/reportTable/ReportTable"
import { IDisciplineInfo } from "@renderer/models/discipline"
import { IGroupInfo } from "@renderer/models/group"
import { excelReport } from "@renderer/utils/excelReport"
import saveAs from "file-saver"
import { useState, useEffect, CSSProperties } from "react"
import { Button } from "react-bootstrap"
import { useLessonContext } from "../contexts/LessonContext"

export interface GroupAttendanceProps {
    currentGroup: IGroupInfo | null
    discipline: IDisciplineInfo,
    onScanning?: (lessonId: number) => void,
    onGroupLinkClick?: () => void,
}
export function GroupAttendance({ 
    currentGroup, 
    discipline,
    onScanning,
    onGroupLinkClick,
}: GroupAttendanceProps): JSX.Element {
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    const { 
        selectedLessonId, 
        selectLesson,
        attendances,
        removeAttendance,
        setAttendance,
        setLessonSearchInfo
    } = useLessonContext()
    useEffect(() => {
        if (attendances) setStatus('success')
    }, [attendances])
    useEffect(() => {
        if(currentGroup) {
            setLessonSearchInfo({
                disciplineId: discipline.id,
                groupId: currentGroup.id 
            })
        }
    }, [currentGroup, discipline])
    if (!currentGroup) return <></>
    return (
    <div>
        <div className='mb-3 d-flex align-items-center justify-content-between'>
            <h2 className='fs-4 m-0' style={groupLinkStyle} onClick={onGroupLinkClick}>
                {`${currentGroup.faculty} ${currentGroup.name}`}
                <span className='ms-2'>
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFFFFF" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                    </svg>
                </span>
            </h2>
            <Button disabled={!attendances || attendances.lessons.length <= 0} onClick={async () => {
                    saveAs(new Blob([await excelReport(attendances!, discipline)]), 'output.xlsx');
                }}>Экспорт в Excel</Button>
        </div>
        <Processing status={status}>
            <div style={{
                overflowX: 'auto',  
                marginTop: '10px',
                background: '#222222',
                height: 'max-content',
                borderRight: '1px solid white',
                padding: '0px'
            }}>
            {(() => {
                if (!attendances) return <>Ошибка загрузки списка занятий</>
                else if(!attendances || attendances.lessons.length <= 0) return (
                <div className='py-3 px-3 d-flex justify-content-center'>
                    <p className='m-0'>Список занятий пуст. Добавьте новое</p>
                </div>
                )
                return <ReportTable lessons={attendances.lessons.sort((a, b) => a.time.localeCompare(b.time))} 
                    attendanceContext={[
                        { 
                            name: 'Установить отметку', 
                            onClick: ({rfidCode, lessonId}) => setAttendance(rfidCode, lessonId) 
                        },
                        { 
                            name: 'Убрать отметку', 
                            onClick: ({rfidCode, lessonId}) => removeAttendance(rfidCode, lessonId) 
                        }
                    ]} lessonContext={[
                        { name: 'Перейти к уроку', onClick: ({lessonId}) => selectLesson(lessonId) },
                        { name: 'Сканировать пропуски', onClick: ({lessonId}) => onScanning?.(lessonId) },
                    ]} currentLessonId={selectedLessonId}/>
            })()}
            </div>
        </Processing>
    </div>
    )
}
const groupLinkStyle: CSSProperties = {
    textDecoration: 'underline',
    cursor: 'pointer'
}