import { IStudentInfo } from "./student"

export interface IAttendanceInfo {
    id: number
    time: string
    student: IStudentInfo
}
export interface INewAttendance {
    lessonId: number
    rfidCodes: IRfidCode[]
}
export interface IRfidCode {
    time: string
    code: string
}