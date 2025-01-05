/* eslint-disable @typescript-eslint/explicit-function-return-type */

import Processing, { LoadingStatus } from "@renderer/components/processing/Processing"
import { IDisciplineInfo } from "@renderer/models/discipline"
import { IGroupInfo } from "@renderer/models/group"
import { INewLesson } from "@renderer/models/lesson"
import { disciplineService } from "@renderer/services/DisciplineService"
import { groupService } from "@renderer/services/GroupService"
import { lessonService } from "@renderer/services/LessonService"
import { studentService } from "@renderer/services/StudentService"
import { createRef, CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"

const themeRef = createRef<HTMLInputElement>()
const timeRef = createRef<HTMLInputElement>()

export default function LessonPage(): JSX.Element {
    const [ discipline, setDiscipline ] = useState<IDisciplineInfo>()
    const selectedGroups = useRef<IGroupInfo[]>([])
    
    const { disciplineId } = useParams()
    const navigate = useNavigate()
    
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
        if (timeRef.current!.value == '') return alert('Время занятия не установлено');
        if (themeRef.current!.value == '') return alert('Тема занятия не установлена');
        const requestData = {
            theme: themeRef.current!.value,
            disciplineId: parseInt(disciplineId!),
            time: timeRef.current!.value,
            groups: [ ...(selectedGroups.current.map(({ id }) => id)) ]
        } as INewLesson
        try {
            const response = await lessonService.addLesson(requestData)
            if(response.status == 200) {
                navigate(-1)
            }
        }
        catch (error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [])
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
                    <Form.Control type='text' maxLength={50} placeholder='Введите название темы' ref={themeRef}/>  
                </Form.Group> 
                
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Время проведения:</Form.Label>
                    <Form.Control type='datetime-local' maxLength={50} ref={timeRef}/>  
                </Form.Group>   
            </Col>
        </Row>
        <Row className='gy-2 gy-lg-3 gx-3 mb-2 justify-content-center'>
            <Col sm={12} md={6} lg={4}>
                <GroupListSelector onSelect={onSelectGroupHandler}/>
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Button className='w-100' onClick={onApplyLessonHandler}>
                    Добавить занятие
                </Button>
            </Col>
        </Row>
    </Container>
    </div>
    )
}

interface GroupListSelectorProps {
    onSelect?: (group: IGroupInfo) => void
}
function GroupListSelector({ onSelect }: GroupListSelectorProps): JSX.Element {
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
                        onChange={() => onSelect?.(item)}/>
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