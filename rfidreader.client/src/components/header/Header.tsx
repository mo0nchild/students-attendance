import { Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import style from './Header.module.css'
import { useLocalStorage } from '@core/hooks/localstorage';

export default function Header(): JSX.Element {
    const [ auth, setAuth ] = useLocalStorage<number>('lecturerId', -1)
    return (
    <div className={style.headerRoot}>
        <Navbar expand='md' className={style.headerMain}>
        <Container fluid>
            <Navbar.Brand href='/'>Посещения</Navbar.Brand>
            <Navbar.Toggle aria-controls='navbarScroll' />
            <Navbar.Offcanvas id='navbarScroll' placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Навигация</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className={style.navigation} >
                    <Nav navbarScroll>
                        <Nav.Link className={style.navigationRef} href={
                            auth == -1 ? '/' : `/disciplines/${auth}`
                        }>
                            Ваши занятия
                        </Nav.Link>
                        <NavDropdown title="Функции" id="collapsible-nav-dropdown"
                                className={style.navigationDropdown}>
                            <NavDropdown.Item href="/lecturers">Управление преподавателями</NavDropdown.Item>
                            <NavDropdown.Item href="/groups">Управление студентами</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
        </Navbar>
    </div>
    )
}