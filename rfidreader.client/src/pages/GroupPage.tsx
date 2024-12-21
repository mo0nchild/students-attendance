import Processing, { LoadingStatus } from "@components/processing/Processing"
import { IGroupInfo } from "@core/models/group"
import { groupBy } from "@core/utils/processing"
import { groupService } from "@services/GroupService"
import { studentService } from "@services/StudentService"
import { createElement, createRef, CSSProperties, useCallback, useEffect, useState } from "react"
import { Accordion, Button, Col, Container, Dropdown, Form, ListGroup, Row } from "react-bootstrap"
import { v4 as uuidv4 } from 'uuid'

const groupNameRef = createRef<HTMLInputElement>()
const facultyRef = createRef<HTMLInputElement>()
const updateCheckRef = createRef<HTMLInputElement>()

type StudentsInGroup = { count: number, id: number }

export default function GroupPage(): JSX.Element {
    const [groups, setGroups] = useState<IGroupInfo[] | null>(null)
    const [selected, setSelected] = useState<IGroupInfo | null>(null)
    const [status, setStatus] = useState<LoadingStatus>('loading')
    const [updateUuid, setUpdateUuid] = useState<string>(uuidv4())
    const [studentsInGroup, setStudentsInGroup] = useState<StudentsInGroup[]>([])
    useEffect(() => {
        (async() => {
            const response = await groupService.getAllGroups()
            setGroups(response.data)
            const inGroup = [] as StudentsInGroup[]
            for (const { id } of response.data) {
                const studentCount = (await studentService.getStudentsByGroup(id)).data.length
                inGroup.push({ id, count: studentCount })
            } 
            setStudentsInGroup(inGroup)

        })().then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [updateUuid])
    const onSelectionHandler = useCallback((group: IGroupInfo) => {
        setSelected(group)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        updateCheckRef.current!.checked = true
    }, [])
    const onApplyGroupHandler = useCallback(async () => {
        const requestData = {
            faculty: facultyRef.current!.value,
            name: groupNameRef.current!.value
        }
        try {
            const response = selected == null ? await groupService.addGroup({...requestData}) 
                : await groupService.updateGroup({
                    ...requestData,
                    id: selected.id
                })
            if (response.status == 200) {
                
                setUpdateUuid(uuidv4())
                clearInputForm()
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [selected])
    const onRemoveGroupHandler = useCallback(async (group: IGroupInfo) => {
        try {
            if((await groupService.removeGroup(group.id)).status == 200) {
                
                setUpdateUuid(uuidv4())
                clearInputForm()
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [])
    useEffect(() => {
        groupNameRef.current!.value = (selected == null ? '' : selected.name)
        facultyRef.current!.value = (selected == null ? '' : selected.faculty)
    }, [selected, updateUuid])
    const clearInputForm = () => {
        updateCheckRef.current!.checked = false
        setSelected(null)
    }
    const renderGroupsList = (): JSX.Element => {
        if (groups == null || groups.length <= 0) return (
            <div className='d-flex flex-column align-items-center mt-5'>
                <h4>Список групп пуст</h4>
            </div>
        )
        const result = groupBy(groups, item => item.faculty)
        return (
        <Accordion>
        {
        Object.keys(result).map((item, index) => {
            return (
            <Accordion.Item key={`item#${index}`} eventKey={index.toString()}>
                <Accordion.Header>{item}</Accordion.Header>
                <Accordion.Body>
                <ListGroup>
                {
                result[item].map((g, i) => {
                    return (
                    <ListGroup.Item key={`item#${index}-${i}`} className='d-flex justify-content-between'>
                        <Dropdown>
                            <Dropdown.Toggle style={dropDownStyle}>{g.name}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href={`/students/${g.id}/${g.name}`}>
                                    Перейти к группе
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => onSelectionHandler(g)}>
                                    Выбрать группу
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => onRemoveGroupHandler(g)}>
                                    Удалить группу
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        
                        <div className='d-flex align-items-center'>
                            <span>
                                {`Кол-во студентов: ${studentsInGroup.find(it => it.id == g.id)?.count ?? 0}`}
                            </span>
                        </div>

                    </ListGroup.Item>
                    )
                })
                }
                </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
            )
        })
        }
        </Accordion>
        )
    }
    return (
    <div>
    <Container fluid='md'>
        <div style={pageHeaderStyle}>
            <h2 style={{display: 'inline-block'}}>Управление группами</h2>
        </div>
        <Row className='gy-2 gy-lg-3 gx-3'>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Название группы:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите название группы' 
                        ref={groupNameRef}/>  
                </Form.Group> 
                
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Название факультета:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите название факультета' 
                        ref={facultyRef}/>  
                </Form.Group>   
            </Col>
        </Row>
        <Row style={{margin: '10px 0px 20px'}}>
            <Col sm={6} md={6} lg={4}>
                <Button style={{width: '100%'}} onClick={onApplyGroupHandler}>
                    { selected == null ? 'Добавить' : 'Обновить' }
                </Button>
            </Col>
            <Col sm={6} md={6} lg={4}>
                <Form.Check type='checkbox' disabled={selected == null} label='Обновление' 
                    ref={updateCheckRef} onChange={(event) => {
                        const { checked } = event.currentTarget
                        if (checked == false && selected != null) {
                            setSelected(null)
                        }
                    }}
                />
            </Col>
        </Row>
        <Processing status={status}>{createElement(renderGroupsList)}</Processing>
    </Container>
    </div>
    )
}
const pageHeaderStyle: CSSProperties = {
    marginBottom: '14px',  
}
const dropDownStyle: CSSProperties = {
    width: '70%',
    textAlign: 'start',
    background: 'transparent',
    border: 'none'
}