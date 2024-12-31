import Processing, { LoadingStatus } from "@components/processing/Processing"
import { IDisciplineInfo } from "@core/models/discipline"
import { IGroupAttendancesOnLesson, ILessonStudentInfo } from "@core/models/lesson"
import { excelReport } from "@core/utils/excelReport"
import { convertToDDMM } from "@core/utils/processing"
import { disciplineService } from "@services/DisciplineService"
import { lessonService } from "@services/LessonService"
import saveAs from "file-saver"
import { CSSProperties, useEffect, useMemo, useState } from "react"
import { Button, Container, Row, Table } from "react-bootstrap"
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
            <div style={{display: 'flex', justifyContent: 'end'}}>
                <Button onClick={async () => {
                    saveAs(new Blob([await excelReport(info!, discipline!)]), 'output.xlsx');
                }}>Экспорт в Excel</Button>
            </div>
            <Row className='flex-grow-1'>
                <Processing status={status}>
                    <div style={{
                        overflowX: 'auto',  
                        marginTop: '10px',
                        background: '#222222',
                        height: 'max-content',
                        borderRight: '1px solid white',
                        padding: '0px'
                    }}>
                    { info == null ? <></> : <ReportTableComponent lessons={info!.lessons}/> }
                    </div>
                </Processing>
            </Row>
        </Container>
        </div>
    )
}
function ReportTableComponent({lessons}: {lessons: ILessonStudentInfo[]}): JSX.Element {
    const students = useMemo(() => {
        const result = [] as { studentFIO: string, checks: boolean[] }[]
        console.log(lessons)
        for(const item of lessons) {
            item.students.forEach(({ student, time }) => {
                const check = time == null ? false : true
                const FIO = `${student.surname} ${student.name[0]}. ${student.surname[0]}.`
                const st = result.find(it => it.studentFIO == FIO) 

                if (!st) result.push({ studentFIO: FIO, checks: [check] })
                else st.checks.push(check)
            })
        }
        console.log(result)
        return result   
    }, [lessons])
    return (
    <Table bordered hover style={{margin: '0px', boxSizing: 'border-box'}}>
        <thead>
            <tr>
                <th style={{color: 'white', width: '200px', minWidth: '200px', textAlign: 'center'}}>ФИО</th>
                {
                    lessons.map((item, index) => {
                        return (
                        <th key={`head-cell#${index}`} style={{width: '20px', color: 'white'}}>
                            {convertToDDMM(item.time)}
                        </th>
                        )
                    })
                }
                <th style={{borderLeft: '0px', borderRight: '0px', width: 'auto'}}></th>
            </tr>
        </thead>
        <tbody>
        {
            students.map(({ checks, studentFIO }, index) => {
                return (
                <tr key={`row#${index}`}>
                    <td style={{color: 'white'}}>{studentFIO}</td>
                    {checks.map((it, i) => (
                        <td key={`row-cell#${i}`} style={{
                            textAlign: 'center', 
                            background: it ? '#67ff6488' : '#ff806488',
                            color: 'black',
                            fontSize: '20px',
                            padding: '0px'
                        }}>
                            {it ? '+' : '-'}
                        </td>
                    )) }
                </tr>
                )
            })
        }
        </tbody>
        <tfoot>
            <tr>
                <td style={{color: 'white', textDecoration: 'underline'}}>Статистика:</td>
                {
                lessons.map((item, index) => {
                    const stat = item.students.filter(it => it.time != null).length / item.students.length
                    return (
                    <td key={`foot-cell#${index}`} style={{textAlign: 'center', color: 'white'}}>
                        {((stat * 100) || 0).toFixed(2)}%
                    </td>
                    )
                })
                }
            </tr>
        </tfoot>
    </Table>
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