/* eslint-disable @typescript-eslint/explicit-function-return-type */

import Processing, { LoadingStatus } from "@renderer/components/processing/Processing"
import { IDisciplineInfo } from "@renderer/models/discipline"
import { IGroupInfo } from "@renderer/models/group"
import { ILessonInfo } from "@renderer/models/lesson"
import { disciplineService } from "@renderer/services/DisciplineService"
import { groupService } from "@renderer/services/GroupService"
import { lessonService } from "@renderer/services/LessonService"
import { studentService } from "@renderer/services/StudentService"
import { createRef, CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

const themeRef = createRef<HTMLInputElement>()
const timeRef = createRef<HTMLInputElement>()

export default function LessonPage(): JSX.Element {
    const selectedGroups = useRef<IGroupInfo[]>([])
    const [ discipline, setDiscipline ] = useState<IDisciplineInfo>()
    const [ currentLesson, setCurrentLesson ] = useState<ILessonInfo>()

    const { disciplineId } = useParams()
    const navigate = useNavigate()

    const [ searchParams ] = useSearchParams()
    const lessonId = searchParams.get('lessonId')
    useEffect(() => {
        if (!disciplineId) throw 'Не указан ИД дисциплины';
        (async () => {
            const lesson = (await lessonService.getLessonsByDiscipline(parseInt(disciplineId))).data
                .find(it => lessonId && it.id == parseInt(lessonId))
            if (lesson) {
                lesson.groups.forEach(it => {
                    selectedGroups.current.push(it)
                })
            }
            setCurrentLesson(lesson)
        })().catch(error => console.log(error))
    }, [lessonId, disciplineId])
    useEffect(() => {
        if (!disciplineId) throw 'Не указан ИД дисциплины';
        (async() => {
            const disciplineResponse = (await disciplineService.getAllDisciplines()).data
                .find(item => item.id == parseInt(disciplineId))
            if (disciplineResponse) {
                setDiscipline(disciplineResponse)
            }
        })()
    }, [disciplineId])
    const onApplyLessonHandler = useCallback(async () => {
        if (timeRef.current!.value == '') {
            alert('Время занятия не установлено')
            return window.electron.ipcRenderer.send('focus-fix')
        }
        if (themeRef.current!.value == '') {
            alert('Тема занятия не установлена')
            return window.electron.ipcRenderer.send('focus-fix')
        }
        const requestData = {
            theme: themeRef.current!.value,
            disciplineId: parseInt(disciplineId!),
            time: timeRef.current!.value,
        }
        try {
            const response = !currentLesson ? await lessonService.addLesson({
                ...requestData,
                groups: [ ...(selectedGroups.current.map(({ id }) => id)) ]
            }) : await lessonService.updateLesson({ 
                ...requestData, 
                id: currentLesson.id,
                groupIds: [ ...(selectedGroups.current.map(({ id }) => id)) ] 
            })
            if(response.status == 200) navigate(-1)
        }
        catch (error) {
            alert('Ошибка выполнения запроса')
            window.electron.ipcRenderer.send('focus-fix')
            console.log(error)
        }
    }, [disciplineId, currentLesson])
    const onRemoveLessonHandler = useCallback(async () => {
        if (!currentLesson) return;
        try {
            const response = await lessonService.removeLesson(currentLesson.id)
            if (response.status == 200) navigate(-1)
        }
        catch (error) {
            alert('Ошибка выполнения запроса')
            window.electron.ipcRenderer.send('focus-fix')
            console.log(error)
        }
    }, [currentLesson])
    const onSelectGroupHandler = useCallback((group: IGroupInfo) => {
        const index = selectedGroups.current.findIndex(item => item.id == group.id)
        if (index >= 0) {
            selectedGroups.current.splice(index, 1)
        }
        else selectedGroups.current.push(group)
    }, [])
    return (
    <div>
    <Container fluid='md'>
        <div style={pageHeaderStyle}>
            <a style={headerLinkStyle} onClick={() => navigate(-1)}>&#8592;&nbsp;
                <span style={{textDecoration: 'underline', textUnderlineOffset: '5px'}}>Назад</span>
            </a>
            <h2 style={{display: 'inline-block'}}>Управление уроком [{discipline?.name}]</h2>
        </div>
        <Row className='gy-2 gy-lg-3 gx-3 mb-3 justify-content-center'>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Тема урока:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите название темы' ref={themeRef}
                        defaultValue={currentLesson ? currentLesson.theme : ''}/>  
                </Form.Group> 
                
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Время проведения:</Form.Label>
                    <Form.Control type='datetime-local' maxLength={50} ref={timeRef}
                        defaultValue={currentLesson ? currentLesson.time : ''}/>  
                </Form.Group>   
            </Col>
        </Row>
        <Row className='gy-2 gy-lg-3 gx-3 mb-2 justify-content-center'>
            <Col sm={12} md={6} lg={4}>
                <GroupListSelector onSelect={onSelectGroupHandler} defaultGroups={currentLesson?.groups}/>
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Button className='w-100 mb-3' onClick={onApplyLessonHandler}>
                    { currentLesson ? 'Редактировать занятие' : 'Добавить занятие' }
                </Button>
                {
                !lessonId ? <></> 
                    : <Button className='w-100' onClick={onRemoveLessonHandler}>
                        Удалить занятие
                    </Button> 
                }
            </Col>
        </Row>
    </Container>
    </div>
    )
}

interface GroupListSelectorProps {
    onSelect?: (group: IGroupInfo) => void,
    defaultGroups?: IGroupInfo[]
}
function GroupListSelector({ defaultGroups, onSelect }: GroupListSelectorProps): JSX.Element {
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    const [ groups, setGroups ] = useState<IGroupInfo[]>([])
    useEffect(() => {
        (async() => {
            const groupResponse = (await groupService.getAllGroups()).data
            const groupsList = [] as IGroupInfo[]
            for (const group of groupResponse) {
                const students = (await studentService.getStudentsByGroup(group.id)).data
                if (students.length > 0) groupsList.push(group)
            }
            setGroups(groupsList)
        })().then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [])
    if (groups.length <= 0) return (
    <div>
        <p>Список групп пуст</p>
    </div>
    )
    return (
    <div style={{overflowY: 'auto', maxHeight: '250px', width: '100%'}}>
        <Processing status={status}>
            <ListGroup>
            {
            groups.map((item, index) => {
                return <ListGroup.Item key={`group-list-selector#${index}`}>
                    <Form.Check type='checkbox' label={`${item.faculty} ${item.name}`} 
                        onChange={() => onSelect?.(item)}
                        defaultChecked={
                            defaultGroups ? !!defaultGroups.find(it => it.id == item.id) : false 
                        }/>
                </ListGroup.Item>
            })
            }
            </ListGroup>
        </Processing>
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