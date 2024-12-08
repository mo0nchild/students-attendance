import CustomListGroup from "@components/listgroup/CustomListGroup";
import Processing, { LoadingStatus } from "@components/processing/Processing";
import { useLocalStorage } from "@core/hooks/localstorage";
import { ILecturerInfo } from "@core/models/lecturer";
import { lecturerService } from "@services/LecturerService";
import { useCallback, useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

export default function HomePage(): JSX.Element {
    const [ auth, setAuth ] = useLocalStorage<number>('lecturerId', -1)
    const [ status, setStatus ] = useState<LoadingStatus>('loading')
    const [ lecturers, setLecturers ] = useState<ILecturerInfo[] | null>(null)
    const [ searchValue, setSearchValue ] = useState<string>('') 
    useEffect(() => {
        (async() => setLecturers((await lecturerService.getAllLecturers()).data))()
            .then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
        console.log(auth)
    }, [auth])
    const onAuthClickHandler = useCallback((lecturer: ILecturerInfo) => {
        setAuth(lecturer.id)
    }, [setAuth])
    return (
    <div>
    <Container>
        <h1 className='mb-4 mt-3'>
            Добро пожаловать&nbsp;
            <span>{(() => {
                    if (lecturers == null || auth == -1) return ''
                    const response = lecturers!.find(it => it.id == auth)

                    if (response == undefined) { setAuth(-1); return '' }
                    return (() => {
                        const { name, patronymic, surname } = response
                        return `${surname} ${name[0]}. ${patronymic[0]}.`
                    })()
                })()}</span>
        </h1>
        <h4 className='mb-5'>
        {
            'Выберите преподавателя, от лица которого будете работать'
        }
        </h4>
        <Row className='justify-content-center mb-3'>
            <Col sm={12} md={8} lg={6}>
                <Form.Group>
                    <Form.Label>Поиск преподавателя:</Form.Label>
                    <Form.Control type='text' maxLength={50} placeholder='Введите ФИО преподавателя' 
                        onChange={event => setSearchValue(event.currentTarget.value)}/>  
                </Form.Group> 
            </Col>
        </Row>
        <Row className='justify-content-center'>
            <Col sm={12} md={8} lg={6}>
                <Processing status={status}>
                    <CustomListGroup<ILecturerInfo> 
                        data={lecturers?.map(item => ({
                            data: item,
                            name: `${item.surname} ${item.name} ${item.patronymic}`
                        }))} 
                        menuItems={[
                            {
                                name: 'Авторизоваться',
                                onClick: (item) => onAuthClickHandler(item)
                            }
                        ]} />
                </Processing>
            </Col>
        </Row>
    </Container>
    </div>
    )
}