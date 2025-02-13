/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Processing, { LoadingStatus } from "@components/processing/Processing"
import { IGroupInfo } from "@core/models/group"
import { AccordionList, AccordionListData } from "@renderer/components/accordionList/AccordionList"
import { getStudentsFromString, StudentFileData } from "@renderer/utils/fileSystem"
import { groupBy } from "@renderer/utils/processing"
import { groupService } from "@services/GroupService"
import { studentService } from "@services/StudentService"
import { createRef, CSSProperties, useCallback, useEffect, useMemo, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid'
import { SearchStudents } from "./components/SearchStudents"
import { IStudentInfo } from "@renderer/models/student"

const groupNameRef = createRef<HTMLInputElement>()
const facultyRef = createRef<HTMLInputElement>()
const updateCheckRef = createRef<HTMLInputElement>()

type StudentsInGroup = { count: number, id: number }

export default function GroupPage(): JSX.Element {
    const [groups, setGroups] = useState<IGroupInfo[]>()
    const [selected, setSelected] = useState<IGroupInfo>()
    const [status, setStatus] = useState<LoadingStatus>('loading')
    const [updateUuid, setUpdateUuid] = useState<string>(uuidv4())
    const [studentsInGroup, setStudentsInGroup] = useState<StudentsInGroup[]>([])
    const navigator = useNavigate()
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
        if (facultyRef.current!.value == '') {
            alert('Название факультета не установлено')
            return window.electron.ipcRenderer.send('focus-fix')
        }
        if (groupNameRef.current!.value == '') {
            alert('Название группы не установлено')
            return window.electron.ipcRenderer.send('focus-fix')
        }
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
            window.electron.ipcRenderer.send('focus-fix')
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
            window.electron.ipcRenderer.send('focus-fix')
            console.log(error)
        }
    }, [])
    const onImportingHander = useCallback(async (id: number) => {
        const filePath = await window.api.openFileDialog()
        if (filePath) {
            const text = await window.api.getFileData({ path: filePath })
            const data = await getStudentsFromString(text)
            if (data.length <= 0) {
                alert('Импортированный список пуст')
                return  window.electron.ipcRenderer.send('focus-fix')
            }
            const currentStudents = (await studentService.getStudentsByGroup(id)).data
            const checkSize = data.filter(item => !currentStudents.some(it => studentsEquals(it, item)))
            if (checkSize.length <= 0) {
                alert('Все студенты из списка уже добавлены')
                return window.electron.ipcRenderer.send('focus-fix')
            }
            navigator(`/importing/${id}`, { state: { filePath } })
        }
    }, [navigator])
    useEffect(() => {
        groupNameRef.current!.value = (selected == null ? '' : selected.name)
        facultyRef.current!.value = (selected == null ? '' : selected.faculty)
    }, [selected, updateUuid])
    const clearInputForm = () => {
        updateCheckRef.current!.checked = false
        setSelected(undefined)
    }
    const groupedByFaculty = useMemo(() => groups ? groupBy(groups, item => item.faculty) : undefined, [groups])
    return (
    <div>
    <Container fluid='md'>
        <div style={pageHeaderStyle}>
            <h2 style={{display: 'inline-block'}}>Управление группами</h2>
        </div>
        <Row className='gy-2 gy-lg-3 gx-3 mb-3 justify-content-center mt-4'>
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
        <Row className='gy-2 gy-lg-3 gx-3 mb-4 justify-content-center'>
            <Col sm={6} md={6} lg={4} style={{padding: 'none'}}>
                <Button style={{width: '100%'}} onClick={onApplyGroupHandler}>
                    { selected == null ? 'Добавить' : 'Обновить' }
                </Button>
            </Col>
            <Col sm={6} md={6} lg={4}>
                <Form.Check type='checkbox' disabled={selected == null} label='Обновление' 
                    ref={updateCheckRef} onChange={(event) => {
                        const { checked } = event.currentTarget
                        if (checked == false && selected != null) {
                            setSelected(undefined)
                        }
                    }}
                />
            </Col>
        </Row>
        <Row className='gy-2 gy-lg-3 gx-3 mb-4 justify-content-center'>
            <Col sm={12} md={12} lg={8}>
                <SearchStudents/>
            </Col>
        </Row>
        <Row className='justify-content-center flex-grow-1'>
            <Col sm={12} md={12} lg={8}>
                <Processing status={status}>
                    <AccordionList<IGroupInfo & AccordionListData> listData={groupedByFaculty} contextMenu={item => {
                        return [
                            {
                                name: 'Перейти к группе',
                                onClick: () => {
                                    console.log(item)
                                    navigator(`/students/${item.id}/${item.name}`)
                                }
                            },
                            {
                                name: 'Выбрать группу',
                                onClick: () => onSelectionHandler(item)
                            },
                            {
                                name: 'Удалить группу',
                                onClick: () => onRemoveGroupHandler(item)
                            },
                            (() => {
                                // const students = studentsInGroup.find(it => it.id == item.id)
                                // if (students && students.count <= 0) {
                                //     return {
                                //         name: 'Импортировать',
                                //         onClick: () => {
                                //             onImportingHander(item.id)
                                //         }
                                //     }
                                // }
                                // else return undefined
                                return {
                                    name: 'Импортировать',
                                    onClick: () => onImportingHander(item.id)
                                }
                            })()
                        ]
                    }}
                    additionalInfo={item => {
                        return `Кол-во студентов: ${studentsInGroup.find(it => it.id == item.id)?.count ?? 0}`   
                    }} minListLines={5}/>
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
function studentsEquals(student1: IStudentInfo, student2: StudentFileData): boolean {
    const studentFIO1 = `${student1.surname} ${student1.name} ${student1.patronymic}`
    const studentFIO2 = `${student2.surname} ${student2.name} ${student2.patronymic}`
    return studentFIO1 == studentFIO2
}

