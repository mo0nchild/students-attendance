import { IGroupInfo } from "./group"

export interface IStudentInfo {
    id: number
    name: string
    surname: string
    patronymic: string
    rfidCode: string
    group: IGroupInfo 
}
export interface INewStudent {
    name: string
    surname: string
    patronymic: string
    rfidCode: string
    groupId: number
}
export interface IUpdateStudent {
    id: number
    name: string
    surname: string
    patronymic: string
    groupId: number
    rfidCode: string
}