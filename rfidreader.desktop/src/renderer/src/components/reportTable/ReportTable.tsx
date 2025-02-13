/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ILessonStudentInfo } from "@renderer/models/lesson"
import { convertToDDMM } from "@renderer/utils/processing"
import { CSSProperties, useCallback, useEffect, useMemo, useState } from "react"
import { Table } from "react-bootstrap"

import style from './ReportTable.module.css'

export type StudentAttendance = { 
    studentFIO: string, 
    checks: boolean[], 
    studentId: number,
    rfidCode: string 
}
type TableClickedEvent = React.MouseEvent<HTMLElement, MouseEvent>
type ContextPosition = { x: number, y: number }

const contextOffset = { offsetX: 10, offsetY: 30 }

export type AttendanceContextMenuType = {
    name: string,
    onClick: (data: StudentAttendance & {lessonId: number}) => void
}
export type LessonContextMenuType = {
    name: string,
    onClick: (data: {lessonId: number}) => void
}
export interface ReportTableProps {
    lessons: ILessonStudentInfo[],
    attendanceContext?: AttendanceContextMenuType[]
    lessonContext?: LessonContextMenuType[],
    currentLessonId?: number
}
export function ReportTable({ 
    lessons, 
    attendanceContext, 
    lessonContext,
    currentLessonId 
}: ReportTableProps): JSX.Element {
    const [ contextPosition, setContextPosition ] = useState<ContextPosition>()
    const [ selectedAttendance, setSelectedAttendance ] = useState<StudentAttendance & {lessonId: number}>()
    const [ selectedLesson, setSelectedLesson ] = useState<{lessonId: number}>()
    
    const windowClickHandler = () => setContextPosition(undefined)
    const escapePressedHandler = (event: KeyboardEvent) => {
        if (event.key == 'Escape') setContextPosition(undefined)
    }
    useEffect(() => {
        window.addEventListener('click', windowClickHandler)
        window.addEventListener('resize', windowClickHandler)
        window.addEventListener('keydown', escapePressedHandler)

        return () => {
            window.removeEventListener('click', windowClickHandler)
            window.removeEventListener('resize', windowClickHandler)    
            window.removeEventListener('keydown', escapePressedHandler)
        }
    }, [])
    useEffect(() => {
        if (!contextPosition) {
            setSelectedAttendance(undefined)
            setSelectedLesson(undefined)
        }
    }, [contextPosition])

    const students = useMemo(() => {
        const result = [] as StudentAttendance[]
        for(const item of lessons) {
            item.students.forEach(({ student, time }) => {
                const FIO = `${student.surname} ${student.name[0]}. ${student.surname[0]}.`
                const currentStudent = result.find(it => it.studentFIO == FIO) 

                if (!currentStudent) result.push({ 
                    studentFIO: FIO, 
                    checks: [ time != null ], 
                    studentId: student.id,
                    rfidCode: student.rfidCode 
                })
                else currentStudent.checks.push(time != null)
            })
        }
        return result   
    }, [lessons])
    const onContextPositionChange = useCallback((event: TableClickedEvent, actionHandler: () => void) => {
        event.stopPropagation()
        if(contextPosition == null) {
            const { top, left } = event.currentTarget.getBoundingClientRect()
            const { offsetX, offsetY } = contextOffset
            actionHandler()
            setContextPosition({ x: left + offsetX, y: top + offsetY })
        }
        else setContextPosition(undefined)
    }, [contextPosition])
    const onAttendanceClickHandler = useCallback((event: TableClickedEvent, data: StudentAttendance & { lessonId: number }) => {
        if (attendanceContext == undefined || attendanceContext.length <= 0) return
        onContextPositionChange(event, () => {
            setSelectedAttendance(data)
            setSelectedLesson(undefined)
        })
    }, [])
    const onLessonClickHandler = useCallback((event: TableClickedEvent, data: {lessonId: number}) => {
        if (lessonContext == undefined || lessonContext.length <= 0) return
        onContextPositionChange(event, () => {
            setSelectedLesson(data)
            setSelectedAttendance(undefined)
        })
    }, [])
    const borderStyleBuilder = useCallback((lessonId: number): CSSProperties => {
        return lessonId == selectedLesson?.lessonId
            ? { borderWidth: '3px', borderColor: 'orange' } as CSSProperties
            : (lessonId == currentLessonId
                ? { borderWidth: '3px', borderColor: 'darkorchid' } as CSSProperties 
                : { }
            )
    }, [currentLessonId, selectedLesson?.lessonId])
    return (
    <div>
        <Table bordered hover style={{margin: '0px', boxSizing: 'border-box', cursor: 'default', userSelect: 'none'}}>
        <thead>
            <tr>
                <th style={{color: 'white', width: '200px', minWidth: '200px', textAlign: 'center'}}>ФИО</th>
                {
                    lessons.map((item, index) => {
                        return (
                        <th key={`head-cell#${index}`} style={{
                            width: '20px', 
                            color: 'white', 
                            cursor: 'cell',
                            textAlign: 'center',
                            ...borderStyleBuilder(item.lessonId)
                        }}
                            onClick={event => onLessonClickHandler(event, { lessonId: item.lessonId })}>
                            {convertToDDMM(item.time)}
                        </th>
                        )
                    })
                }
                <th style={{width: '60px', color: 'white', textAlign: 'center'}}>%</th>
                <th style={{borderLeft: '0px', borderRight: '0px', width: 'auto'}}></th>
            </tr>
        </thead>
        <tbody>
        {
        students.sort((a, b) => a.studentFIO.localeCompare(b.studentFIO)).map((info, index) => {
            return (
            <tr key={`row#${index}`}>
                <td style={{color: 'white'}}>{info.studentFIO}</td>
                { info.checks.map((it, i) => (
                    <td key={`row-cell#${i}`} style={{
                        textAlign: 'center',
                        cursor: 'pointer', 
                        background: (() => {
                            if (selectedAttendance) {
                                const { studentId, lessonId } = selectedAttendance
                                if (lessons[i].lessonId == lessonId && studentId == info.studentId) {
                                    return '#fafafa88'
                                }
                            }
                            return it ? '#67ff6488' : '#ff806488'
                        })(),
                        color: 'black',
                        fontSize: '20px',
                        padding: '0px',
                        ...borderStyleBuilder(lessons[i].lessonId)
                    }} onClick={event => onAttendanceClickHandler(event, { ...info, lessonId: lessons[i].lessonId })}>
                        {it ? '+' : '-'}
                    </td>
                )) }
                <td style={{color: 'white'}}>
                    {((info.checks.filter(it => it).length / lessons.length) * 100).toFixed(2)}%
                </td>
            </tr>
            )
        })
        }
        </tbody>
        <tfoot>
            <tr>
                <td style={{color: 'white', textDecoration: 'underline'}}>Статистика:</td>
                {
                lessons.map((item, index) => {
                    const stat = item.students.filter(it => it.time != null).length / item.students.length
                    return (
                    <td key={`foot-cell#${index}`} style={{
                        textAlign: 'center', 
                        color: 'white',
                        ...borderStyleBuilder(item.lessonId)
                    }}>
                        {((stat * 100) || 0).toFixed(2)}%
                    </td>
                    )
                })
                }
            </tr>
        </tfoot>
    </Table>
    <div className={style.contextMenu} style={contextMenuStyle(contextPosition)}>
    {(() => {
        if (selectedAttendance && attendanceContext) {
            return attendanceContext.map((item, index) => {
                return <button key={`context-btn#${index}`} onClick={() => item.onClick(selectedAttendance)}>
                    {item.name}
                </button>
            })
        }
        else if (selectedLesson && lessonContext) {
            return lessonContext.map((item, index) => {
                return <button key={`context-btn#${index}`} onClick={() => item.onClick(selectedLesson)}>
                    {item.name}
                </button>
            })
        }
        else return <></>
    })()}
    </div>
    </div>
    )
}
const contextMenuStyle = (position: ContextPosition | undefined): CSSProperties => {
    return {
        display: !position ? 'none' : 'flex',
        position: 'absolute',
        top: !position ? '0px' : `${position.y.toFixed(0)}px`,
        left: !position ? '0px' : `${position.x.toFixed(0)}px`,
    }
}