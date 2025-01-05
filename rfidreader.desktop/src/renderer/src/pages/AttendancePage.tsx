/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useScanner } from "@core/hooks/scanner";
import ModalWindow from "@renderer/components/modal/ModalWindow";
import { IDisciplineInfo } from "@renderer/models/discipline";
import { IGroupInfo } from "@renderer/models/group";
import { attendanceService } from "@renderer/services/AttendanceService";
import { disciplineService } from "@renderer/services/DisciplineService";
import { groupService } from "@renderer/services/GroupService";
import { Children, CSSProperties, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'
import { GroupAttendance } from "./components/GroupAttendance";
import { NavigationTreeView } from "./components/NavigationTreeView";
import { DisciplineSchedule } from "./components/DisciplineSchedule";
import { LessonContextProvider, useLessonContext } from "./contexts/LessonContext";
import LessonInfo from "./components/LessonInfo";

type RfidScannerInfo = { code: string, time: Date }

export default function AttendancePage(): JSX.Element {    
    const [ discipline, setDiscipline ] = useState<IDisciplineInfo | null>(null)
    const [ currentGroup, setCurrentGroup ] = useState<IGroupInfo | null>(null)
    
    const rfidCodes = useRef<RfidScannerInfo[]>([])
    const lessonId = useRef<number>()

    const [ updateUuid, setUpdateUuid ] = useState<string>(uuidv4())
    const [ scanning, setScanning ] = useState<boolean>(false)
    const { disciplineId, groupId } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if(!disciplineId) throw 'Не указан ИД дисциплины';
        if(!groupId) throw 'Не указан ИД группы';
        (async() => {
            const disciplineResponse = (await disciplineService.getAllDisciplines()).data
                .find(it => it.id == parseInt(disciplineId!))
            if (disciplineResponse != undefined) {
                setDiscipline(disciplineResponse)
            }
            else throw 'Дисциплина не найдена'
            const groupResponse = (await groupService.getAllGroups()).data.find(it => it.id == parseInt(groupId))
            if (groupResponse != undefined) {
                setCurrentGroup(groupResponse)
            }
            else throw 'Группа не найдена'
        })().catch(error => console.log(error))

    }, [disciplineId, updateUuid, groupId])
    useScanner(value => {
        if(value != undefined && value.length > 0) {
            rfidCodes.current.push({ code: value, time: new Date() })
        }
    }, scanning)
    useEffect(() => {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
            activeElement.blur()
        }
        if (!scanning && rfidCodes.current.length > 0 && lessonId.current) {
            attendanceService.addAttendances({
                lessonId: lessonId.current,
                rfidCodes: rfidCodes.current.map(item => {
                    return { code: item.code, time: convertDateToString(item.time) }
                })
            })
                .then(() => {
                    setUpdateUuid(uuidv4())
                    rfidCodes.current = []
                })
                .catch(error => {
                    console.log(error)
                    alert('Не удалось выполнить запрос')
                })
        }
    }, [scanning])
    return (
    <div>
    <LessonContextProvider>
        <Container fluid='md' className='mb-5'>
            <div style={pageHeaderStyle}>
                <a style={headerLinkStyle} onClick={() => navigate('/')}>&#8592;&nbsp;
                    <span style={{textDecoration: 'underline', textUnderlineOffset: '5px'}}>Назад</span>
                </a>
                <h2 style={{display: 'inline-block'}}>Списки занятий [{discipline?.name}]</h2>
            </div>
            <Row className='justify-content-end'>
                <Col sm={12} md={12} lg={4} xl={3}>
                    <RenderRightMenu disciplineId={disciplineId}/>
                </Col>
                <Col sm={12} md={12} lg={8} xl={9} className='mb-4'>
                    <><div className='mb-4'>
                    {(() => {
                        return currentGroup
                            ? <GroupAttendance currentGroup={currentGroup} discipline={discipline!} 
                                onScanning={id => {
                                    lessonId.current = id
                                    setScanning(true)
                                }}/>
                            : <div className='d-flex justify-content-center'>
                                <p className='fs-3'>Выберите группу</p>
                            </div>
                    })()}
                    </div>
                    <Switcher>
                        <DisciplineSchedule discipline={discipline} group={currentGroup}/>
                        <LessonInfo group={currentGroup}/>
                    </Switcher></>
                </Col>
            </Row>
        </Container>
    </LessonContextProvider>
    <ModalWindow isOpen={scanning} onClose={() => {
        setScanning(false)
        rfidCodes.current = []
    }}>
        <div style={scannerModalStyle}>
            <Spinner animation="grow" />
            <p>Сканирование пропусков...</p>
            <Button onClick={() => setScanning(false)}>Зарегистрировать посещения</Button>
        </div>
    </ModalWindow>
    </div>
    )
}
function Switcher({children}: PropsWithChildren): JSX.Element {
    const [ schedulerComponent, lessonComponent ] = useMemo(() => {
        const result = [] as JSX.Element[]
        Children.forEach(children, (child => {
            if ((child as any).type == DisciplineSchedule) result[0] = child! as JSX.Element
            if ((child as any).type == LessonInfo) result[1] = child! as JSX.Element
        }))
        if (result.length < 2) throw Error('Switcher children is wrong type')
        return result
    }, [children])
    const lessonContext = useLessonContext()
    return lessonContext.selectedLessonId ? lessonComponent : schedulerComponent
}
interface RenderRightMenuProps { disciplineId: string | undefined }

function RenderRightMenu({disciplineId}: RenderRightMenuProps): JSX.Element {
    const { selectLesson } = useLessonContext()
    const navigate = useNavigate()

    const onChangeGroupHandler = useCallback((disciplineId: number, group: IGroupInfo) => {
        selectLesson(undefined)
        navigate(`/attendance/${disciplineId}/${group.id}`)
    }, [selectLesson, navigate])
    return (
    <Container fluid >
        <Row className='gy-2 gy-lg-3 gx-3 mb-4 justify-content-center'>
            <Col sm={12} md={6} lg={12}>
                <div style={treeViewStyle}>
                    <p style={{marginBottom: '6px'}}>Дисциплины и группы:</p>
                    <div style={{height: '1px', backgroundColor: 'white', marginBottom: '10px'}}></div>
                    <NavigationTreeView onClick={onChangeGroupHandler}/>
                </div>
            </Col>
            <Col sm={12} md={6} lg={12}>
                <Button className='w-100' onClick={() => navigate(`/lessons/${disciplineId}`)}>
                    Добавить занятие
                </Button>
            </Col>
        </Row>
    </Container>
    )
}

function convertDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
const pageHeaderStyle: CSSProperties = {
    marginBottom: '14px', 
}
const headerLinkStyle: CSSProperties = { 
    color: 'white', 
    display: 'inline-block', 
    marginRight: '10px',
}
const scannerModalStyle: CSSProperties = {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    gap: '10px'
}
const treeViewStyle: CSSProperties = {
    backgroundColor: '#242424', 
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid white',
}