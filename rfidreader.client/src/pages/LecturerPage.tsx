import CustomListGroup from "@components/listgroup/CustomListGroup";
import Processing, { LoadingStatus } from "@components/processing/Processing";
import { ILecturerInfo } from "@core/models/lecturer";
import { lecturerService } from "@services/LecturerService";
import { createRef, CSSProperties, useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'

const surnameRef = createRef<HTMLInputElement>()
const nameRef = createRef<HTMLInputElement>()
const patronymicRef = createRef<HTMLInputElement>()
const updateCheckRef = createRef<HTMLInputElement>()

export default function LecturerPage(): JSX.Element {
    const [status, setStatus] = useState<LoadingStatus>('loading')
    const [updateUuid, setUpdateUuid] = useState<string>(uuidv4())
    const [selected, setSelected] = useState<ILecturerInfo | null>(null)
    const [lecturers, setLecturers] = useState<ILecturerInfo[] | null>(null)
    const navigator = useNavigate()
    useEffect(() => {
        lecturerService.getAllLecturers()
            .then(response => {
                setLecturers(response.data)
                setStatus('success')
            })
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [updateUuid])
    const onApplyLecturerHandler = useCallback(async() => {
        const requestData = {
            name: nameRef.current!.value,
            patronymic: patronymicRef.current!.value,
            surname: surnameRef.current!.value
        }
        try {
            const response = selected == null ? await lecturerService.addLecturer({...requestData}) 
                : await lecturerService.updateLecturer({
                    id: selected.id,
                    ...requestData
                })
            if(response.status == 200) {
                alert('Запрос успешно выполнен')
                setUpdateUuid(uuidv4())
                clearInputForm()
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            console.log(error)
        }
    }, [selected])
    const onSelectLecturerHandler = useCallback((id: number) => { 
        setSelected(lecturers!.find(item => item.id == id)!)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        updateCheckRef.current!.checked = true
    }, [lecturers])
    const onRemoveLecturerHandler = useCallback(async(id: number) => {
        try {
            if((await lecturerService.removeLecturer(id)).status == 200) {
                alert('Запрос успешно выполнен')
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
        surnameRef.current!.value = selected == null ? '' : selected.surname
        nameRef.current!.value = selected == null ? '' : selected.name
        patronymicRef.current!.value = selected == null ? '' : selected.patronymic
    }, [selected, updateUuid])
    const clearInputForm = () => {
        updateCheckRef.current!.checked = false
        setSelected(null)
    }
    return (
    <div className='h-100'>
    <Container fluid={'md'} className='h-100 d-flex flex-column'>
        <div style={pageHeaderStyle}>
            <h2 style={{display: 'inline-block'}}>Управление преподавателями</h2>
        </div>
        <Row className='gy-2 gy-lg-3 gx-3'>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Фамилия:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите фамилию' 
                        ref={surnameRef}/>  
                </Form.Group> 
                
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Имя:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите имя' 
                        ref={nameRef}/>  
                </Form.Group>   
            </Col>
            <Col sm={12} md={6} lg={4}>
                <Form.Group>
                    <Form.Label>Отчество:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите отчество' 
                        ref={patronymicRef}/>  
                </Form.Group>   
            </Col>
            <Col sm={12} md={6} lg={4} style={{display: 'flex', flexDirection: 'column', justifyContent: 'end'}}>
                <Button style={{width: '100%'}} onClick={onApplyLecturerHandler}>
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
                <CustomListGroup<ILecturerInfo> 
                    data={lecturers?.map(item => ({ data: item, name: `${item.surname} ${item.name} ${item.patronymic}`}) )} 
                    menuItems={[
                        {
                            name: 'Перейти к дисциплинам',
                            onClick: (item) => navigator(`/disciplines/${item.id}`)
                        },
                        {
                            name: 'Выбрать преподавателя',
                            onClick: (item) => onSelectLecturerHandler(item.id)
                        },
                        {
                            name: 'Удалить преподавателя',
                            onClick: (item) => onRemoveLecturerHandler(item.id)
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