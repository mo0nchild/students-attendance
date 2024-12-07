import { IDisciplineInfo } from "./discipline"
import { IGroupInfo } from "./group"
import { IStudentInfo } from "./student"

export interface ILessonInfo {
    id: number
    theme: string
    time: string
    discipline: IDisciplineInfo
    groups: IGroupInfo[]
}
export interface INewLesson {
    theme: string
    disciplineId: number
    time: string
    groups: number[]
}
export interface IUpdateLesson {
    id: number
    theme: string
    disciplineId: number
    time: string
    groupIds: number[]
}
export interface IStudentOnLesson {
    student: IStudentInfo
    time: string | null
}