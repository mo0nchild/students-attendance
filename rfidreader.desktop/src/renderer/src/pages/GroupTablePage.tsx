/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Processing, { LoadingStatus } from "@components/processing/Processing"
import { IDisciplineInfo } from "@core/models/discipline"
import { IGroupAttendancesOnLesson } from "@core/models/lesson"
import { excelReport } from "@core/utils/excelReport"
import { ReportTable } from "@renderer/components/reportTable/ReportTable"
import { disciplineService } from "@services/DisciplineService"
import { lessonService } from "@services/LessonService"
import saveAs from "file-saver"
import { CSSProperties, useEffect, useState } from "react"
import { Button, Container, Row } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"

export default function GroupTablePage(): JSX.Element {
    const [ status, setStatus] = useState<LoadingStatus>('loading')
    const [ discipline, setDiscipline ] = useState<IDisciplineInfo | null>(null)
    const [ info, setInfo ] = useState<IGroupAttendancesOnLesson | null>(null)

    const navigate = useNavigate()
    const { disciplineId, groupId } = useParams()

    useEffect(() => {
        (async () => {
            const response = await lessonService.getLessonsByGroup(parseInt(disciplineId!), parseInt(groupId!))
            setInfo(response.data)
            const disciplineResponse = (await disciplineService.getAllDisciplines()).data
                .find(it => it.id == parseInt(disciplineId!))
            if (disciplineResponse != undefined) {
                setDiscipline(disciplineResponse)
            }
            else throw 'Дисциплина не найдена'
        })().then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [disciplineId, groupId])
    return (
        <div className='h-100'>
        <Container fluid={'md'} className='h-100 d-flex flex-column'>
            <div style={pageHeaderStyle}>
                <a style={headerLinkStyle} onClick={() => navigate(-1)}>&#8592;&nbsp;
                    <span style={{textDecoration: 'underline', textUnderlineOffset: '5px'}}>Назад</span>
                </a>
                <h2 style={{display: 'inline-block'}}>Посещаемость группы: {(() => {
                    const group = info?.group
                    return `${group?.faculty} ${group?.name}`
                })()}</h2>
                <h2>Дисциплина: {discipline?.name ?? ''}</h2>
            </div>
            
        </Container>
        </div>
    )
}

const pageHeaderStyle: CSSProperties = {
    marginBottom: '14px',  
}
const headerLinkStyle: CSSProperties = { 
    color: 'white', 
    display: 'inline-block', 
    marginRight: '10px',
}