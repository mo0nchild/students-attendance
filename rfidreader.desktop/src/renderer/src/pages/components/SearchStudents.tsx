import { ISearchInfo } from "@renderer/models/student"
import { studentService } from "@renderer/services/StudentService"
import { CSSProperties, useCallback, useEffect, useState } from "react"
import { Form, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export interface SearchStudentsProps {
    readonly searchLength?: number
}
export function SearchStudents({searchLength = 4}: SearchStudentsProps = {}): JSX.Element {
    const [ searchValue, setSearchValue ] = useState<string>('')
    const [ searchInfo, setSearchInfo ] = useState<ISearchInfo[]>()
    useEffect(() => {
        if (!searchValue || searchValue.length < searchLength) {
            setSearchInfo(undefined)
            return
        }
        (async () => {
            setSearchInfo((await studentService.searchStudents(searchValue)).data)
        })().then(() => {})
            .catch(error => console.log(error))
    }, [searchValue])
    const onSearchChangeHandler = useCallback((fio: string) => {
        setSearchValue(fio)
    }, [])
    const navigate = useNavigate()
    return (
    <div style={searchRootStyle}>
        <Form.Group className='mb-3 w-100'>
            <Form.Label>Поиск студента:</Form.Label>
            <Form.Control type='text' maxLength={50} placeholder='Введите ФИО для поиска' 
                onChange={event => onSearchChangeHandler(event.target.value)}/>  
        </Form.Group> 
        {
        (() => {
            if (searchValue.length <= 0) return <></>
            return (
            <div className='d-flex flex-column' style={{
                ...foundedRecordStyle, 
                ...(!searchInfo || searchInfo.length <= 0 ? {
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: 'max-content',
                    padding: 'none'
                } : {
                    width: '100%'
                })
            }}>
            {(() => {
                if (!searchInfo) return (
                <div className='d-flex flex-column align-items-center'>
                    <Spinner className='mb-3' animation='border' /> 
                    <p className='m-0'>Поиск студента...</p>
                </div>
                )
                else if (searchInfo.length <= 0) return (
                <div>
                    Студент не найден
                </div>
                )
                return (<>
                    <h3 className='mb-3'>Найденные результаты:</h3>
                    <div style={{overflowY: 'auto', height: '100%'}}>
                    {
                    searchInfo.map((item, index) => {
                        return (
                        <div className='w-100 mb-3' key={`result-${index}`} >
                            <p style={groupNameStyle}>
                                {`${item.group.faculty} ${item.group.name}`}
                            </p>
                            { 
                            item.students.map((student, i) => {
                                const studentFIO = `${student.surname} ${student.name} ${student.patronymic}`
                                const [ left, right ] = studentFIO.split(new RegExp(searchValue, "i"))
                                const studentRef = `/students/${item.group.id}/${item.group.name}/${student.id}`
                                return (
                                <div style={{cursor: 'pointer'}} onClick={() => navigate(studentRef)}
                                    key={`result-${index}-${i}`}>
                                    <span>{left}</span>
                                    <span style={searchValueStyle}>{searchValue}</span>
                                    <span>{right}</span>
                                </div>
                                )
                            }) 
                            }
                        </div>
                        )
                    })
                    }
                    </div>
                </>)
            })()}
            </div>
            )
        })()
        }
    </div>
    )
}
const searchRootStyle: CSSProperties = {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    cursor: 'default'
}
const foundedRecordStyle: CSSProperties = {
    maxHeight: '360px',
    backgroundColor: '#242424',
    padding: '18px',
    borderRadius: '10px',
    border: '1px solid #FFF'
}
const groupNameStyle: CSSProperties = {
    margin: '0', 
    textDecoration: 'underline', 
    cursor: 'default'
}
const searchValueStyle: CSSProperties = {
    color: 'yellowgreen'
}