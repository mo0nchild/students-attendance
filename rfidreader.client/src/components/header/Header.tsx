import { Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import style from './Header.module.css'

export default function Header(): JSX.Element {
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
                <Offcanvas.Body>
                    <Nav className='me-auto my-2 my-lg-0' navbarScroll>
                        <Nav.Link className={style.navigationRef} href='/lessons'>Занятия</Nav.Link>
                        <Nav.Link className={style.navigationRef} href='/groups'>Студенты</Nav.Link>
                        <NavDropdown title="Преподаватели" id="collapsible-nav-dropdown"
                                className={style.navigationDropdown}>
                            <NavDropdown.Item href="/lecturers">Управление преподавателями</NavDropdown.Item>
                            <NavDropdown.Item href="/disciplines">Управление дисциплинами</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
        </Navbar>
    </div>
    )
}