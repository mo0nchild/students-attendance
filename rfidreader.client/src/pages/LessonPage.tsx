import ModalWindow from "@components/modal/ModalWindow";
import Processing, { LoadingStatus } from "@components/processing/Processing";
import CustomTable, { DataType, HeaderType } from "@components/table/CustomTable";
import { IGroupInfo } from "@core/models/group";
import { ILessonInfo } from "@core/models/lesson";
import { getPreviousPagePath } from "@core/utils/routers";
import { disciplineService } from "@services/DisciplineService";
import { groupService } from "@services/GroupService";
import { lessonService } from "@services/LessonService";
import { AxiosError } from "axios";
import { createRef, CSSProperties, useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

const tableHeader: HeaderType[] = [
    {
        key: 'theme',
        name: 'Тема урока'
    }, 
    {
        key: 'groups',
        name: 'Группы',
        formatter: (value) => {
            return Array.isArray(value) ? value.join('\n') : ''
        }
    },
    {
        key: 'time',
        name: 'Время проведения',
        formatter: (value) => {
            return typeof value == 'string' 
                ? (value.split('T').join(' ').split('-').join('.')) : ''
        }
    }
]
const themeRef = createRef<HTMLInputElement>()
const timeRef = createRef<HTMLInputElement>()
const updateCheckRef = createRef<HTMLInputElement>()

interface LessonTableInfo extends DataType {
    theme: string
    time: string,
    groups: string[]
}
function convertToTableInfo(lesson: ILessonInfo): LessonTableInfo {
    return {
        theme: lesson.theme,
        time: lesson.time,
        id: lesson.id,
        groups: lesson.groups.map(it => `${it.faculty} ${it.name}`)
    }
}
export default function LessonPage(): JSX.Element {
    const [ lessons, setLessons ] = useState<ILessonInfo[] | null>(null)
    const [ selected, setSelected ] = useState<ILessonInfo | null>(null)
    
    const [ discipline, setDiscipline ] = useState<string | null>(null)
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    const [ updateUuid, setUpdateUuid ] = useState<string>(crypto.randomUUID())

    const [ selectedGroups, setSelectedGroups ] = useState<IGroupInfo[] | null>(null)
    const [ editGroups, setEditGroups ] = useState<boolean>(false)
    const { disciplineId } = useParams()

    useEffect(() => {
        if(!disciplineId) throw 'Не указан ИД дисциплины';
        (async() => {
            setLessons((await lessonService.getLessonsByDiscipline(parseInt(disciplineId))).data)
            const disciplineResponse = (await disciplineService.getAllDisciplines())
                .data.find(it => it.id == parseInt(disciplineId))
            if (disciplineResponse != undefined) {
                setDiscipline(disciplineResponse.name)
            }
            else throw 'Дисциплина не найдена'
        })()
            .then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [disciplineId, updateUuid])
    const onSelectLessonHandler = useCallback(async(disciplineId: number) => {
        const currentLesson = lessons?.find(item => item.id == disciplineId)
        setSelected(currentLesson ?? null)
        setSelectedGroups(currentLesson?.groups ?? null)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        updateCheckRef.current!.checked = true
    }, [lessons])
    const onApplyLessonHandler = useCallback(async() => {
        if (timeRef.current!.value == '') return alert('Время занятия не установлено');
        if (selectedGroups == null) return alert('Группы не выбраны');
        const requestData = {
            theme: themeRef.current!.value,
            disciplineId: parseInt(disciplineId!),
            time: timeRef.current!.value,
        }
        console.log(requestData)
        try {
            const response = selected == null ? await lessonService.addLesson({
                ...requestData,
                groups: selectedGroups!.map(it => it.id)
            }) : await lessonService.updateLesson({
                    ...requestData,
                    id: selected.id,
                    groupIds: selectedGroups!.map(it => it.id)
                })
            if(response.status == 200) {
                alert('Запрос успешно выполнен')
                setUpdateUuid(crypto.randomUUID())
                clearInputForm()
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [disciplineId, selected, selectedGroups])
    const onRemoveLessonHandler = useCallback(async(id: number) => {
        try {
            if ((await lessonService.removeLesson(id)).status == 200) {
                alert('Запрос успешно выполнен')
                setUpdateUuid(crypto.randomUUID())
                clearInputForm()
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [])
    useEffect(() => {
        themeRef.current!.value = selected == null ? '' : selected.theme
        timeRef.current!.value = selected == null ? '' : selected.time
        if (selected == null) setSelectedGroups(null)
    }, [selected])
    const clearInputForm = () => {
        updateCheckRef.current!.checked = false
        setSelected(null)
    }
    return (
    <div>
    <Container fluid='md'>
        <div style={pageHeaderStyle}>
            <Link style={headerLinkStyle} to={getPreviousPagePath()}>&#8592;&nbsp;
                <span style={{textDecoration: 'underline', textUnderlineOffset: '5px'}}>Назад</span>
            </Link>
            <h2 style={{display: 'inline-block'}}>Управление уроками [{discipline}]</h2>
        </div>
        <Row className='gy-2 gy-lg-3 gx-3 mb-2 justify-content-center'>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Тема урока:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите название темы' 
                        ref={themeRef}/>  
                </Form.Group> 
                
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Время проведения:</Form.Label>
                    <Form.Control type='datetime-local' maxLength={50} ref={timeRef}/>  
                </Form.Group>   
            </Col>
        </Row>
        <Row className='justify-content-center'>
            <Col sm={6} md={6} lg={4}>
                <p style={{maxHeight: '60px', overflowY: 'auto'}}>
                    Группы: {selectedGroups == null ? 'None' : selectedGroups.map(it => `${it.name}, `)}
                </p>
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
        <Row style={{margin: '10px 0px'}} className='gy-2 gy-lg-3 gx-3 mb-4 justify-content-center'>
            <Col sm={6} md={6} lg={4}>
                <Button style={{width: '100%'}} onClick={() => setEditGroups(true)}>
                    Управление группами
                </Button>
            </Col>
            <Col sm={6} md={6} lg={4}>
                <Button style={{width: '100%'}} onClick={onApplyLessonHandler}>
                    { selected == null ? 'Добавить' : 'Обновить' }
                </Button>
            </Col>
        </Row>
        <Row>
            <Processing status={status}>
                <div style={studentTableStyle}>
                    <CustomTable header={tableHeader} data={lessons == null ? [] : lessons?.map(it => {
                        return convertToTableInfo(it)
                    })}
                    contextMenu={[
                        {
                            name: 'Перейти к посещениям',
                            onClick: (item) => console.log(item) 
                        },
                        {
                            name: 'Выбрать урок',
                            onClick: (item) => onSelectLessonHandler(item.id)
                        },
                        {
                            name: 'Удалить урок',
                            onClick: (item) => onRemoveLessonHandler(item.id)
                        }
                    ]}/>
                </div>
            </Processing>
        </Row>
    </Container>
    <ModalWindow isOpen={editGroups} onClose={() => setEditGroups(false)}>
        <GroupSelection onAccept={data => {
            setSelectedGroups(data.length <= 0 ? null : data)
            setEditGroups(false)
        }}
            defaultGroups={selected == null ? undefined : selected.groups}/>
    </ModalWindow>
    </div>
    )
}
interface GroupSelectionProps {
    defaultGroups?: IGroupInfo[],
    onAccept?: (groups: IGroupInfo[]) => void
}
type GroupSelectionStatus = {info: IGroupInfo, status: boolean}
function GroupSelection(props: GroupSelectionProps): JSX.Element {
    const [ groups, setGroups ] = useState<GroupSelectionStatus[] | null>(null) 
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    useEffect(() => {
        (async() => {
            const response = (await groupService.getAllGroups()).data
            setGroups(response.map(item => ({ info: item, status: false })))
        })()
            .then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            }) 
    }, [])
    useEffect(() => {
        if (groups != null && groups.length > 0) {
            setGroups(groups.map(item => {
                const defaultStatus = props.defaultGroups?.find(it => it.id == item.info.id)
                return {
                    ...item,
                    status: defaultStatus == undefined ? false : true
                }
            }))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.defaultGroups])
    return (
    <div>
        <div className='mb-3' style={{maxHeight: '250px', overflowY: 'auto'}}>
            <h4>Выбрать группы:</h4>
            <Processing status={status}>
                <ListGroup>
                {
                    groups == null ? null : groups?.map((item, index) => {
                        const { faculty, name, id } = item.info
                        return (
                        <ListGroup.Item key={`item#${index}`}>
                            <Form.Check type='checkbox' label={`${faculty} ${name}`} 
                                checked={item.status}
                                onChange={() => {
                                    setGroups(groups.map(it => {
                                        return it.info.id == id ? {...it, status: !it.status} : it
                                    }))
                                }}/>
                        </ListGroup.Item>
                        )
                    })
                }
                </ListGroup>
            </Processing>
        </div>
        <Button className='w-100 mb-2' onClick={() => {
            setGroups(item => item?.map(it => ({...it, status: false})) ?? null)
        }}>Очистить все</Button>
        <Button className='w-100' onClick={() => {
            props.onAccept?.(groups!.filter(it => it.status == true).map(it => it.info))
        }}>Подтвердить</Button>
    </div>)
}
const studentTableStyle: CSSProperties = {
    overflowX: 'auto'
}
const pageHeaderStyle: CSSProperties = {
    marginBottom: '14px', 
}
const headerLinkStyle: CSSProperties = { 
    color: 'white', 
    display: 'inline-block', 
    marginRight: '10px',
}