export interface IDisciplineInfo {
    id: number
    name: string
}
export interface INewDiscipline {
    name: string
    lecturerId: number
}
export interface IUpdateDiscipline {
    id: number
    name: string
    lecturerId: number
}