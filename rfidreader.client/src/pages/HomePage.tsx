import Processing, { LoadingStatus } from "@components/processing/Processing";
import { useLocalStorage } from "@core/hooks/localstorage";
import { ILecturerInfo } from "@core/models/lecturer";
import { lecturerService } from "@services/LecturerService";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { Col, Container, Dropdown, Form, ListGroup, Row } from "react-bootstrap";

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
                    const { name, patronymic, surname } = lecturers!.find(it => it.id == auth)!
                    return `${surname} ${name[0]}. ${patronymic[0]}.`
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
                    <ListGroup>
                    {
                    lecturers?.filter(it => new RegExp(`${searchValue}`).exec(`${it.patronymic} ${it.name} ${it.surname}`))
                        .map((item, index) => {
                            const { surname, name, patronymic } = item
                            return (
                            <ListGroup.Item key={`listitem#${index}`}>
                                <Dropdown>
                                    <Dropdown.Toggle style={toggleStyle}>{`${surname} ${name} ${patronymic}`}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => onAuthClickHandler(item)}>Авторизоваться</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </ListGroup.Item>
                            )
                        })
                    }
                    </ListGroup>
                </Processing>
            </Col>
        </Row>
    </Container>
    </div>
    )
}
const toggleStyle: CSSProperties = {
    background: 'transparent',
    border: 'none'
}