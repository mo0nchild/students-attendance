import CustomListGroup from "@components/listgroup/CustomListGroup";
import Processing, { LoadingStatus } from "@components/processing/Processing";
import { IDisciplineInfo } from "@core/models/discipline";
import { getPreviousPagePath } from "@core/utils/routers";
import { disciplineService } from "@services/DisciplineService";
import { lecturerService } from "@services/LecturerService";
import { AxiosError } from "axios";
import { createRef, CSSProperties, useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

const disciplineNameRef = createRef<HTMLInputElement>()
const updateCheckRef = createRef<HTMLInputElement>()

export default function DisciplinePage(): JSX.Element {
    const [status, setStatus] = useState<LoadingStatus>('loading')
    const [updateUuid, setUpdateUuid] = useState<string>(crypto.randomUUID())
    const [disciplines, setDisciplines] = useState<IDisciplineInfo[] | null>(null)
    const [lecturer, setLecturer] = useState<string | null>(null)
    const [selected, setSelected] = useState<IDisciplineInfo | null>(null)
    
    const navigator = useNavigate()
    const { lecturerId } = useParams()
    useEffect(() => {
        if(!lecturerId) throw 'Не указан ИД преподавателя';
        (async() => {
            setDisciplines((await disciplineService.getDisciplinesByLecturer(parseInt(lecturerId))).data)
            const lecturerInfo = (await lecturerService.getAllLecturers())
                .data.find(it => it.id == parseInt(lecturerId))
            if(lecturerInfo != undefined) {
                const { name, surname, patronymic } = lecturerInfo
                setLecturer(`${surname} ${name[0]}. ${patronymic[0]}.`)
            }
            else throw 'Невозможно найти преподавателя по ИД'
        })()
            .then(() => setStatus('success'))
            .catch(error => {
                if (typeof error == 'string' && error == 'Невозможно найти преподавателя по ИД') {
                    navigator('/')
                }
                console.log(error)
                setStatus('failed')
            })
            console.log()
    }, [lecturerId, navigator, updateUuid])
    const onApplyDisciplineHandler = useCallback(async() => {
        const requestData = {
            name: disciplineNameRef.current!.value,
            lecturerId: parseInt(lecturerId!)
        }
        try {
            const response = selected == null ? await disciplineService.addDiscipline({...requestData}) 
                : await disciplineService.updateDiscipline({
                    id: selected.id,
                    ...requestData
                })
            if(response.status == 200) {
                alert('Запрос успешно выполнен')
                setUpdateUuid(crypto.randomUUID())
                clearInputForm()
            }
        }
        catch(error) {
            if(error instanceof AxiosError && error.response?.data == 'Discipline already exists') {
                alert('Дисциплина уже имеется у другого преподавателя')
            }
            else alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [lecturerId, selected])
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
        disciplineNameRef.current!.value = selected == null ? '' : selected.name
    }, [selected, updateUuid])
    const clearInputForm = () => {
        updateCheckRef.current!.checked = false
        setSelected(null)
    }
    return (
    <div className='h-100'>
    <Container fluid='md' className='h-100 d-flex flex-column'>
        <div style={pageHeaderStyle}>
            <Link style={headerLinkStyle} to={getPreviousPagePath()}>&#8592;&nbsp;
                <span style={{textDecoration: 'underline', textUnderlineOffset: '5px'}}>Назад</span>
            </Link>
            <h2 style={{display: 'inline-block'}}>Управление дисциплинами [{`${lecturer}`}]</h2>
        </div>
        <Row className='gy-2 gy-lg-3 gx-3'>
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
        <Row style={{margin: '10px 0px'}}>
            <Col sm={12}>
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
        <Row className='flex-grow-1'>
            <Processing status={status}>
                <CustomListGroup<IDisciplineInfo> 
                    data={disciplines?.map(item => ({ data: item, name: `${item.name}`}) )} 
                    menuItems={[
                        {
                            name: 'Перейти к урокам',
                            onClick: (item) => navigator(`/lessons/${item.id}`)
                        },
                        {
                            name: 'Выбрать дисциплину',
                            onClick: (item) => onSelectDisciplineHandler(item)
                        },
                        {
                            name: 'Удалить дисциплину',
                            onClick: (item) => onRemoveDisciplineHandler(item.id)
                        },
                    ]} />
            </Processing>
        </Row>
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