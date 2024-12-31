import { IAttendanceInfo, INewAttendance } from "@core/models/attendance"
import $api from "@core/utils/api"
import { type AxiosResponse } from "axios"

class AttendanceService {
    public async getAttendancesByLesson(lessonId: number): Promise<AxiosResponse<IAttendanceInfo[]>> {
        return await $api.get(`/attendance/getAll/lesson/${lessonId}`)
    }
    public async addAttendances(attendance: INewAttendance): Promise<AxiosResponse> {
        return await $api.post(`/attendance/add`, attendance)
    }
    public async removeAttendance(rfid: string, lessonId: number): Promise<AxiosResponse> {
        return await $api.delete(`/attendance/remove/${rfid}/${lessonId}`)
    }
    public async removeAllAttendances(lessonId: number): Promise<AxiosResponse> {
        return await $api.delete(`/attendance/removeAll/${lessonId}`)
    }
}
export const attendanceService = new AttendanceService()