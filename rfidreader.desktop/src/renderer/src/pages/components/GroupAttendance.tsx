/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Processing, { LoadingStatus } from "@renderer/components/processing/Processing"
import { StudentAttendance, ReportTable } from "@renderer/components/reportTable/ReportTable"
import { INewAttendance } from "@renderer/models/attendance"
import { IDisciplineInfo } from "@renderer/models/discipline"
import { IGroupInfo } from "@renderer/models/group"
import { IGroupAttendancesOnLesson } from "@renderer/models/lesson"
import { attendanceService } from "@renderer/services/AttendanceService"
import { lessonService } from "@renderer/services/LessonService"
import { excelReport } from "@renderer/utils/excelReport"
import saveAs from "file-saver"
import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Button } from "react-bootstrap"
import { v4 as uuidv4 } from 'uuid'
import { useLessonContext } from "../contexts/LessonContext"

export interface GroupAttendanceProps {
    currentGroup: IGroupInfo | null
    discipline: IDisciplineInfo,
    onScanning?: (lessonId: number) => void
}
export function GroupAttendance({ 
    currentGroup, 
    discipline,
    onScanning,
}: GroupAttendanceProps): JSX.Element {
    const [ updateUuid, setUpdateUuid ] = useState<string>(uuidv4())
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    const [ attendances, setAttendances ] = useState<IGroupAttendancesOnLesson>()

    const { selectedLessonId, selectLesson } = useLessonContext()
    useEffect(() => {
        if(!currentGroup) { setStatus('loading'); return }
        (async () => {
            const lessonsResponse = await lessonService.getLessonsByGroup(discipline.id, currentGroup.id)
            setAttendances(lessonsResponse.data)
        })().then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [currentGroup, updateUuid])

    const onSetAttendanceHandler = useCallback(async({ lessonId, rfidCode }: StudentAttendance & {lessonId: number}) => {
        const request = {
            lessonId,
            rfidCodes: [ {code: rfidCode, time: convertDateToString(new Date())} ]
        } as INewAttendance
        try {
            if ((await attendanceService.addAttendances(request)).status == 200) {
                setUpdateUuid(uuidv4())
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [])
    const onRemoveAttendanceHandler = useCallback(async({ rfidCode, lessonId }: StudentAttendance & {lessonId: number}) => {
        try {
            if ((await attendanceService.removeAttendance(rfidCode, lessonId)).status == 200) {
                setUpdateUuid(uuidv4())
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [])
    if (!currentGroup) return <></>
    return (
    <Container fluid style={{padding: '0'}}>
        <Row className='justify-content-between w-100'>
            <Col sm={6}>
                <h2 className='fs-4 m-0'>{`${currentGroup.faculty} ${currentGroup.name}`}</h2>
            </Col>
            <Col sm={6} className='d-flex flex-row justify-content-end'>
                <Button disabled={!attendances || attendances.lessons.length <= 0} onClick={async () => {
                    saveAs(new Blob([await excelReport(attendances!, discipline)]), 'output.xlsx');
                }}>Экспорт в Excel</Button>
            </Col>
        </Row>
        <Row className='flex-grow-1'>
            <Col>
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
                    return <ReportTable lessons={attendances.lessons} attendanceContext={[
                        { name: 'Установить отметку', onClick: (data) => onSetAttendanceHandler(data) },
                        { name: 'Убрать отметку', onClick: (data) => onRemoveAttendanceHandler(data) }
                    ]} lessonContext={[
                        { name: 'Сканировать пропуски', onClick: ({lessonId}) => onScanning?.(lessonId) },
                        { name: 'Перейти к уроку', onClick: ({lessonId}) => selectLesson(lessonId) }
                    ]} currentLessonId={selectedLessonId}/>
                })()}
                </div>
            </Processing>
            </Col>
        </Row>
    </Container>
    )
}
function convertDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}