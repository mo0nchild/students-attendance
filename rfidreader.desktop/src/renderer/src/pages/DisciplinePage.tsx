/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Processing, { LoadingStatus } from "@components/processing/Processing";
import { IDisciplineInfo } from "@core/models/discipline";
import { AccordionList } from "@renderer/components/accordionList/AccordionList";
import { IGroupInfo } from "@renderer/models/group";
import { lessonService } from "@renderer/services/LessonService";
import { GroupByResult } from "@renderer/utils/processing";
import { disciplineService } from "@services/DisciplineService";
import { createRef, CSSProperties, useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid'

const disciplineNameRef = createRef<HTMLInputElement>()
const updateCheckRef = createRef<HTMLInputElement>()

export default function DisciplinePage(): JSX.Element {
    const [status, setStatus] = useState<LoadingStatus>('loading')
    const [updateUuid, setUpdateUuid] = useState<string>(uuidv4())
    
    const [dispciplineGroups, setDisciplineGroups] = useState<GroupByResult<IGroupInfo>>()
    const [disciplines, setDisciplines] = useState<IDisciplineInfo[]>([])
    const [selected, setSelected] = useState<IDisciplineInfo | null>(null)
    
    const navigator = useNavigate()
    useEffect(() => {
        (async() => {
            const disciplinesResponse = await disciplineService.getAllDisciplines()
            setDisciplines(disciplinesResponse.data)

            const grouping = { } as GroupByResult<IGroupInfo>
            await Promise.all(disciplinesResponse.data.map(async (item) => {
                if (!grouping[item.name]) grouping[item.name] = []
                const lessonResponse = (await lessonService.getLessonsByDiscipline(item.id)).data

                for (const lesson of lessonResponse) {
                    for (const group of lesson.groups) {
                        if (!grouping[item.name].some(it => it.id == group.id)) {
                            grouping[item.name].push(group)
                        }
                    }
                }
            }))
            setDisciplineGroups(grouping)
        })().then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
            console.log()
    }, [navigator, updateUuid])
    const onApplyDisciplineHandler = useCallback(async() => {
        if (disciplineNameRef.current!.value == '') return alert('Название дисциплины не установлено');
        const requestData = { name: disciplineNameRef.current!.value }
        try {
            const response = selected == null ? await disciplineService.addDiscipline({...requestData}) 
                : await disciplineService.updateDiscipline({
                    id: selected.id,
                    ...requestData
                })
            if(response.status == 200) {
                setUpdateUuid(uuidv4())
                clearInputForm()
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [selected])
    const onSelectDisciplineHandler = useCallback(async(discipline: IDisciplineInfo) => {
        setSelected(discipline)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        updateCheckRef.current!.checked = true
    }, [])
    const onRemoveDisciplineHandler = useCallback(async(id: number) => {
        try {
            if((await disciplineService.removeDiscipline(id)).status == 200) {
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
        disciplineNameRef.current!.value = selected == null ? '' : selected.name
    }, [selected, updateUuid])
    const clearInputForm = () => {
        updateCheckRef.current!.checked = false
        setSelected(null)
    }
    const usingDiscipline = (name: string, action: (discipline: IDisciplineInfo) => void) => {
        const discipline = disciplines.find(it => it.name == name)
        if (discipline) action(discipline)
    }
    return (
    <div className='h-100'>
    <Container fluid='md' className='h-100 d-flex flex-column'>
        <div style={pageHeaderStyle}>
            <h2 style={{display: 'inline-block'}}>Управление дисциплинами</h2>
        </div>
        <Row className='gy-2 gy-lg-3 gx-3 mt-3 mb-2 justify-content-center'>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Название дисциплины:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите название' 
                        ref={disciplineNameRef}/>  
                </Form.Group> 
            </Col>
            <Col sm={12} md={6} lg={4} style={{display: 'flex', flexDirection: 'column', justifyContent: 'end'}}>
                <Button style={{width: '100%'}} onClick={onApplyDisciplineHandler}>
                    { selected == null ? 'Добавить' : 'Обновить' }
                </Button>
            </Col>
        </Row>
        <Row className='justify-content-center gy-2 gy-lg-3 gx-3 mb-4'>
            <Col sm={12} md={6} lg={4}>
                <Form.Check type='checkbox' disabled={selected == null} label='Обновление' 
                    ref={updateCheckRef} onChange={(event) => {
                        const { checked } = event.currentTarget
                        if (checked == false && selected != null) {
                            setSelected(null)
                        }
                    }}
                />
            </Col>
            <Col sm={12} md={6} lg={4}></Col>
        </Row>
        <Row className='flex-grow-1 justify-content-center'>
            <Col sm={12} md={12} lg={8}>
                <Processing status={status}>
                    <AccordionList<IGroupInfo> listData={dispciplineGroups} contextMenu={(group, key) => {
                        return [
                            {
                                name: 'Перейти к занятиям',
                                onClick: () => usingDiscipline(key, discipline => {
                                    navigator(`/attendance/${discipline.id}/${group.id}`)
                                })
                            }
                        ]
                    }} minListLines={5} actionMenu={key => {
                        return [
                            {
                                name: 'Выбрать дисциплину',
                                onClick: () => usingDiscipline(key, discipline => {
                                    onSelectDisciplineHandler(discipline)
                                })
                            },
                            {
                                name: 'Удалить дисциплину',
                                onClick: () => usingDiscipline(key, discipline => {
                                    onRemoveDisciplineHandler(discipline.id)
                                })
                            },
                            {
                                name: 'Создать занятие',
                                onClick: () => usingDiscipline(key, discipline => {
                                    navigator(`/lessons/${discipline.id}`)
                                })
                            }
                        ]
                    }}/>
                </Processing>
            </Col>
        </Row>
    </Container>
    </div>
    )
}
const pageHeaderStyle: CSSProperties = {
    marginBottom: '14px', 
}