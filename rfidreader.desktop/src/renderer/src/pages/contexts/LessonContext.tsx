/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { INewAttendance } from "@renderer/models/attendance"
import { IGroupAttendancesOnLesson } from "@renderer/models/lesson"
import { attendanceService } from "@renderer/services/AttendanceService"
import { lessonService } from "@renderer/services/LessonService"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid'

export type LessonSearchInfo = { disciplineId: number, groupId: number }

export interface LessonContextType {
    setLessonSearchInfo: (info: LessonSearchInfo) => void,

    setAttendance: (rfidCode: string, lessonId: number) => Promise<void>
    removeAttendance: (rfidCode: string, lessonId: number) => Promise<void>
    attendances: IGroupAttendancesOnLesson | undefined,
    
    selectedLessonId: number | undefined,
    selectLesson: (id: number | undefined) => void,
}
const LessonContext = createContext<LessonContextType | null>(null)

export interface LessonContextProviderProps {
    children: React.ReactElement,
}
export function LessonContextProvider(props: LessonContextProviderProps): JSX.Element {
    const [ updateUuid, setUpdateUuid ] = useState<string>(uuidv4())
    const [ searchInfo, setSearchInfo ] = useState<LessonSearchInfo>()
    const [ selectedLessonId, setSelectedLesson ] = useState<number>()
    const [ attendances, setAttendances ] = useState<IGroupAttendancesOnLesson>()
    useEffect(() => {
        if(!searchInfo) return
        (async () => {
            const { disciplineId, groupId } = searchInfo
            const lessonsResponse = await lessonService.getLessonsByGroup(disciplineId, groupId)
            setAttendances(lessonsResponse.data)
        })().catch(error => console.log(error))
    }, [searchInfo, updateUuid])
    const setAttendance = useCallback(async(rfidCode: string, lessonId: number) => {
        const request = {
            lessonId,
            rfidCodes: [ {code: rfidCode, time: convertDateToString(new Date())} ]
        } as INewAttendance
        try {
            if ((await attendanceService.addAttendances(request)).status == 200) {
                setUpdateUuid(uuidv4())
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            window.electron.ipcRenderer.send('focus-fix')
            console.log(error)
        }
    }, [])
    const removeAttendance = useCallback(async(rfidCode: string, lessonId: number) => {
        try {
            if ((await attendanceService.removeAttendance(rfidCode, lessonId)).status == 200) {
                setUpdateUuid(uuidv4())
            }
        }
        catch(error) {
            alert('Ошибка выполнения запроса')
            window.electron.ipcRenderer.send('focus-fix')
            console.log(error)
        }
    }, [])
    return <LessonContext.Provider value={{
        selectedLessonId, 
        selectLesson: id => setSelectedLesson(id),
        attendances,
        setLessonSearchInfo: info => setSearchInfo(info),
        setAttendance,
        removeAttendance
    }}>
        {props.children}
    </LessonContext.Provider>
}
export const useLessonContext = () => useContext(LessonContext) as LessonContextType

function convertDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}