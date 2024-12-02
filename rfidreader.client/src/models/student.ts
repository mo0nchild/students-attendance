export interface IStudentInfo {
    id: number,
    name: string,
    surname: string,
    patronymic: string,
    rfidCode: string,
    group: IGroupInfo
}

export interface IGroupInfo {
    id: number,
    name: string,
    faculty: string
}